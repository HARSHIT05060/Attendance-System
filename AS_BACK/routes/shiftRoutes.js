const express = require('express');
const router = express.Router();
const shiftController = require('../controllers/shiftController');

router.post('/shifts', shiftController.createShift);
router.get('/shifts', shiftController.getShifts);

router.post('/shifts/assign-shift', (req, res, next) => {
    console.log("🔥 Assign shift route hit");
    next();
}, shiftController.assignShiftToEmployee);

router.get('/assigned-shifts/:employeeCode', shiftController.getAssignedShiftsForEmployee);
router.delete('/shifts/:id', shiftController.deleteShift);

module.exports = router;
