// src/db.js
const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
});

let isConnected = false;

async function connectToDB() {
  try {
    await client.connect();
    isConnected = true;
    console.log('Connected to PostgreSQL');
  } catch (err) {
    console.error('DB connection error:', err.message);
    isConnected = false;
  }
}

connectToDB();

module.exports = { client, isConnected: () => isConnected };
