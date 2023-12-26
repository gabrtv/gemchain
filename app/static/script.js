const chatInput = document.querySelector('.chat-input');
const chatHistory = document.querySelector('.chat-history');
const sendButton = document.querySelector('.chat-send-button');

sendButton.addEventListener('click', () => {
  const userPrompt = chatInput.value.trim();

  if (userPrompt) {
    // Append user message to chat history
    chatHistory.innerHTML += `<div class="chat-prompt">${userPrompt}</div>`;

    // Clear input field
    chatInput.value = '';

    // Send user message to server (replace with your server-side logic)
    fetch('/prompt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt: userPrompt })
    })
    .then(response => response.json())
    .then(data => {
      // Append bot response to chat history
      chatHistory.innerHTML += `<div class="chat-response">${data.response}</div>`;
    })
    .catch(error => {
      console.error('Error:', error);
      // Handle errors gracefully (e.g., display an error message)
    });
  }
});

// Allow enter to trigger button click also
chatInput.addEventListener('keydown', (event) => {
    if (event.keyCode === 13) { // Enter key pressed
        sendButton.click(); // Trigger the send button click
    }
});