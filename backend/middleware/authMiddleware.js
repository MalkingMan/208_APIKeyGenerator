 const jwt = require('jsonwebtoken');

exports.adminOnly = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token)
        return res.status(403).json({ message: "Token hilang" });

    try {
        const decoded = jwt.verify(token, "SECRETKEY");
        if (decoded.role !== "admin")
            return res.status(403).json({ message: "Akses ditolak" });

        req.admin = decoded;
        next();

    } catch (err) {
        return res.status(403).json({ message: "Token invalid" });
    }
};
