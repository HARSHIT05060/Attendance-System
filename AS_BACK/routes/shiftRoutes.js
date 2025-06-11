const express = require('express');
const router = express.Router();
const shiftController = require('../controllers/shiftController');

router.post('/shifts', shiftController.createShift);
router.get('/shifts', shiftController.getShifts);

router.post('/shifts/assign-shift', shiftController.assignShiftToEmployee);
router.get("/shifts/:shiftId/employees", shiftController.getEmployeesByShiftId);

router.get('/assigned-shifts/:employeeCode', shiftController.getAssignedShiftsForEmployee);
router.delete('/shifts/:id', shiftController.deleteShift);

module.exports = router;
