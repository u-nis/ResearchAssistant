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

function loadCustomFont() {
  const style = document.createElement('style');
  style.textContent = `
      @font-face {
          font-family: 'Google Sans';
          src: url('https://fonts.gstatic.com/s/googlesans/v16/4UaGrENHsxJlGDuGo1OIlL3Owp4.woff2') format('woff2');
          font-weight: 400;
      }
      @font-face {
          font-family: 'Google Sans';
          src: url('https://fonts.gstatic.com/s/googlesans/v16/4UabrENHsxJlGDuGo1OIlLU94YtzCwM.woff2') format('woff2');
          font-weight: 500;
      }
      @font-face {
          font-family: 'Google Sans';
          src: url('https://fonts.gstatic.com/s/googlesans/v16/4UabrENHsxJlGDuGo1OIlLV154tzCwM.woff2') format('woff2');
          font-weight: 700;
      }
  `;
  document.head.appendChild(style);
}

loadCustomFont();

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
    @keyframes pulse {
      0% { transform: scale(0.8); opacity: 0.5; }
      50% { transform: scale(1.2); opacity: 1; }
      100% { transform: scale(0.8); opacity: 0.5; }
    }
    .dot {
      width: 8px;
      height: 8px;
      background-color: #1a73e8;
      border-radius: 50%;
    }
    #llmResponse {
      font-family: 'Google Sans', sans-serif;
      font-size: 15px;
      line-height: 1.6;
    }
    #llmResponse strong {
      font-family: 'Google Sans', sans-serif;
      font-weight: 500;
    }
    #llmResponse h2 {
      font-family: 'Google Sans', sans-serif;
      font-size: 16px;
      font-weight: 500;
      margin: 12px 0 8px;
      color: #1a73e8;
    }
    #llmResponse p {
      font-family: 'Google Sans', sans-serif;
      margin: 8px 0;
    }
    #llmResponse ul {
      font-family: 'Google Sans', sans-serif;
      margin: 8px 0;
      padding-left: 20px;
    }
    #llmResponse li {
      font-family: 'Google Sans', sans-serif;
      margin: 4px 0;
    }

    #llmResponse ul {
      list-style: none;
      padding: 0;
      margin: 8px 0;
    }

    #llmResponse li {
      display: flex;
      align-items: baseline;
      margin: 6px 0;
    }

    #llmResponse li:before {
      content: '';
      display: inline-block;
      width: 4px;
      height: 4px;
      background-color: #1a73e8;
      border-radius: 50%;
      margin-right: 10px;
      margin-top: 8px;
    }

    .bullet-point {
      display: flex;
      align-items: baseline;
      margin: 6px 0;
    }

    .bullet-dot {
      display: inline-block;
      width: 4px;
      height: 4px;
      background-color: #1a73e8;
      border-radius: 50%;
      margin-right: 10px;
      margin-top: 8px;
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

function normalizeSpacing(text) {
  // Remove multiple consecutive blank lines (more than one newline)
  return text.replace(/\n\s*\n\s*\n/g, '\n\n');
}

// ctrl z

function formatStreamingResponse(text) {
  try {
    // Clean up text first
    let cleanText = text
      .replace(/\*+/g, '')  // Remove asterisks
      .trim();

    const formattedText = cleanText
      // Format main section headers (case-insensitive, flexible dashes/spaces)
      .replace(/^(Definition|Context|Real[-\s]World Examples|Related Key Concepts):/gim, 
        (_, header) => `<div style='color: #1967D2; font-weight: bold; font-size: 16px; margin-top: 6px; margin-bottom: 2px;'>${header}:</div>`)

      // Format subsection headers and key terms with reduced spacing
      .replace(/(^|\n)([A-Za-z\s-]+):\s/g, (match, newline, p1) => {
        if (["Definition", "Context", "Real-World Examples", "Related Key Concepts"].includes(p1.toLowerCase())) {
          return match; // Prevents double formatting
        }
        return `${newline}<span style="color: #1a73e8; font-weight: 500; display: inline-block; margin-top: 2px;">${p1}:</span> `;
      })

      // Format bullet points with minimal spacing
      .replace(/\n\s*[-•*]\s*(.*?)(?:\n|$)/g, `
        <div style="display: flex; align-items: baseline; margin: 2px 0;">
          <span style="
            display: inline-block;
            width: 6px;
            height: 6px;
            background-color: #1a73e8;
            border-radius: 50%;
            margin-right: 10px;
            margin-top: 3px;
          "></span>
          <span style="flex: 1;">$1</span>
        </div>`)

      // Handle line breaks with minimal spacing
      .replace(/\n\n+/g, '<div style="margin: 2px 0;"></div>')  // Reduced from 8px to 2px
      .replace(/\n/g, '<br>')

    return formattedText.trim();
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
