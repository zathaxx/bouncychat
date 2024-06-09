const express = require('express')
const app = express()
const port = 3000

const expressWS = require('express-ws')(app);

const db = require('./db')

app.ws('/ws', async function(ws, req) {
    let client = new db.Client;
    await client.open()
    ws.on('message', async function(msg) {
        await client.query()
        console.log(msg);
        ws.send(JSON.stringify({
            "append" : true,
            "returnText" : "I am using WebSockets!"
        }));
    });
    ws.on('close', async function(msg) {
      await client.close()
    });
});

app.use(express.static('client'))

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
