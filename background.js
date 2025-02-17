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

/* --- GET-EXPLANATION (persistent port) --- */
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === 'explanation-stream') {
    if (!globalChat) {
      globalChat = model.startChat({});
      console.log("Started initial chat session.");
    }

    port.onMessage.addListener(async (msg) => {
      if (msg.type === 'get-explanation') {
        const term = msg.term || "example term";

        // Check cache before making an API call
        if (explanationCache[term]) {
          console.log(`Returning cached explanation for '${term}'.`);
          port.postMessage({ token: explanationCache[term], done: true });
          return;
        }

        try {
          const prompt = createExplanationPrompt(term);
          console.log("Appending explanation prompt:", prompt);
          const result = await globalChat.sendMessageStream(prompt);
          let fullText = "";

          for await (const chunk of result.stream) {
            const token = chunk.text();
            console.log("Streaming token (explanation):", token);
            fullText += token;
            port.postMessage({ token });
          }

          console.log("Full explanation response:", fullText);
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

/* --- GET-CONTEXT (one-off message) --- */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'clear-chat') {
    globalChat = model.startChat({});
    explanationCache = {}; 
    contextAdded = false; 
    console.log("Cleared global chat and cache (new page load).");
    sendResponse({ success: true });
    return true;
  }
  
  if (request.type === 'add-context') {
    if (contextAdded) {
      console.log("Context has already been added for this page. Ignoring duplicate request.");
      sendResponse({ success: false, error: "Context already added." });
      return true;
    }

    const content = request.content;
    console.log("Received context of length:", content.length);
    const prompt = "Use the following as context for further explanations of my terms, you do not need to respond to this message: " + content;

    if (!globalChat) {
      globalChat = model.startChat({});
      console.log("Started new chat with context.");
    }

    // Reset cache when adding context
    explanationCache = {}; 
    contextAdded = true; 

    globalChat.sendMessage(prompt)
      .then(() => {
        console.log("Context added to chat, cache reset.");
        sendResponse({ success: true });
      })
      .catch((error) => {
        console.error("Error appending context:", error);
        sendResponse({ success: false, error: error.message });
      });

    return true; // Keep the channel open for async response
  }
});

function createExplanationPrompt(word) {
  return `Act as an expert educator and provide a very concise, precise but understandable explanation of "${word}". 
Include:
- A clear definition
- Real-world examples or applications
- Related key concepts.`;
}
