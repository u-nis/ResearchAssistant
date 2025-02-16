// background.js
const GEMINI_API_KEY = 'AIzaSyCxuRAnHlObdy4oK_LBzkvUySK7SpLppKA'; // Replace with your actual API key
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'gemini-query') {
        fetchGeminiResponse(request.prompt)
            .then(response => sendResponse({success: true, data: response}))
            .catch(error => sendResponse({success: false, error: error.message}));
        return true; // Required for async response
    }
});

async function fetchGeminiResponse(prompt) {
    const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: prompt
                }]
            }]
        })
    });

    if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}
