const express = require('express')
const app = express()
const port = 3000

const expressWS = require('express-ws')(app);

app.ws('/ws', async function(ws, req) {
    ws.on('message', async function(msg) {
        console.log(msg);
        ws.send(JSON.stringify({
            "append" : true,
            "returnText" : "I am using WebSockets!"
        }));
    });
});

app.use(express.static('client'))

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
