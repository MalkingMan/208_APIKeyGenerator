const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Koneksi Database (Sesuai konfigurasi Anda)
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Ar-ray04', // Sesuaikan password Anda
    database: 'api_keyy', // Sesuaikan nama DB Anda
    port: 3309,           // Sesuaikan port Anda
    waitForConnections: true,
    connectionLimit: 10
});

// Cek Koneksi
db.getConnection((err) => {
    if (err) console.error("❌ Database Error:", err.message);
    else console.log("✅ Terhubung ke Database MySQL");
});

// ==========================================
// ROUTE: GENERATE KEY (PUBLIC)
// ==========================================
app.post("/api/generate-key", (req, res) => {
    const { firstname, lastname, email, out_of_date } = req.body;

    // 1. Validasi Input
    if (!firstname || !lastname || !email || !out_of_date) {
        return res.status(400).json({ success: false, message: "Mohon lengkapi semua data!" });
    }

    const newApiKey = "KEY-" + Math.random().toString(36).substring(2, 15).toUpperCase() + Date.now();

    // 2. Simpan / Update Data User terlebih dahulu
    const userQuery = `
        INSERT INTO users (firstname, lastname, email) 
        VALUES (?, ?, ?) 
        ON DUPLICATE KEY UPDATE firstname = VALUES(firstname), lastname = VALUES(lastname)
    `;

    db.query(userQuery, [firstname, lastname, email], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "Gagal menyimpan data user" });
        }

        // 3. Setelah User Aman, Simpan API Key
        const keyQuery = "INSERT INTO apikeys (api_key, user_email, out_of_date) VALUES (?, ?, ?)";
        
        db.query(keyQuery, [newApiKey, email, out_of_date], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, message: "Gagal membuat API Key" });
            }

            // Berhasil
            res.json({ success: true, apiKey: newApiKey });
        });
    });
});

// ==========================================
// JALANKAN SERVER
// ==========================================
app.listen(PORT, () => {
    console.log(`✅ Server Backend berjalan di http://localhost:${PORT}`);
});