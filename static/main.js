document.getElementById('loadroom').addEventListener('click', (e) => {
    const roomid = document.getElementById('roomid').value
    window.location.href += roomid
})
