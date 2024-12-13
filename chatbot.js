




function sendMessage() {
    var userMessage = document.getElementById("chatInput").value;
    
    if (userMessage) {
        // Mostrar el mensaje del usuario en el chatbox
        appendMessage("Usuario: " + userMessage, "user");
        
        // Limpiar el input
        document.getElementById("chatInput").value = "";

        // Enviar el mensaje del usuario a Rasa usando fetch
        fetch("http://localhost:5005/webhooks/rest/webhook", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ "sender": "user", "message": userMessage })
        })
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                // Mostrar la respuesta del bot
                appendMessage("Bot: " + data[0].text, "bot");
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
}

function appendMessage(message, sender) {
    var chatbox = document.getElementById("chatbox");
    var messageElement = document.createElement("p");
    messageElement.textContent = message;
    messageElement.classList.add(sender);
    chatbox.appendChild(messageElement);
}

