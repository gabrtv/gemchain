const chatInput = document.querySelector('.chat-input');
const chatHistory = document.querySelector('.chat-history');
const submitButton = document.querySelector('.chat-submit-button');
const outputDiv = document.getElementById('output');

let eventSource = null; // Initialize to null

function sendPrompt() {
  const prompt = chatInput.value.trim();
  chatInput.value = ''; // Clear input field

  if (eventSource) {
      eventSource.close(); // Close any existing connection
  }
          
  // Create a new FormData object
  const formData = new FormData();
  formData.append("prompt", prompt);

  // Make a POST request with the prompt in the body
  fetch("/prompt_streaming", {
      method: "POST",
      body: formData
  })
  .then(response => {
      if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
      }

      // Get the prompt hash from the response
      const promptHashPromise = response.text();

      promptHashPromise.then(promptHash => {  // Resolve the Promise here

        // Clear the output div
        outputDiv.textContent = "";

        // Create an EventSource to receive streamed chunks
        eventSource = new EventSource(`/prompt_streaming/${promptHash}`);

        // eventSource.onmessage = (event) => {
        //   if (event.data === "END_OF_STREAM") {
        //     console.log("end of stream message")
        //     eventSource.close();
        //   } else {
        //     const chunk = event.data.slice(2, -1).trimEnd(); // Remove b' prefix, trailing ' and trailing newline
        //     const lines = chunk.split(/\n/);
        //     for (const line of lines) {
        //       outputDiv.innerHTML += `<p>${line}</p>`; // Wrap each line in a paragraph
        //     }
        //   }
        // };

        eventSource.onmessage = (event) => {
          const chunk = event.data.slice(2, -1);
          const textWithNewlines = chunk.replace(/\\n/g, "\n"); // Replace `\n` with actual newlines
          outputDiv.textContent += textWithNewlines;
        };

        eventSource.onerror = (error) => {
            console.log("readyState on error: ", eventSource.readyState)
            if (eventSource.readyState === 2) { // Closed state
              console.log("error on already closed state: ", error)
              // Handle natural closure, e.g., log a message
            } else {
              eventSource.close();
              eventSource = null;
              //outputDiv.textContent = "Error: Could not connect to server for streaming.";
            }
        };

    })
  })
  .catch(error => {
      console.error("Error fetching response:", error);
      outputDiv.textContent = "Error: Could not retrieve streamed response.";
  });
}
submitButton.addEventListener("click", sendPrompt);
chatInput.addEventListener('keydown', (event) => {
    if (event.keyCode === 13) { // Enter key pressed
        sendPrompt(); // Trigger the send button click
    }
});