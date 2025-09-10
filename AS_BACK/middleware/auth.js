// middleware/auth.js
const jwt = require('jsonwebtoken');

function auth(required = true) {
    return (req, res, next) => {
        const header = req.headers.authorization || '';
        const token = header.startsWith('Bearer ') ? header.substring(7) : null;

        if (!token) {
            if (!required) return next();
            return res.status(401).json({ success: false, message: 'No token provided' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded; // { id, number, role }
            next();
        } catch (err) {
            return res.status(401).json({ success: false, message: 'Invalid/Expired token' });
        }
    };
}

module.exports = auth;
