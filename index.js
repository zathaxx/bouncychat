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
    let room_name = "Default"
    let client = new db.Client;
    await client.open()
    client.createRoom(room_name)
    ws.on('message', async function(msg) {
	const data = JSON.parse(msg)
  console.log(data)
  client.addMessage(room_name, data.name, data.message, Date.now())
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

app.get('/', async (req, res) => {
  let client = new db.Client
  let room_name = "Default"
  await client.open()
  let messages = (await client.getRoom(room_name)).rows

  let chat_log = [{ name: 'admin', message: 'Hello! Welcome to Bouncy Chat, a communications platform powered by WebSocket. Be nice and enjoy the conversation!'}]

  for (let message of messages) {
    let m = { name: message.room_user_name, message: message.message}
    chat_log.push(m)
  }

  res.render('index', {
	chat_log: 
	    chat_log
	})
  await client.close()
})

app.use(express.static('client'))

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
