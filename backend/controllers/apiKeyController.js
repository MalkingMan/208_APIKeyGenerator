exports.getAllApiKeys = (req, res) => {
    // Query JOIN untuk menggabungkan data API Key dengan Data User pemiliknya
    const query = `
        SELECT 
            apikeys.id,
            apikeys.api_key,
            apikeys.out_of_date,
            apikeys.created_at,
            users.firstname,
            users.lastname,
            users.email
        FROM apikeys
        JOIN users ON apikeys.user_email = users.email
        ORDER BY apikeys.created_at DESC
    `;

    db.query(query, (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });

        res.json({ success: true, data: result });
    });
};