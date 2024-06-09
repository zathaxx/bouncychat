const express = require('express')
const app = express()
const port = 3000

const expressWS = require('express-ws')(app);

const db = require('./db')

let wss = expressWS.getWss()

app.ws('/ws', async function(ws, req) {
    let client = new db.Client;
    await client.open()
    ws.on('message', async function(msg) {
        await client.query()
	const message = JSON.parse(msg).message
	wss.clients.forEach(function (sock) {
	    sock.send(JSON.stringify({
		"append": true,
		"returnText": message
	    }))
	});
    });
    ws.on('close', async function(msg) {
      await client.close()
    });
});

app.use(express.static('client'))

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
