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

// On load, restore button icon state from storage (default: plus).
chrome.storage.sync.get("contextIconState", (data) => {
  const iconState = data.contextIconState || "plus";
  addContextBtn.innerHTML = iconState === "check" ? checkIcon : plusIcon;
});

// Content Aware button click behavior.
addContextBtn.addEventListener("click", async () => {
  // Change icon to checkmark permanently and save state.
  addContextBtn.innerHTML = checkIcon;
  chrome.storage.sync.set({ contextIconState: "check" });

  // Execute your context extraction.
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => document.body.innerText,
  });
  chrome.runtime.sendMessage({ type: "add-context", content: result });
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

// On load, get extension state (default: enabled).
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

// Segmented control for presets.
const radioButtons = presetControl.querySelectorAll('input[type="radio"]');
const indicator = presetControl.querySelector(".indicator");
let currentPreset = "normal"; // default preset

// On load, get preset state (default: normal).
chrome.storage.sync.get("currentPreset", (data) => {
  currentPreset = data.currentPreset || "normal";
  radioButtons.forEach((radio) => {
    radio.checked = (radio.value === currentPreset);
  });
  updateIndicator(false); // update indicator without animation on load
  console.log("Popup: currentPreset loaded as", currentPreset);
});

const updateIndicator = (animate = true) => {
  let selectedIndex = 0;
  radioButtons.forEach((radio, index) => {
    if (radio.checked) {
      selectedIndex = index;
    }
  });
  if (!animate) {
    indicator.style.transition = "none";
  } else {
    indicator.style.transition = "transform 0.3s ease";
  }
  indicator.style.transform = `translateX(${selectedIndex * 100}%)`;
  if (!animate) {
    setTimeout(() => {
      indicator.style.transition = "transform 0.3s ease";
    }, 50);
  }
};

radioButtons.forEach(radio => {
  radio.addEventListener("change", () => {
    updateIndicator();
    const selectedRadio = presetControl.querySelector('input[type="radio"]:checked');
    currentPreset = selectedRadio ? selectedRadio.value : "normal";
    console.log("Preset updated to:", currentPreset);
    chrome.storage.sync.set({ currentPreset: currentPreset });
    chrome.runtime.sendMessage({ type: "update-preset", preset: currentPreset });
  });
});

updateIndicator();
