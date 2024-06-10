const NOTIFICATION_TIMEOUT = 4000

function sendNotification(title, body) {
    var notification = new Notification(title, { body: body, icon: 'logo.png ' })
    setTimeout(notification.close.bind(notification), NOTIFICATION_TIMEOUT)
}

let socket
const connect = function() {
    return new Promise((resolve, reject) => {
        const socketProtocol = (window.location.protocol === 'https:' ? 'wss:' : 'ws:')
        const port = 3000
        const socketUrl = `${socketProtocol}//${window.location.hostname}:${port}/ws/`
        
        socket = new WebSocket(socketUrl)

        socket.onopen = (e) => {
            resolve()
        }

        socket.onmessage = (data) => {
            console.log(data)
            let parsedData = JSON.parse(data.data)
	    if (parsedData.append === true) {
		appendMessage(parsedData)
	    }
        }

        socket.onerror = (e) => {
            console.error(e)
            resolve()
            connect()
        }
    })
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

function appendMessage(data) {
    const parent = document.createElement('div')
    parent.tabIndex = "0"
    const mEl = document.createElement('p')
    mEl.textContent = data.message
    const uEl = document.createElement('span')
    uEl.textContent = data.name
    parent.appendChild(uEl)
    parent.appendChild(mEl)
    document.getElementById('chatbox').appendChild(parent)
    scrollBottom()

    const name = localStorage.getItem('displayname')
    if (data.name !== name) {
	sendNotification(data.name, data.message)
    }
}

document.getElementById('displayname').addEventListener('change', function (e) {
    const name = document.getElementById('displayname').value
    localStorage.setItem('displayname', name)
})

window.onload = () => {
    const name = localStorage.getItem('displayname')
    document.getElementById('displayname').value = name

    if (Notification.permission !== 'granted') {
        Notification.requestPermission().then(function (result) {
            if (Notification.permission === 'granted') {
                sendNotification('Bouncy Chat', 'Notifications are now enabled. Prepare for updates!')
            }
        })
    }
}

document.addEventListener('DOMContentLoaded', function () {
    connect()
    document.getElementById('send-message').addEventListener('click', function (e) {
	sendMessage()
    })
    document.getElementById('message-text').addEventListener('keydown', function (e) {
	if (e.keyCode === 13) {
	    sendMessage()
	}
    })
    scrollBottom()
})
