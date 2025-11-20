const mysql = require('mysql2');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Ar-ray04',
    database: 'api_keyy',
    port: 3309
});

module.exports = db;
