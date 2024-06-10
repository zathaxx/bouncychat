const path = require('path');
const express = require('express')

const db = require('./db')

const app = express()
const port = 3000

const expressWS = require('express-ws')(app);

let wss = expressWS.getWss()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'client'));

app.ws('/ws', async function(ws, req) {
    let client = new db.Client;
    await client.open()
    ws.on('message', async function(msg) {
        await client.query()
	const data = JSON.parse(msg)
	wss.clients.forEach(function (sock) {
	    sock.send(JSON.stringify({
		"append": true,
		"message": data.message,
		"name": data.name
	    }))
	});
    });
    ws.on('close', async function(msg) {
      await client.close()
    });
});

app.get('/', (req, res) => {
    //res.sendFile('index.html', {root: path.join(__dirname, 'client')})
    res.render('index', {
	chat_log: [
	    { name: 'admin', message: 'Hello! Welcome to Bouncy Chat, a communications platform powered by WebSocket. Be nice and enjoy the conversation!'}
	]})
})

app.use(express.static('client'))

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
