let popupIcon = null;
let responseBox = null;

// On mouseup, if text is selected and no response box is open, create the icon.
document.addEventListener("mouseup", () => {
  setTimeout(() => {
    const selection = window.getSelection();
    const text = selection.toString().trim();
    if (text.length > 0 && !responseBox) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      createIcon(rect, text);
    }
  }, 50);
});

// Global mousedown: if click is outside the popup icon, remove it.
// Also, if click is outside the response box, remove that too.
document.addEventListener("mousedown", (e) => {
  if (popupIcon && !popupIcon.contains(e.target)) {
    removeIcon();
  }
  if (responseBox && !responseBox.contains(e.target)) {
    removeResponseBox();
  }
});

// Create and position the icon next to the selected text.
function createIcon(rect, selectedText) {
  removeIcon(); // Clean up any existing icon
  
  popupIcon = document.createElement("div");
  popupIcon.textContent = "X"; // Your icon text
  popupIcon.style.position = "absolute";
  popupIcon.style.left = `${window.scrollX + rect.right + 5}px`;
  popupIcon.style.top = `${window.scrollY + rect.top - 5}px`;
  popupIcon.style.cursor = "pointer";
  popupIcon.style.fontSize = "18px";
  popupIcon.style.backgroundColor = "white";
  popupIcon.style.zIndex = "1000";
  document.body.appendChild(popupIcon);
  
  // Use mousedown so it fires before the selection clears.
  popupIcon.addEventListener("mousedown", (e) => {
    e.stopPropagation(); // Prevents global handler from immediately removing it.
    removeIcon(); // Remove the icon immediately on click.
    openResponseBox(rect, selectedText);
  });
}

// Remove the popup icon.
function removeIcon() {
  if (popupIcon) {
    popupIcon.remove();
    popupIcon = null;
  }
}

// Open the response box beneath the selected text.
function openResponseBox(rect, selectedText) {
  removeResponseBox(); // Clear any existing box.
  
  responseBox = document.createElement("div");
  responseBox.style.position = "absolute";
  responseBox.style.left = `${window.scrollX + rect.left}px`;
  responseBox.style.top = `${window.scrollY + rect.bottom + 10}px`;
  responseBox.style.width = "250px";
  responseBox.style.height = "150px";
  responseBox.style.backgroundColor = "white";
  responseBox.style.border = "1px solid black";
  responseBox.style.borderRadius = "5px";
  responseBox.style.padding = "10px";
  responseBox.style.boxShadow = "2px 2px 10px rgba(0,0,0,0.3)";
  responseBox.style.zIndex = "1000";
  responseBox.innerHTML = `
    <div style="font-size:14px;font-weight:bold;margin-bottom:5px;">Research Assistant</div>
    <div id="llmResponse" style="min-height:80px;">Loading...</div>
  `;
  document.body.appendChild(responseBox);
  
  // Placeholder: simulate an API response after 1 second.
  setTimeout(() => {
    const llmDiv = document.getElementById("llmResponse");
    if (llmDiv) {
      llmDiv.textContent = "This is where the LLM response will go!";
    }
  }, 1000);
}

// Remove the response box.
function removeResponseBox() {
  if (responseBox) {
    responseBox.remove();
    responseBox = null;
  }
}
