document.getElementById("getContextBtn").addEventListener("click", async () => {
    // Query the active tab in the current window.
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // Use chrome.scripting.executeScript to run code in the tab.
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => document.body.innerText,
    });
    
    // Send the result to the background script.
    chrome.runtime.sendMessage({ type: 'get-context', content: result });
  });
  