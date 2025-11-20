 const crypto = require("crypto");

module.exports = function generateApiKey() {
    return crypto.randomBytes(24).toString("hex");
};
