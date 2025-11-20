const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Ganti string ini dengan random string yang sulit ditebak di production
const JWT_SECRET = "SECRETKEY_RAHASIA_ANDA"; 

exports.registerAdmin = (req, res) => {
    const { email, password } = req.body;

    // Validasi Input
    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email dan password wajib diisi" });
    }

    // Enkripsi Password
    const hash = bcrypt.hashSync(password, 10);

    // Simpan ke Database
    db.query(
        "INSERT INTO admin (email, password) VALUES (?, ?)",
        [email, hash],
        (err) => {
            if (err) {
                // Cek jika error karena email duplikat
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ success: false, message: "Email sudah terdaftar" });
                }
                return res.status(500).json({ success: false, message: "Database error: " + err.message });
            }

            res.json({ success: true, message: "Admin berhasil didaftarkan" });
        }
    );
};

exports.loginAdmin = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email dan password harus diisi" });
    }

    // Cari Admin berdasarkan Email
    db.query("SELECT * FROM admin WHERE email = ?", [email], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        
        // Jika email tidak ditemukan
        if (result.length === 0) {
            return res.status(404).json({ success: false, message: "Admin tidak ditemukan" });
        }

        const admin = result[0];

        // Cek Password
        if (!bcrypt.compareSync(password, admin.password)) {
            return res.status(401).json({ success: false, message: "Password salah" });
        }

        // Buat Token JWT
        const token = jwt.sign(
            { id: admin.id, email: admin.email, role: "admin" },
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({ 
            success: true, 
            message: "Login berhasil",
            token,
            user: { id: admin.id, email: admin.email } 
        });
    });
};