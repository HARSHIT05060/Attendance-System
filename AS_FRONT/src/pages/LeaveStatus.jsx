import React, { useEffect, useState } from 'react';
import axios from 'axios';
// MUI Icons
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import VisibilityIcon from '@mui/icons-material/Visibility';

const LeaveStatusPage = () => {
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('Pending');
    const [rejectionReason, setRejectionReason] = useState('');
    const [selectedLeave, setSelectedLeave] = useState(null);
    const [tabValue, setTabValue] = useState(0);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [viewDialogData, setViewDialogData] = useState(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    // Data fetching
    useEffect(() => {
        const API_BASE_URL =
            import.meta.env.MODE === 'development'
                ? import.meta.env.VITE_API_URL_LOCAL
                : import.meta.env.VITE_API_URL_PROD;

        axios.get(`${API_BASE_URL}/api/leaves`)
            .then(response => {
                setLeaveRequests(response.data);
            })
            .catch(error => {
                console.error("Error fetching leave requests:", error);
            });
    }, []);


    // Filter leave requests whenever the data or selected status changes
    useEffect(() => {
        const filtered = leaveRequests.filter(leave => leave.status === selectedStatus);
        setFilteredRequests(filtered);
    }, [leaveRequests, selectedStatus]);

    // Handle tab change
    const handleTabChange = (status, tabIndex) => {
        setTabValue(tabIndex);
        setSelectedStatus(status);
    };

    // Handle view function
    const handleView = (leave) => {
        setViewDialogData({
            ...leave,
            totalDays: Math.ceil((new Date(leave.end_date) - new Date(leave.start_date)) / (1000 * 60 * 60 * 24)) + 1
        });
        setViewDialogOpen(true);
    };

    // Close view dialog
    const handleCloseViewDialog = () => {
        setViewDialogOpen(false);
    };

    // Handle snackbar close
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    // Handle approve function
    const handleApprove = (leaveId) => {
        const API_BASE_URL =
            import.meta.env.MODE === 'development'
                ? import.meta.env.VITE_API_URL_LOCAL
                : import.meta.env.VITE_API_URL_PROD;

        axios.put(`${API_BASE_URL}/api/leaves/${leaveId}`, {
            status: 'Approved'
        })
            .then(response => {
                setSnackbar({
                    open: true,
                    message: 'Leave request approved successfully!',
                    severity: 'success'
                });
                setLeaveRequests(leaveRequests.map(item =>
                    item._id === leaveId ? { ...item, status: 'Approved' } : item
                ));
            })
            .catch(error => {
                console.error("Error approving leave request:", error);
                setSnackbar({
                    open: true,
                    message: 'Failed to approve leave request. Please try again.',
                    severity: 'error'
                });
            });
    };


    // Handle reject function
    const handleReject = (leave) => {
        setSelectedLeave(leave);
    };

    // Submit rejection function
    const submitRejection = () => {
        const API_BASE_URL =
            import.meta.env.MODE === 'development'
                ? import.meta.env.VITE_API_URL_LOCAL
                : import.meta.env.VITE_API_URL_PROD;

        if (!rejectionReason) {
            setSnackbar({
                open: true,
                message: 'Please provide a reason for rejection.',
                severity: 'warning'
            });
            return;
        }

        if (!selectedLeave || !selectedLeave._id) {
            setSnackbar({
                open: true,
                message: 'Something went wrong. Please try again.',
                severity: 'error'
            });
            return;
        }

        axios.put(`${API_BASE_URL}/api/leaves/${selectedLeave._id}`, {
            status: 'Rejected',
            reason: rejectionReason
        })
            .then(response => {
                setSnackbar({
                    open: true,
                    message: 'Leave request rejected successfully!',
                    severity: 'success'
                });
                setLeaveRequests(leaveRequests.map(leave =>
                    leave._id === selectedLeave._id
                        ? { ...leave, status: 'Rejected', rejectionReason }
                        : leave
                ));
                setRejectionReason('');
                setSelectedLeave(null);
            })
            .catch(error => {
                console.error("Error rejecting leave request:", error);
                setSnackbar({
                    open: true,
                    message: 'Failed to reject leave request. Please try again.',
                    severity: 'error'
                });
            });
    };


    // Helper function to get status chip
    const getStatusChip = (status) => {
        switch (status) {
            case 'Pending':
                return (
                    <div className="flex items-center bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full text-sm">
                        <AccessTimeIcon className="h-4 w-4 mr-1" />
                        <span>Pending</span>
                    </div>
                );
            case 'Approved':
                return (
                    <div className="flex items-center bg-green-100 text-green-600 px-2 py-1 rounded-full text-sm">
                        <CheckCircleIcon className="h-4 w-4 mr-1" />
                        <span>Approved</span>
                    </div>
                );
            case 'Rejected':
                return (
                    <div className="flex items-center bg-red-100 text-red-600 px-2 py-1 rounded-full text-sm">
                        <CancelIcon className="h-4 w-4 mr-1" />
                        <span>Rejected</span>
                    </div>
                );
            default:
                return null;
        }
    };

    // Calculate total days between two dates
    const calculateDays = (startDate, endDate) => {
        return Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1;
    };

    // Render leave card - consistent across all statuses
    const renderLeaveCard = (leave) => (
        <div className="w-full md:w-1/3 px-3 mb-6" key={leave._id}>
            <div className="bg-white rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full flex flex-col">
                <div className="p-4 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-2/3">
                            <h2 className="text-lg font-medium text-gray-800 truncate">{leave.employee_name}</h2>
                            <p className="text-sm text-gray-500">{leave.leave_type}</p>
                        </div>
                        {getStatusChip(leave.status)}
                    </div>

                    <hr className="my-4" />

                    <div className="mb-4">
                        <div className="flex items-center mb-2">
                            <CalendarTodayIcon className="h-4 w-4 mr-2 text-gray-500" />
                            <p className="text-sm">
                                <span className="font-medium">Start:</span> {new Date(leave.start_date).toLocaleDateString('en-GB')}
                            </p>
                        </div>
                        <div className="flex items-center mb-2">
                            <CalendarTodayIcon className="h-4 w-4 mr-2 text-gray-500" />
                            <p className="text-sm">
                                <span className="font-medium">End:</span> {new Date(leave.end_date).toLocaleDateString('en-GB')}
                            </p>
                        </div>
                        <div className="flex items-center mb-2">
                            <AccessTimeIcon className="h-4 w-4 mr-2 text-gray-500" />
                            <p className="text-sm">
                                <span className="font-medium">Days:</span> {calculateDays(leave.start_date, leave.end_date)}
                            </p>
                        </div>
                    </div>

                    <div className="mb-4">
                        <h3 className="text-sm font-medium mb-2">Leave Reason:</h3>
                        <div className="bg-gray-100 p-3 rounded-md min-h-[70px] max-h-[150px] overflow-auto">
                            <p className="text-sm break-words whitespace-pre-line">{leave.reason || "No reason provided."}</p>
                        </div>
                    </div>

                    {leave.status === 'Rejected' && (
                        <div className="mb-4">
                            <h3 className="text-sm font-medium mb-2">Rejection Reason:</h3>
                            <div className="bg-red-50 p-3 rounded-md min-h-[70px] max-h-[150px] overflow-auto">
                                <p className="text-sm break-words whitespace-pre-line">{leave.rejectionReason || "No reason provided."}</p>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-wrap gap-2 mt-auto">
                        <button
                            onClick={() => handleView(leave)}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            <VisibilityIcon className="h-4 w-4 mr-2" />
                            View
                        </button>

                        {leave.status === 'Pending' && (
                            <>
                                <button
                                    onClick={() => handleReject(leave)}
                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                                >
                                    <CancelIcon className="h-4 w-4 mr-2" />
                                    Reject
                                </button>
                                <button
                                    onClick={() => handleApprove(leave._id)}
                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                                >
                                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                                    Approve
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-gray-100 min-h-screen p-6">
            {/* Header */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                <h1 className="text-2xl font-bold mb-2">Leave Management System</h1>
                <p className="text-gray-500">Track and manage employee leave requests</p>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm mb-6">
                <div className="flex border-b">
                    <button
                        className={`flex items-center px-4 py-3 text-sm font-medium ${tabValue === 0 ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'} flex-1 justify-center`}
                        onClick={() => handleTabChange('Pending', 0)}
                    >
                        <AccessTimeIcon className="mr-2 h-5 w-5" />
                        Pending
                    </button>
                    <button
                        className={`flex items-center px-4 py-3 text-sm font-medium ${tabValue === 1 ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'} flex-1 justify-center`}
                        onClick={() => handleTabChange('Approved', 1)}
                    >
                        <CheckCircleIcon className="mr-2 h-5 w-5" />
                        Approved
                    </button>
                    <button
                        className={`flex items-center px-4 py-3 text-sm font-medium ${tabValue === 2 ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'} flex-1 justify-center`}
                        onClick={() => handleTabChange('Rejected', 2)}
                    >
                        <CancelIcon className="mr-2 h-5 w-5" />
                        Rejected
                    </button>
                </div>
            </div>

            {/* Cards */}
            <div className="flex flex-wrap -mx-3">
                {filteredRequests.length > 0 ? (
                    filteredRequests.map((leave) => renderLeaveCard(leave))
                ) : (
                    <div className="w-full">
                        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                            <h2 className="text-lg font-medium text-gray-700">No {selectedStatus} Requests Found</h2>
                            <p className="text-gray-500 mt-2">There are no leave requests with {selectedStatus} status.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Rejection Dialog */}
            {selectedLeave && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="p-6 border-b">
                            <h2 className="text-lg font-medium">Provide Reason for Rejection</h2>
                        </div>
                        <div className="p-6">
                            <textarea
                                className="w-full border border-gray-300 rounded-md p-3 h-32 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter rejection reason"
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                            ></textarea>
                        </div>
                        <div className="p-4 bg-gray-50 flex justify-end space-x-3 rounded-b-lg">
                            <button
                                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                                onClick={() => setSelectedLeave(null)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700"
                                onClick={submitRejection}
                            >
                                Submit Rejection
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Dialog */}
            {viewDialogOpen && viewDialogData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="p-6 border-b">
                            <h2 className="text-lg font-medium">Leave Request Details</h2>
                        </div>
                        <div className="p-6 overflow-y-auto max-h-[70vh]">
                            <h3 className="text-lg font-medium mb-4">{viewDialogData.employee_name}</h3>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Leave Type</h4>
                                    <p>{viewDialogData.leave_type}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Status</h4>
                                    <div className="mt-1">
                                        {getStatusChip(viewDialogData.status)}
                                    </div>
                                </div>
                            </div>

                            <hr className="my-4" />

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Start Date</h4>
                                    <p>{new Date(viewDialogData.start_date).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">End Date</h4>
                                    <p>{new Date(viewDialogData.end_date).toLocaleDateString()}</p>
                                </div>
                                <div className="col-span-2">
                                    <h4 className="text-sm font-medium text-gray-500">Total Days</h4>
                                    <p>{viewDialogData.totalDays}</p>
                                </div>
                            </div>

                            <hr className="my-4" />

                            <h4 className="text-sm font-medium text-gray-500 mb-2">Reason for Leave</h4>
                            <div className="bg-gray-100 p-4 rounded-md mb-4">
                                <p className="break-words">{viewDialogData.reason || "No reason provided."}</p>
                            </div>

                            {viewDialogData.status === 'Rejected' && viewDialogData.rejectionReason && (
                                <>
                                    <h4 className="text-sm font-medium text-gray-500 mb-2">Rejection Reason</h4>
                                    <div className="bg-red-50 p-4 rounded-md">
                                        <p className="break-words">{viewDialogData.rejectionReason}</p>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="p-4 bg-gray-50 flex justify-end rounded-b-lg">
                            <button
                                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                                onClick={handleCloseViewDialog}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Snackbar */}
            {snackbar.open && (
                <div className={`fixed bottom-4 right-4 max-w-xs p-4 rounded-md shadow-lg z-50 
                    ${snackbar.severity === 'success' ? 'bg-green-50 text-green-800 border-l-4 border-green-600' :
                        snackbar.severity === 'error' ? 'bg-red-50 text-red-800 border-l-4 border-red-600' :
                            snackbar.severity === 'warning' ? 'bg-yellow-50 text-yellow-800 border-l-4 border-yellow-600' :
                                'bg-blue-50 text-blue-800 border-l-4 border-blue-600'}`}
                >
                    <div className="flex">
                        <div className="flex-shrink-0">
                            {snackbar.severity === 'success' && (
                                <CheckCircleIcon className="h-5 w-5 text-green-400" />
                            )}
                            {snackbar.severity === 'error' && (
                                <CancelIcon className="h-5 w-5 text-red-400" />
                            )}
                            {snackbar.severity === 'warning' && (
                                <AccessTimeIcon className="h-5 w-5 text-yellow-400" />
                            )}
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium">
                                {snackbar.severity === 'success' ? 'Success' :
                                    snackbar.severity === 'error' ? 'Error' :
                                        snackbar.severity === 'warning' ? 'Warning' : 'Info'}
                            </h3>
                            <div className="mt-1 text-sm">
                                {snackbar.message}
                            </div>
                        </div>
                        <div className="ml-auto pl-3">
                            <div className="-mx-1.5 -my-1.5">
                                <button
                                    type="button"
                                    onClick={handleCloseSnackbar}
                                    className="inline-flex bg-transparent rounded-md p-1.5 text-gray-500 hover:bg-gray-200 focus:outline-none"
                                >
                                    <span className="sr-only">Close</span>
                                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeaveStatusPage;