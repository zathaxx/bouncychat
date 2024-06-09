let socket;
const connect = function() {
    return new Promise((resolve, reject) => {
        const socketProtocol = (window.location.protocol === 'https:' ? 'wss:' : 'ws:')
        const port = 3000;
        const socketUrl = `${socketProtocol}//${window.location.hostname}:${port}/ws/`
        
        socket = new WebSocket(socketUrl);

        socket.onopen = (e) => {
            socket.send(JSON.stringify({ "loaded" : true }));
            resolve();
        }

        socket.onmessage = (data) => {
            console.log(data);
            let parsedData = JSON.parse(data.data);
            if (parsedData.append === true) {
                const newEl = document.createElement('p');
                newEl.textContent = parsedData.returnText;
                document.getElementById('websocket-response').appendChild(newEl);
            }
        }

        socket.onerror = (e) => {
            console.log(e);
            resolve();
            connect();
        }
    });
}

const isOpen = function(ws) { 
    return ws.readyState === ws.OPEN 
}

function sendMessage() {
    let message_el = document.getElementById('message-text')
    const message = message_el.value
    message_el.value = ''
    if(isOpen(socket)) {
        socket.send(JSON.stringify({
            "message": message,
        }))
    }
}

document.addEventListener('DOMContentLoaded', function () {
    connect();
    document.getElementById('send-message').addEventListener('click', function (e) {
	sendMessage()
    });
    document.getElementById('message-text').addEventListener('keydown', function (e) {
	if (e.keyCode === 13) {
	    sendMessage()
	}
    })
});
