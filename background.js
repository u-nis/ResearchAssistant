import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = 'AIzaSyCxuRAnHlObdy4oK_LBzkvUySK7SpLppKA';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Global persistent chat session.
let globalChat = null;
// Cache for storing explanations
let explanationCache = {};
// Flag to prevent multiple `get-context` calls
let contextAdded = false;
// Global preset for explanation detail level ("concise", "normal", "detailed")
let currentPreset = "normal";

// Listen for persistent port connections.
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === 'explanation-stream') {
    if (!globalChat) {
      globalChat = model.startChat({});
    }

    port.onMessage.addListener(async (msg) => {
      if (msg.type === 'get-explanation') {
        const term = msg.term || "example term";

        // Check cache before making an API call.
        if (explanationCache[term]) {
          port.postMessage({ token: explanationCache[term], done: true });
          return;
        }

        try {
          const prompt = createExplanationPrompt(term);
          const result = await globalChat.sendMessageStream(prompt);
          let fullText = "";

          for await (const chunk of result.stream) {
            const token = chunk.text();
            fullText += token;
            port.postMessage({ token });
          }

          explanationCache[term] = fullText; 
          port.postMessage({ done: true });
        } catch (error) {
          console.error("Error streaming explanation:", error);
          port.postMessage({ error: error.message });
        }
      }
    });
  }
});

// Listen for one-off messages.
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'clear-chat') {
    globalChat = model.startChat({});
    explanationCache = {};
    contextAdded = false;
    sendResponse({ success: true });
    return true;
  }
  
  if (request.type === 'add-context') {
    if (contextAdded) {
      sendResponse({ success: false, error: "Context already added." });
      return true;
    }

    const content = request.content;
    const prompt = "Use the following as context for further explanations of my terms, you do not need to respond to this message: " + content;

    if (!globalChat) {
      globalChat = model.startChat({});
    }

    // Reset cache when adding context.
    explanationCache = {};
    contextAdded = true;

    globalChat.sendMessage(prompt)
      .then(() => {
        sendResponse({ success: true });
      })
      .catch((error) => {
        console.error("Error appending context:", error);
        sendResponse({ success: false, error: error.message });
      });
      
    return true;
  }
  
  if (request.type === "update-preset") {
    // Reset the cache when preset changes.
    explanationCache = {};
    currentPreset = request.preset;
    sendResponse({ success: true });
  }
});

function createExplanationPrompt(word) {
  if (currentPreset === "concise") {
    return `Briefly explain "${word}" in one or two sentences.`;
  } else if (currentPreset === "detailed") {
    return `Provide a detailed explanation of "${word}", including its definition, real-world examples, applications, and related key concepts. the maximum length of the response should be 500 words.`;
  } else {
    // Default: normal
    return `Act as an expert educator and provide a very concise but understandable explanation of "${word}". 
Include:
- A clear definition
- Real-world examples or applications`;
  }
}
