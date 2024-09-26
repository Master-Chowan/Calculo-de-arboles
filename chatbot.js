function sendMessage() {
    let input = document.getElementById('chatInput');
    let message = input.value;
    input.value = '';

    let chatbox = document.getElementById('chatbox');
    chatbox.innerHTML += `<p><strong>You:</strong> ${message}</p>`;

    // Simple bot response
    let response = `Current cylinder: radius = ${storedValues.radius}, length = ${storedValues.length}. `;
    response += `Forces: (${storedValues.forceX}, ${storedValues.forceY}, ${storedValues.forceZ}). `;
    response += `Coordinates: (${storedValues.coordX}, ${storedValues.coordY}, ${storedValues.coordZ}).`;
    chatbox.innerHTML += `<p><strong>Bot:</strong> ${response}</p>`;

    chatbox.scrollTop = chatbox.scrollHeight;
}