// popup.js
document.addEventListener('DOMContentLoaded', function() {
    const explanationDiv = document.getElementById('explanation');
    const explainButton = document.getElementById('getExplanation');

    async function typeWriter(text, element) {
        const words = text.split(' ');
        for (let i = 0; i < words.length; i++) {
            element.textContent += words[i] + ' ';
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        element.textContent += ' ';
    }

    explainButton.addEventListener('click', async () => {
        explanationDiv.textContent = '';
        explainButton.disabled = true;
        
        try {
            const response = await chrome.runtime.sendMessage({
                type: 'get-explanation'
            });

            if (response.success) {
                const chunks = response.data;
                for (let chunk of chunks) {
                    if (chunk.trim()) {
                        await typeWriter(chunk.trim(), explanationDiv);
                        explanationDiv.textContent += '. ';
                    }
                }
            } else {
                explanationDiv.textContent = 'Error: ' + response.error;
            }
        } catch (error) {
            explanationDiv.textContent = 'Error: Failed to get explanation';
            console.error(error);
        } finally {
            explainButton.disabled = false;
        }
    });
});
