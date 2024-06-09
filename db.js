class Client {    
    client
    async open() {
        this.client = await pool.connect()
    }
    async close() {
        this.client.release()
    }
    async query() {
        const result = await this.client.query('SELECT * FROM ROOM')
        console.log(result)
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