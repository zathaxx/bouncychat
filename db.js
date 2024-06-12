class Client {    
    client
    async open() {
        this.client = await pool.connect()
    }

    async joinRoom(room_name) {
        if (await this.client.query('SELECT * FROM ROOM WHERE name = $1', [room_name]).rowCount <= 0) {
            this.createRoom(room_name)
        }
        if (await this.client.query('INSERT INTO ROOM_USER values (DEFAULT, $1, $2)', [username, room_name])) {}
        else { console.log("Username already taken!")}
    }

    async createRoom(name) {
        try {await this.client.query('INSERT INTO ROOM values($1, $2)', [name, true])}
        catch(e) { console.error("Room name already taken!") }
    }

    async addMessage(room_name, room_user, message_content, timestamp) {
        await this.client.query('INSERT into MESSAGE values (DEFAULT, $1, $2, $3, $4)', [room_name, room_user, message_content, timestamp])
    }

    async getRoom(name) {
        return await this.client.query('SELECT * FROM MESSAGE WHERE room_name = $1 ORDER BY time ASC', [name])
    }

    async getAllRooms() {
	return await this.client.query('SELECT * FROM ROOM WHERE active = true')
    }

    async close() {
        this.client.release()
    }

    async setState(room_name, state) {
        await this.client.query('UPDATE ROOM SET active = $1 WHERE name = $2', [state, room_name])
    }
}

const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port: 5432,
});

exports.Client = Client
