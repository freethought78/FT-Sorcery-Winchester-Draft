console.log(pubip)
// Create WebSocket connection.
const socket = new WebSocket(`ws://${pubip}/ws`); // Match this URL to FastAPI WebSocket route

// Connection open
socket.onopen = function(event) {
    console.log('Connecting to draft server...');
    message = {'connect': {
        'user': userID
        }
    }
    socket.send(JSON.stringify(message));
};

// Receive message
socket.onmessage = function(event) {
    data = JSON.parse(event.data)

    if (data.message) {
        console.log('Message from server:', data.message);
        const messagesDiv = document.getElementById('messages');
        const message = document.createElement('p');
        message.textContent = `Server says: ${event.data}`;
        messagesDiv.appendChild(message);
    }

    if (data.state){
        console.log("state update received")
        buildStage(data.state)
    }
};

// Error handling
socket.onerror = function(event) {
    console.error('WebSocket Error:', event);
};

// Close connection
socket.onclose = function(event) {
    console.log('Disconnected from WebSocket server');
};

function requestStateUpdate(){
    message = {'connect': {
        'user': userID
        }
    }
    socket.send(JSON.stringify(message));
}