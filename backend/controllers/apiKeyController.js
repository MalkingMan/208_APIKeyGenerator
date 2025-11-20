const db = require('../config/db');

// GET ALL KEYS (Untuk Dashboard Admin)
exports.getAllApiKeys = (req, res) => {
    const query = `
        SELECT 
            apikeys.id AS key_id,
            apikeys.api_key,
            apikeys.out_of_date,
            apikeys.created_at,
            users.id AS user_id,      -- Mengambil ID User
            users.firstname,          -- Mengambil Firstname
            users.lastname,
            users.email
        FROM apikeys
        JOIN users ON apikeys.user_email = users.email
        ORDER BY apikeys.created_at DESC
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ success: false, message: err.message });
        }
        
        res.json({ success: true, data: results });
    });
};

// (Fungsi createApiKey bisa dikosongkan atau dibiarkan jika tidak dipakai lewat route ini)
exports.createApiKey = (req, res) => { };