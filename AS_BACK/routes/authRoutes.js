// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { register, login, me } = require('../controllers/authController');

/**
 * POST /api/auth/register
 * Body: { name, number, password, role? }
 * NOTE: keep this for quick seeding / testing, remove in production if not needed.
 */
router.post('/register', register);

/**
 * POST /api/auth/login
 * Body: { number, password }
 */
router.post('/login', login);

/**
 * GET /api/auth/me
 * Header: Authorization: Bearer <token>
 */
router.get('/me', auth(), me);

module.exports = router;
