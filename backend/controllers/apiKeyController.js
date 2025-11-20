const db = require('../config/db');
const generateApiKey = require('../utils/generateApiKey');

exports.createApiKey = (req, res) => {
    const { user_id, out_of_date } = req.body;

    const apiKey = generateApiKey();

    db.query(
        "INSERT INTO apikeys (api_key, user_id, out_of_date) VALUES (?, ?, ?)",
        [apiKey, user_id, out_of_date],
        (err) => {
            if (err) return res.json({ success: false, message: err });

            res.json({ success: true, apiKey });
        }
    );
};

exports.getAllApiKeys = (req, res) => {
    db.query("SELECT * FROM apikeys", (err, result) => {
        if (err) return res.json({ success: false, message: err });

        res.json({ success: true, data: result });
    });
};
