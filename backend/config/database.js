const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER ,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST ,
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME ,
    connectionString: process.env.DB_PORTL,
    ssl: { rejectUnauthorized: false },
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
});

module.exports = pool;