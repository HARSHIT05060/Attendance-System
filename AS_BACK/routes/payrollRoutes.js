const express = require('express');
const router = express.Router();
const { generatePayroll, finalizePayroll, getMonthlyPayroll ,getAllMonthlyPayrolls} = require('../controllers/payrollController');

// Existing routes
router.post('/generate', generatePayroll);
router.patch('/finalize/:id', finalizePayroll);

// New route for fetching monthly payroll
router.get('/monthly', getMonthlyPayroll);
router.get('/monthly/all', getAllMonthlyPayrolls);

module.exports = router;
