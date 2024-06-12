const path = require('path');
const express = require('express')

const db = require('./db')

require('dotenv').config()

const app = express()
const port = process.env.PORT

require('express-ws')(app)

const wss_map = new Map()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));

app.ws('/ws/:room', async function(ws, req) {
    let room_name = req.params.room
    if (!wss_map.has(room_name)) {
        wss_map.set(room_name, new Set())
    }
    wss_map.get(room_name).add(ws)
    let client = new db.Client;
    await client.open()
    await client.setState(room_name, true)
    await client.createRoom(room_name)
    ws.on('message', async function(msg) {
        const data = JSON.parse(msg)
        await client.addMessage(room_name, data.name, data.message, Date.now())
        wss_map.get(room_name).forEach(function(sock) {
            sock.send(JSON.stringify({
          "append": true,
          "message": data.message,
          "name": data.name
            }))
        });
    });
    ws.on('close', async function(msg) {
        wss_map.get(room_name).delete(ws)
        if (wss_map.get(room_name).size === 0) {
            wss_map.delete(room_name)
            client.setState(room_name, false)
        }
        await client.close()
    });
});

app.use(express.static('static'))

app.get('/:room', async (req, res) => {
  let client = new db.Client
  let room_name = req.params.room
  await client.open()
  let messages = (await client.getRoom(room_name)).rows
  let chat_log = [{ name: 'admin', message: 'Hello! Welcome to Bouncy Chat, a communications platform powered by WebSocket. Be nice and enjoy the conversation!'}]

  for (let message of messages) {
    let m = { name: message.room_user_name, message: message.message}
    chat_log.push(m)
  }

  res.render('room', {
	chat_log: 
	    chat_log
	})
  await client.close()
})

app.get('/', async (req, res) => {
    let client = new db.Client
    await client.open()
    let rooms = (await client.getAllRooms()).rows
    res.render('index', {
	rooms: rooms
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
