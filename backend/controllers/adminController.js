  
const db = require('../config/db');
const bcrypt = require('bcryptjs');

exports.registerAdmin = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
        return res.json({ success: false, message: "Email dan password wajib" });

    const hash = bcrypt.hashSync(password, 10);

    db.query(
        "INSERT INTO admin (email, password) VALUES (?, ?)",
        [email, hash],
        (err) => {
            if (err) return res.json({ success: false, message: err });

            res.json({ success: true, message: "Admin registered" });
        }
    );
};

const jwt = require('jsonwebtoken');

exports.loginAdmin = (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM admin WHERE email = ?", [email], (err, result) => {
        if (err || result.length === 0)
            return res.json({ success: false, message: "Admin tidak ditemukan" });

        const admin = result[0];

        if (!bcrypt.compareSync(password, admin.password)) {
            return res.json({ success: false, message: "Password salah" });
        }

        const token = jwt.sign(
            { id: admin.id, role: "admin" },
            "SECRETKEY",
            { expiresIn: "1d" }
        );

        res.json({ success: true, token });
    });
};
