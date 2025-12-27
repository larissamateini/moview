const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const connectionOptions = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

const pool = mysql.createPool(connectionOptions);

module.exports = pool.promise(); // para permitir async/await nas rotas