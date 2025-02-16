const GEMINI_API_KEY = 'AIzaSyCxuRAnHlObdy4oK_LBzkvUySK7SpLppKA';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// Listen for messages from content.js.
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'get-explanation') {
    const term = request.term || "example term";
    fetchGeminiResponse(createExplanationPrompt(term))
      .then(response => sendResponse({ success: true, data: response }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Keeps the messaging channel open for async response.
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

async function fetchGeminiResponse(prompt) {
  try {
    const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });
    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }
    const data = await response.json();
    // Return the Gemini response text.
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
}
