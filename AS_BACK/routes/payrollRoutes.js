const express = require('express');
const router = express.Router();
const { generatePayroll, finalizePayroll } = require('../controllers/payrollController');

router.post('/generate', generatePayroll);
router.patch('/finalize/:id', finalizePayroll);

module.exports = router;
