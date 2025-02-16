document.addEventListener('DOMContentLoaded', function() {
    const explanationDiv = document.getElementById('explanation');
    const explainButton = document.getElementById('getExplanation');

    explainButton.addEventListener('click', async () => {
        explanationDiv.textContent = 'Loading explanation...';
        
        try {
            const response = await chrome.runtime.sendMessage({
                type: 'get-explanation'
            });

            if (response.success) {
                explanationDiv.textContent = response.data;
            } else {
                explanationDiv.textContent = 'Error: ' + response.error;
            }
        } catch (error) {
            explanationDiv.textContent = 'Error: Failed to get explanation';
            console.error(error);
        }
    });
});p
