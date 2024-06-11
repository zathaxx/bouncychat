function loadroom() {
    const roomid = document.getElementById('roomid').value
    window.location = roomid
}

document.getElementById('loadroom').addEventListener('click', (e) => {
    loadroom()
})

document.getElementById('roomid').addEventListener('keydown', (e) => {
    if (e.keyCode === 13) {
	loadroom()
    }
})
