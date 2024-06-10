let socket;
const connect = function() {
    return new Promise((resolve, reject) => {
        const socketProtocol = (window.location.protocol === 'https:' ? 'wss:' : 'ws:')
        const port = 3000
        const socketUrl = `${socketProtocol}//${window.location.hostname}:${port}/ws/`
        
        socket = new WebSocket(socketUrl)

        socket.onopen = (e) => {
            resolve();
        }

        socket.onmessage = (data) => {
            console.log(data)
            let parsedData = JSON.parse(data.data)
            if (parsedData.append === true) {
		const parent = document.createElement('div')
		parent.tabIndex = "0"
                const mEl = document.createElement('p')
                mEl.textContent = parsedData.message
		const uEl = document.createElement('span')
		uEl.textContent = parsedData.name
		parent.appendChild(uEl)
		parent.appendChild(mEl)
                document.getElementById('chatbox').appendChild(parent)
		scrollBottom()
            }
        }

        socket.onerror = (e) => {
            console.error(e)
            resolve()
            connect()
        }
    });
}

const isOpen = function(ws) { 
    return ws.readyState === ws.OPEN 
}

function scrollBottom() {
    let box = document.getElementById('chatbox')
    box.scrollTop = box.scrollHeight
}

function sendMessage() {
    let message_el = document.getElementById('message-text')
    let name = document.getElementById('displayname').value
    const message = message_el.value
    message_el.value = ''
    if(isOpen(socket)) {
        socket.send(JSON.stringify({
            "message": message,
	    "name": name
        }))
    }
}

document.getElementById('displayname').addEventListener('change', function (e) {
    const name = document.getElementById('displayname').value
    localStorage.setItem('displayname', name)
})

window.onload = () => {
    const name = localStorage.getItem('displayname')
    document.getElementById('displayname').value = name
}

document.addEventListener('DOMContentLoaded', function () {
    connect()
    document.getElementById('send-message').addEventListener('click', function (e) {
	sendMessage()
    });
    document.getElementById('message-text').addEventListener('keydown', function (e) {
	if (e.keyCode === 13) {
	    sendMessage()
	}
    })
    scrollBottom()
});
