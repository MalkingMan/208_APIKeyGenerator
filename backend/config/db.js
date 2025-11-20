const mysql = require('mysql2');

// Menggunakan Connection Pool (Lebih stabil dibanding createConnection)
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',           // Pastikan user benar
    password: 'Ar-ray04',   // Password Anda
    database: 'api_keyy',   // Pastikan nama database SAMA PERSIS (termasuk huruf 'y' ganda)
    port: 3309,             // Port MySQL Anda (Custom Port)
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Fitur Cek Koneksi:
// Ini akan mencoba menghubungi database saat server nyala.
// Jika gagal, error akan muncul di terminal.
db.getConnection((err, connection) => {
    if (err) {
        console.error('❌ GAGAL KONEK KE DATABASE:', err.message);
        console.error('   -> Cek Port (3309?), User, Password, atau Nama Database.');
    } else {
        console.log('✅ Berhasil Konek ke Database: api_keyy');
        connection.release(); // Kembalikan koneksi ke pool
    }
});

module.exports = db;