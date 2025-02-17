let popupIcon = null;
let responseBox = null;

// At the very top of your content.js:
chrome.storage.sync.remove("contextIconState", () => {
});

let extensionEnabled = true; // Default is enabled

// Get the saved state from storage on load.
chrome.storage.sync.get("extensionEnabled", (data) => {
  extensionEnabled = data.extensionEnabled !== false; // default true
  if (!extensionEnabled) {
    removeIcon();
    removeResponseBox();
  }
});

// Listen for changes in storage to update the extension state.
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && changes.extensionEnabled) {
    extensionEnabled = changes.extensionEnabled.newValue;
    if (!extensionEnabled) {
      removeIcon();
      removeResponseBox();
    }
  }
});

// Clear chat on load.
chrome.runtime.sendMessage({ type: 'clear-chat' }, (response) => {
});

document.addEventListener("mouseup", () => {
  if (!extensionEnabled) return; // Do nothing if disabled.
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

document.addEventListener("mousedown", (e) => {
  if (!extensionEnabled) return; // Do nothing if disabled.
  if (popupIcon && !popupIcon.contains(e.target)) {
    removeIcon();
  }
  if (responseBox && !responseBox.contains(e.target)) {
    removeResponseBox();
  }
});

function createIcon(rect, selectedText) {
  removeIcon();

  popupIcon = document.createElement("div");
  popupIcon.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a73e8" stroke-width="2">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
    </svg>`;

  Object.assign(popupIcon.style, {
    position: "absolute",
    left: `${window.scrollX + rect.right + 5}px`,
    top: `${window.scrollY + rect.top - 5}px`,
    cursor: "pointer",
    backgroundColor: "#ffffff",
    padding: "4px",
    borderRadius: "50%",
    boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.14)",
    zIndex: "1000",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  });

  // Hover effects.
  popupIcon.addEventListener('mouseenter', () => {
    popupIcon.style.backgroundColor = '#f8f9fa';
    popupIcon.style.transform = 'scale(1.05)';
  });
  popupIcon.addEventListener('mouseleave', () => {
    popupIcon.style.backgroundColor = '#ffffff';
    popupIcon.style.transform = 'scale(1)';
  });

  document.body.appendChild(popupIcon);

  popupIcon.addEventListener("mousedown", (e) => {
    e.stopPropagation();
    removeIcon();
    openResponseBox(rect, selectedText);
  });
}

function removeIcon() {
  if (popupIcon) {
    popupIcon.remove();
    popupIcon = null;
  }
}

function openResponseBox(rect, selectedText) {
  removeResponseBox();
  
  responseBox = document.createElement("div");
  
  Object.assign(responseBox.style, {
    position: "absolute",
    left: `${window.scrollX + rect.left}px`,
    top: `${window.scrollY + rect.bottom + 10}px`,
    width: "350px",
    backgroundColor: "#ffffff",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    padding: "16px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    zIndex: "1000",
    fontFamily: "'Google Sans', sans-serif",
    fontSize: "15px",
    lineHeight: "1.0",
    letterSpacing: "0.2px",
    color: "#333333"
  });

  responseBox.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <div style="font-family: 'Open Sans', sans-serif; font-weight: 700; color: #1a73e8;">Research Assistant</div>
      <div id="closeButton" style="cursor: pointer; padding: 4px">✕</div>
    </div>
    <div id="llmResponse" style="min-height: 80px;">
      <div class="loading-animation">
        <div style="display: flex; gap: 4px; justify-content: center;">
          <div class="dot" style="animation: pulse 1s infinite"></div>
          <div class="dot" style="animation: pulse 1s infinite .2s"></div>
          <div class="dot" style="animation: pulse 1s infinite .4s"></div>
        </div>
      </div>
    </div>
  `;

  const closeButton = responseBox.querySelector('#closeButton');
  closeButton.addEventListener('click', removeResponseBox);
  
  // Inject extension-specific styles.
  const style = document.createElement('style');
  style.textContent = `
    @font-face {
      font-family: 'Open Sans';
      src: url(${chrome.runtime.getURL('fonts/OpenSans-Regular.ttf')}) format('truetype');
      font-weight: 400;
    }
    @font-face {
      font-family: 'Open Sans';
      src: url(${chrome.runtime.getURL('fonts/OpenSans-Bold.ttf')}) format('truetype');
      font-weight: 700;
    }
    @font-face {
      font-family: 'Open Sans';
      src: url(${chrome.runtime.getURL('fonts/OpenSans-italic.ttf')}) format('truetype');
      font-weight: 300;
    }
    @keyframes pulse {
      0% { transform: scale(0.8); opacity: 0.5; }
      50% { transform: scale(1.2); opacity: 1; }
      100% { transform: scale(0.8); opacity: 0.5; }
    }
    #llmResponse {
      font-family: 'Open Sans', sans-serif;
      font-size: 15px;
      line-height: 1.6;
    }
    #llmResponse strong {
      font-family: 'Open Sans', sans-serif;
      font-weight: 700;
      margin: 0;  
      padding: 0;
    }
    #llmResponse h1 {
      font-family: 'Open Sans', sans-serif;
      font-size: 18px;
      font-weight: 500;
      color: #1a73e8;
    }
    #llmResponse h2 {
      font-family: 'Open Sans', sans-serif;
      font-size: 16px;
      font-weight: 500;
      color: #557338;
    }
    #llmResponse p {
      font-family: 'Open Sans', sans-serif;
    }
    #llmResponse ul {
      font-family: 'Open Sans', sans-serif;
      padding-left: 1px;
    }
    #llmResponse ul {
      font-family: 'Open Sans', sans-serif;
      padding: 0px;
    }
    #llmResponse em {
      font-family: 'Open Sans', sans-serif;
      font-weight: 300;
    }
  `;
  
  document.head.appendChild(style);
  document.body.appendChild(responseBox);
  
  // Open a long-lived connection for streaming.
  const port = chrome.runtime.connect({ name: 'explanation-stream' });
  port.postMessage({ type: 'get-explanation', term: selectedText });
  
  const llmDiv = document.getElementById("llmResponse");
  let currentText = "";
  
  // Listen for streamed tokens.
  port.onMessage.addListener((msg) => {
    if (msg.token) {
      currentText += msg.token;
      llmDiv.innerHTML = formatStreamingResponse(currentText);
    } else if (msg.done) {
      port.disconnect();
    } else if (msg.error) {
      llmDiv.innerHTML = `<div style="color: #d32f2f;">Error: ${msg.error}</div>`;
      port.disconnect();
    }
  });
}

function formatStreamingResponse(text) {
  try {
    let formatted = text.trim();
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
    formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    let lines = formatted.split('\n');
    let output = [];
    let inList = false;
    
    lines.forEach(line => {
      if (/^\s*[\*\-]\s+(.*)/.test(line)) {
        if (!inList) {
          inList = true;
          output.push('<ul>');
        }
        let item = line.replace(/^\s*[\*\-]\s+/, '').trim();
        output.push(`<li>${item}</li>`);
      } else {
        if (inList) {
          output.push('</ul>');
          inList = false;
        }
        if (/^(Definition|Real-world applications|Related key concepts):/i.test(line)) {
          output.push(`<h2>${line}</h2>`);
        } else {
          output.push(`<p>${line}</p>`);
        }
      }
    });
    
    if (inList) {
      output.push('</ul>');
    }
    
    return output.join('');
  } catch (error) {
    console.error('Error formatting response:', error);
    return text;
  }
}

function removeResponseBox() {
  if (responseBox) {
    responseBox.remove();
    responseBox = null;
  }
}
