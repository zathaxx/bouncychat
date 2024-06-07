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
            if(parsedData.append === true) {
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

document.addEventListener('DOMContentLoaded', function() {
    connect();
    document.getElementById('websocket-start').addEventListener('click', function(e) {
        if(isOpen(socket)) {
            socket.send(JSON.stringify({
                "data" : "this is our data to send",
                "other" : "this can be in any format"
            }))
        }
    });
});
