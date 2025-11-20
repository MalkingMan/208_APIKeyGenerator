const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const app = express();
const PORT = 3000;

// 1. Middleware
app.use(cors());
app.use(express.json());

// 2. Koneksi Database (Connection Pool)
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Ar-ray04', // Password Anda
    database: 'api_keyy', // Database Anda
    port: 3309,           // Port Anda
    waitForConnections: true,
    connectionLimit: 10
});

// Cek Koneksi saat server jalan
db.getConnection((err, connection) => {
    if (err) {
        console.error("❌ Database Error:", err.message);
    } else {
        console.log("✅ Terhubung ke Database MySQL");
        connection.release();
    }
});

// 3. Import Route Admin (PENTING: Ini yang tadi hilang)
const adminRoutes = require('./routes/admin');

// 4. Pasang Route Admin
// Ini menangani: /api/admin/login dan /api/admin/register
app.use('/api/admin', adminRoutes);


// ==========================================
// 5. ROUTE: GENERATE KEY (PUBLIC USER)
// ==========================================
// Ini menangani input Firstname, Lastname, Email dari halaman depan
app.post("/api/generate-key", (req, res) => {
    const { firstname, lastname, email, out_of_date } = req.body;

    // Validasi Input
    if (!firstname || !lastname || !email || !out_of_date) {
        return res.status(400).json({ success: false, message: "Mohon lengkapi semua data!" });
    }

    // Format API Key Unik
    const newApiKey = "KEY-" + Math.random().toString(36).substring(2, 15).toUpperCase() + Date.now();

    // A. Simpan / Update Data User
    // Menggunakan ON DUPLICATE KEY UPDATE agar jika email ada, data nama diperbarui
    const userQuery = `
        INSERT INTO users (firstname, lastname, email) 
        VALUES (?, ?, ?) 
        ON DUPLICATE KEY UPDATE firstname = VALUES(firstname), lastname = VALUES(lastname)
    `;

    db.query(userQuery, [firstname, lastname, email], (err) => {
        if (err) {
            console.error("User DB Error:", err);
            return res.status(500).json({ success: false, message: "Gagal menyimpan data user" });
        }

        // B. Simpan API Key (terhubung ke email)
        const keyQuery = "INSERT INTO apikeys (api_key, user_email, out_of_date) VALUES (?, ?, ?)";
        
        db.query(keyQuery, [newApiKey, email, out_of_date], (err) => {
            if (err) {
                console.error("Key DB Error:", err);
                return res.status(500).json({ success: false, message: "Gagal membuat API Key" });
            }

            // Berhasil
            res.json({ success: true, apiKey: newApiKey });
        });
    });
});

// 6. Jalankan Server
app.listen(PORT, () => {
    console.log(`✅ Server Backend berjalan di http://localhost:${PORT}`);
});