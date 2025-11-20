const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express();

app.use(express.json());

// Koneksi database
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Ar-ray04",
    database: "api_keyy",
    port: 3309
});

db.connect((err) => {
    if (err) {
        console.log("DB Error:", err);
        return;
    }
    console.log("MySQL Connected!");
});

// =============================
//  CREATE ADMIN
// =============================
app.post("/create-admin", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
        return res.json({ success: false, message: "Email & password wajib diisi" });

    const hash = bcrypt.hashSync(password, 10);

    db.query(
        "INSERT INTO admin (email, password) VALUES (?, ?)",
        [email, hash],
        (err, result) => {
            if (err) return res.json({ success: false, message: err });

            res.json({ success: true, message: "Admin created!" });
        }
    );
});

// =============================
//  LOGIN ADMIN
// =============================
app.post("/login-admin", (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM admin WHERE email = ?", [email], (err, result) => {
        if (err || result.length === 0)
            return res.json({ success: false, message: "Admin tidak ditemukan" });

        const admin = result[0];

        if (!bcrypt.compareSync(password, admin.password))
            return res.json({ success: false, message: "Password salah" });

        const token = jwt.sign(
            { id: admin.id, role: "admin" },
            "SECRETKEY",
            { expiresIn: "1d" }
        );

        res.json({
            success: true,
            token
        });
    });
});

// =============================
//  MIDDLEWARE ADMIN ONLY
// =============================
function adminOnly(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token)
        return res.status(403).json({ message: "Token tidak ada" });

    try {
        const decoded = jwt.verify(token, "SECRETKEY");
        if (decoded.role !== "admin")
            return res.status(403).json({ message: "Akses ditolak" });

        req.admin = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: "Token invalid" });
    }
}

// =============================
//  CREATE USER
// =============================
app.post("/create-user", adminOnly, (req, res) => {
    const { firstname, lastname, email } = req.body;

    db.query(
        "INSERT INTO users (firstname, lastname, email) VALUES (?, ?, ?)",
        [firstname, lastname, email],
        (err, result) => {
            if (err) return res.json({ success: false, message: err });

            res.json({ success: true, message: "User created!" });
        }
    );
});

// =============================
//  GET ALL USER
// =============================
app.get("/get-all-user", adminOnly, (req, res) => {
    db.query("SELECT * FROM users", (err, result) => {
        if (err) return res.json({ success: false, message: err });

        res.json({ success: true, data: result });
    });
});

// =============================
//  CREATE APIKEY
// =============================
app.post("/create-apikey", adminOnly, (req, res) => {
    const { user_id, out_of_date } = req.body;

    const apiKey = Math.random().toString(36).substring(2) + Date.now();

    db.query(
        "INSERT INTO apikeys (api_key, user_id, out_of_date) VALUES (?, ?, ?)",
        [apiKey, user_id, out_of_date],
        (err, result) => {
            if (err) return res.json({ success: false, message: err });

            res.json({ success: true, apiKey });
        }
    );
});

// =============================
//  GET ALL APIKEY
// =============================
app.get("/get-all-apikey", adminOnly, (req, res) => {
    db.query("SELECT * FROM apikeys", (err, result) => {
        if (err) return res.json({ success: false, message: err });

        res.json({ success: true, data: result });
    });
});

// =============================
//  Jalankan server
// =============================
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
