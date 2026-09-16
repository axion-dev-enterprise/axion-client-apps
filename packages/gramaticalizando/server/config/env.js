const crypto = require("crypto");

module.exports = {
    PORT: process.env.PORT || 3000,
    SESSION_SECRET: process.env.SESSION_SECRET || crypto.randomBytes(32).toString("hex"),
    NODE_ENV: process.env.NODE_ENV || "development"
};
