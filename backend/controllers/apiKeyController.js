const db = require('../config/db');
const generateApiKey = require('../utils/generateApiKey');

exports.createApiKey = (req, res) => {
    const { user_id, out_of_date } = req.body; // user_id dari input frontend

    // Validasi input
    if (!user_id || !out_of_date) {
        return res.status(400).json({ success: false, message: "Data tidak lengkap" });
    }

    const apiKey = generateApiKey();

    // 1. Cek dulu apakah user sudah ada di tabel 'users'?
    // Kita gunakan INSERT IGNORE agar tidak error jika user sudah ada
    const insertUserQuery = "INSERT IGNORE INTO users (username) VALUES (?)";

    db.query(insertUserQuery, [user_id], (err) => {
        if (err) {
            console.error("Error inserting user:", err);
            return res.status(500).json({ success: false, message: "Gagal menyimpan user" });
        }

        // 2. Setelah user dipastikan ada, baru simpan API Key
        const insertKeyQuery = "INSERT INTO apikeys (api_key, user_id, out_of_date) VALUES (?, ?, ?)";
        
        db.query(insertKeyQuery, [apiKey, user_id, out_of_date], (err) => {
            if (err) {
                console.error("Error inserting key:", err);
                return res.status(500).json({ success: false, message: err.message });
            }

            res.json({ success: true, apiKey });
        });
    });
};

exports.getAllApiKeys = (req, res) => {
    db.query("SELECT * FROM apikeys", (err, result) => {
        if (err) return res.json({ success: false, message: err });
        res.json({ success: true, data: result });
    });
};