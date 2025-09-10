// utils/generateToken.js
const jwt = require('jsonwebtoken');

function generateToken(payload) {
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
    return jwt.sign(payload, secret, { expiresIn });
}

module.exports = generateToken;
