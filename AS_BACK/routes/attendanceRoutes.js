const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

router.post('/bulk', attendanceController.bulkAttendance);
router.get('/employee/:employeeCode/week', attendanceController.getAttendanceByWeek); // GET attendance by week
router.put('/update', attendanceController.updateAttendance); // PUT update or create attendance


module.exports = router;
