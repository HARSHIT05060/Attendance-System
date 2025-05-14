const express = require('express');
const router = express.Router();

// Import the controller
const {getLeaveRequests,createLeaveRequest,updateLeaveStatus} = require('../controllers/leaveController');

// Get all leave requests (with optional query for status)
router.get('/leaves', getLeaveRequests);

// Create a new leave request
router.post('/leaves', createLeaveRequest);

router.put('/:leave_id', updateLeaveStatus);

// Update leave status (e.g., "Approved", "Rejected")
router.put('/leaves/:leave_id/', updateLeaveStatus);

module.exports = router;
