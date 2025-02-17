const addContextBtn = document.getElementById("addContextBtn");
const presetControl = document.getElementById("presetControl");
const toggleCheckbox = document.getElementById("toggleExtensionCheckbox");

// Define SVG icons as template strings.
const plusIcon = `
<svg id="contextIcon" viewBox="0 0 24 24">
  <line x1="12" y1="6" x2="12" y2="18" stroke="#fff" stroke-width="2"/>
  <line x1="6" y1="12" x2="18" y2="12" stroke="#fff" stroke-width="2"/>
</svg>
`;

const checkIcon = `
<svg id="contextIcon" viewBox="0 0 24 24">
  <polyline points="6 12 10 16 18 8" fill="none" stroke="#fff" stroke-width="2"/>
</svg>
`;

// Set initial icon (plus).
addContextBtn.innerHTML = plusIcon;

// Content Aware button click behavior.
addContextBtn.addEventListener("click", async () => {
  // Optional: add a temporary animation class.
  addContextBtn.classList.add("clicked");

  // Execute your context extraction.
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => document.body.innerText,
  });
  chrome.runtime.sendMessage({ type: "add-context", content: result });

  // Change icon to checkmark after a short delay.
  setTimeout(() => {
    addContextBtn.innerHTML = checkIcon;
    addContextBtn.classList.remove("clicked");
  }, 300);
});

// Function to update disabled styling for button and segmented control.
function updateDisabledStyles(enabled) {
  addContextBtn.disabled = !enabled;
  if (!enabled) {
    presetControl.classList.add("disabled");
  } else {
    presetControl.classList.remove("disabled");
  }
}

// On load, get state from storage (default: enabled).
chrome.storage.sync.get("extensionEnabled", (data) => {
  let enabled = data.extensionEnabled;
  if (enabled === undefined) {
    enabled = true;
    chrome.storage.sync.set({ extensionEnabled: true });
  }
  toggleCheckbox.checked = enabled;
  updateDisabledStyles(enabled);
  console.log("Popup: extensionEnabled loaded as", enabled);
});

// Listen for toggle switch changes.
toggleCheckbox.addEventListener("change", () => {
  const newState = toggleCheckbox.checked;
  chrome.storage.sync.set({ extensionEnabled: newState }, () => {
    updateDisabledStyles(newState);
    console.log("Popup: extensionEnabled updated to", newState);
    chrome.runtime.sendMessage({ type: "update-extension-state", enabled: newState });
  });
});

// Preset segmented control logic.
const radioButtons = presetControl.querySelectorAll('input[type="radio"]');
const indicator = presetControl.querySelector(".indicator");
let currentPreset = "normal"; // default preset

const updateIndicator = () => {
  let selectedIndex = 0;
  radioButtons.forEach((radio, index) => {
    if (radio.checked) {
      selectedIndex = index;
    }
  });
  indicator.style.transform = `translateX(${selectedIndex * 100}%)`;
};

radioButtons.forEach(radio => {
  radio.addEventListener("change", updateIndicator);
});

// Set initial indicator position.
updateIndicator();

// Send preset state when changed.
presetControl.addEventListener("change", () => {
  const selectedRadio = presetControl.querySelector('input[type="radio"]:checked');
  currentPreset = selectedRadio ? selectedRadio.value : "normal";
  console.log("Preset updated to:", currentPreset);
  chrome.runtime.sendMessage({ type: "update-preset", preset: currentPreset });
});
