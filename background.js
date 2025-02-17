import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = 'AIzaSyCxuRAnHlObdy4oK_LBzkvUySK7SpLppKA';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Listen for long-lived connections (ports) from content/popup.
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === 'explanation-stream') {
    port.onMessage.addListener(async (msg) => {
      if (msg.type === 'get-explanation') {
        const term = msg.term || "example term";
        try {
          const prompt = createExplanationPrompt(term);
          // Start a chat with the prompt as history.
          const chat = model.startChat({
            history: [
              { role: "user", parts: [{ text: prompt }] }
            ]
          });
          // Send a streaming message.
          const result = await chat.sendMessageStream(prompt);
          // Iterate over the streamed tokens.
          for await (const chunk of result.stream) {
            const token = chunk.text();
            console.log("Streaming token:", token);
            port.postMessage({ token });
          }
          // Indicate that streaming is complete.
          port.postMessage({ done: true });
        } catch (error) {
          console.error("Error in streaming chat:", error);
          port.postMessage({ error: error.message });
        }
      }
    });
  }
});

function createExplanationPrompt(word) {
  return `Act as an expert educator and provide a concise, precise but understandable explanation of "${word}". 
Include:
- A clear definition
- The context where it is used
- Real-world examples or applications
- Related key concepts.`;
}
