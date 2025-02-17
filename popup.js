// For add context
document.getElementById("addContextBtn").addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => document.body.innerText,
  });
  chrome.runtime.sendMessage({ type: "add-context", content: result });
});

const toggleCheckbox = document.getElementById("toggleExtensionCheckbox");
const contextBtn = document.getElementById("addContextBtn");

// Load saved state from chrome.storage (default: enabled)
chrome.storage.sync.get("extensionEnabled", (data) => {
  const enabled = data.extensionEnabled !== false; // default true
  toggleCheckbox.checked = enabled;
  contextBtn.disabled = !enabled;
});

// Toggle extension state on checkbox change
toggleCheckbox.addEventListener("change", () => {
  const newState = toggleCheckbox.checked;
  chrome.storage.sync.set({ extensionEnabled: newState }, () => {
    contextBtn.disabled = !newState;
    // Send update to content.js
    chrome.runtime.sendMessage(
      { type: "toggle-extension", enabled: newState },
      (response) => {
        console.log("Toggle extension response:", response);
      }
    );
  });
});
