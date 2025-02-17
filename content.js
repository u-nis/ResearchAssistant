let popupIcon = null;
let responseBox = null;
chrome.runtime.sendMessage({ type: 'clear-chat' }, (response) => {
    console.log("Clear chat response:", response);
  });
  
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


document.addEventListener("mousedown", (e) => {
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
  popupIcon.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12" y2="8"></line>
  </svg>`;
  
  Object.assign(popupIcon.style, {
    position: "absolute",
    left: `${window.scrollX + rect.right + 5}px`,
    top: `${window.scrollY + rect.top - 5}px`,
    cursor: "pointer",
    backgroundColor: "#ffffff",
    padding: "5px",
    borderRadius: "50%",
    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
    zIndex: "1000"
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


// Open the response box beneath the selected text and stream Gemini output.
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

  
  // Set up the initial content.
  responseBox.innerHTML = `
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
    <div style="font-family: 'Google Sans', sans-serif; font-weight: 500; color: #1a73e8;">Research Assistant</div>
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
      color: #1a73e8;
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
  
  // Open a long-lived connection (port) for streaming.
  const port = chrome.runtime.connect({ name: 'explanation-stream' });
  port.postMessage({ type: 'get-explanation', term: selectedText });
  
  // Clear the placeholder text.
  const llmDiv = document.getElementById("llmResponse");
  let currentText = "";
  
  // Listen for streamed tokens.
  port.onMessage.addListener((msg) => {
    if (msg.token) {
      currentText += msg.token;
      // Format the accumulated text
      llmDiv.innerHTML = formatStreamingResponse(currentText);
    } else if (msg.done) {
      console.log("Streaming complete.");
      port.disconnect();
    } else if (msg.error) {
      llmDiv.innerHTML = `<div style="color: #d32f2f;">Error: ${msg.error}</div>`;
      port.disconnect();
    }
  });
}


function formatStreamingResponse(text) {
  try {
    // Remove extra asterisks and spaces
    let formatted = text.trim();

    // Format **bold** text → <strong>
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Format *italic* text → <em>
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Format `inline code` → <code>
    formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Split text into lines for further processing
    let lines = formatted.split('\n');

    let output = [];
    let inList = false;

    lines.forEach(line => {
      // Handle bullet points (* or -)
      if (/^\s*[\*\-]\s+(.*)/.test(line)) {
        if (!inList) {
          inList = true;
          output.push('<ul>'); // Start unordered list
        }
        let item = line.replace(/^\s*[\*\-]\s+/, '').trim();
        output.push(`<li>${item}</li>`); // Add list item
      } else {
        if (inList) {
          output.push('</ul>'); // Close list if a new non-list line starts
          inList = false;
        }

        // Format section headers like "Definition:", "Real-world applications:"
        if (/^(Definition|Real-world applications|Related key concepts):/i.test(line)) {
          output.push(`<h2>${line}</h2>`);
        } else {
          output.push(`<p>${line}</p>`);
        }
      }
    });

    if (inList) {
      output.push('</ul>'); // Close list if still open at end
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