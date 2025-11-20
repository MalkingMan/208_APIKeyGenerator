 const db = require('../config/db');

exports.getAllUsers = (req, res) => {
    db.query("SELECT * FROM users", (err, result) => {
        if (err) return res.json({ success: false, message: err });

        res.json({ success: true, data: result });
    });
};

