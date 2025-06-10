const mongoose = require('mongoose');
const LeaveRequest = require('../models/LeaveRequest');

// Get all leave requests (optionally filtered by status)
const getLeaveRequests = async (req, res) => {
    try {
        const { status } = req.query;
        const query = {};

        if (status) {
            query.status = status;
        }

        const leaves = await LeaveRequest.find(query)
            .populate('employee_id', 'fullName employeeCode') // Populate employee data if referenced
            .exec();

        res.status(200).json(leaves);
    } catch (error) {
        console.error("🔥 Error fetching leave requests:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch leave requests",
            error: error.message,
        });
    }
};

// Create a new leave request
const createLeaveRequest = async (req, res) => {
    try {
        const { employee_id, employee_name, leave_type, start_date, end_date, reason } = req.body;

        const newLeaveRequest = new LeaveRequest({
            employee_id,
            employee_name,
            leave_type,
            start_date,
            end_date,
            reason,
            status: 'Pending',
        });

        await newLeaveRequest.save();

        res.status(201).json({
            success: true,
            message: 'Leave request created successfully',
            leaveRequest: newLeaveRequest,
        });
    } catch (error) {
        console.error('🔥 Error creating leave request:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create leave request',
            error: error.message,
        });
    }
};

// Update the status of a leave request
const updateLeaveStatus = async (req, res) => {
    const { leave_id } = req.params;
    const { status, reason } = req.body;

    // Validate the status
    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid status value',
        });
    }

    try {
        // Validate leave ID format
        if (!mongoose.Types.ObjectId.isValid(leave_id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid leave ID',
            });
        }

        // Find the leave request by ID
        const leave = await LeaveRequest.findById(leave_id);

        if (!leave) {
            return res.status(404).json({
                success: false,
                message: `Leave request with ID ${leave_id} not found`,
            });
        }

        // Ensure rejection reason is provided when status is 'Rejected'
        if (status === 'Rejected' && !reason) {
            return res.status(400).json({
                success: false,
                message: 'Rejection reason is required when rejecting the leave request',
            });
        }

        // Update the leave status and rejection reason if applicable
        leave.status = status;
        if (status === 'Rejected') {
            leave.rejectionReason = reason; // Ensure correct field name is used
        }

        // Save the updated leave request
        await leave.save();

        // Respond with success message
        res.status(200).json({
            success: true,
            message: 'Leave status updated successfully',
        });
    } catch (error) {
        console.error('🔥 Error updating leave status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update leave status',
            error: error.message,
        });
    }
};


module.exports = {
    getLeaveRequests,
    createLeaveRequest,
    updateLeaveStatus,
};
