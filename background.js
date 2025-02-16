// background.js
const GEMINI_API_KEY = 'AIzaSyCxuRAnHlObdy4oK_LBzkvUySK7SpLppKA';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// Test term - will be replaced by selected word later
const testTerm = "Monte Carlo Simulation";

// Simplified message listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'get-explanation') {
        fetchGeminiResponse(createExplanationPrompt(testTerm))
            .then(chunks => sendResponse({success: true, data: chunks}))
            .catch(error => sendResponse({success: false, error: error.message}));
        return true;
    }
});

function createExplanationPrompt(word) {
    return `Act as an expert educator and provide a concise, precise but understandable explanation of "${word}". 
    Your explanation should include:
    - A clear, concise definition
    - The context or field where this term is commonly used
    - Real-world examples or applications
    - Any important related concepts`;
}

async function fetchGeminiResponse(prompt) {
    try {
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
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 800,
                }
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        const text = data.candidates[0].content.parts[0].text;
        
        // Split response into chunks and send each chunk
        const chunks = text.split(/[.!?]\s+/);
        return chunks;
    } catch (error) {
        console.error('Gemini API Error:', error);
        throw error;
    }
}

