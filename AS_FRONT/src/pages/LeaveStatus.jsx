import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box,
    Tabs,
    Tab,
    Typography,
    Card,
    CardContent,
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Chip,
    Grid,
    Paper,
    Divider,
    Snackbar,
    Alert,
    AlertTitle
} from '@mui/material';
import {
    AccessTime as AccessTimeIcon,
    CheckCircle as ApprovedIcon,
    Cancel as RejectedIcon,
    CalendarToday as CalendarIcon,
    Visibility as ViewIcon
} from '@mui/icons-material';

// Style object - make sure to include this
const styles = {
    pageContainer: {
        padding: '24px',
        backgroundColor: '#f5f5f5',
        minHeight: '100vh'
    },
    header: {
        marginBottom: '24px'
    },
    tabsContainer: {
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '24px'
    },
    indicator: {
        backgroundColor: '#1976d2'
    },
    leaveCard: {
        marginBottom: '16px',
        transition: 'transform 0.2s',
        "&:hover": {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
        }
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '16px'
    },
    cardInfo: {
        marginBottom: '16px'
    },
    pendingChip: {
        backgroundColor: '#fff9c4',
        color: '#fbc02d'
    },
    approvedChip: {
        backgroundColor: '#e8f5e9',
        color: '#4caf50'
    },
    rejectedChip: {
        backgroundColor: '#ffebee',
        color: '#f44336'
    },
    infoRow: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '8px'
    },
    actionButtons: {
        marginTop: '16px'
    },
    viewButton: {
        marginRight: '8px'
    },
    rejectButton: {
        backgroundColor: '#f44336',
        marginRight: '8px',
        "&:hover": {
            backgroundColor: '#d32f2f'
        }
    },
    approveButton: {
        backgroundColor: '#4caf50',
        "&:hover": {
            backgroundColor: '#388e3c'
        }
    },
    noData: {
        textAlign: 'center',
        padding: '48px'
    },
    reasonContainer: {
        backgroundColor: '#f5f5f5',
        padding: '12px',
        borderRadius: '4px',
        marginTop: '8px'
    }
};

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
        axios.get('http://localhost:5000/api/leaves')
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
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        // Map tab value to status
        const statusMap = {
            0: 'Pending',
            1: 'Approved',
            2: 'Rejected'
        };
        const status = statusMap[newValue];
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
    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    // Handle approve function
    const handleApprove = (leave) => {
        axios.put(`http://localhost:5000/api/leaves/${leave._id}`, {
            status: 'Approved'
        })
            .then(response => {
                setSnackbar({
                    open: true,
                    message: 'Leave request approved successfully!',
                    severity: 'success'
                });
                setLeaveRequests(leaveRequests.map(item =>
                    item._id === leave._id ? { ...item, status: 'Approved' } : item
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

        axios.put(`http://localhost:5000/api/leaves/${selectedLeave._id}`, {
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
                    leave._id === selectedLeave._id ? { ...leave, status: 'Rejected', reason: rejectionReason } : leave
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
                return <Chip
                    icon={<AccessTimeIcon />}
                    label="Pending"
                    sx={styles.pendingChip}
                />;
            case 'Approved':
                return <Chip
                    icon={<ApprovedIcon />}
                    label="Approved"
                    sx={styles.approvedChip}
                />;
            case 'Rejected':
                return <Chip
                    icon={<RejectedIcon />}
                    label="Rejected"
                    sx={styles.rejectedChip}
                />;
            default:
                return null;
        }
    };

    // Calculate total days between two dates
    const calculateDays = (startDate, endDate) => {
        return Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1;
    };

    return (
        <Box sx={styles.pageContainer}>
            <Paper elevation={1} sx={{ padding: '24px', marginBottom: '24px' }}>
                <Typography variant="h4" component="h1" sx={styles.header}>
                    Leave Management System
                </Typography>
                <Typography variant="body1" color="textSecondary">
                    Track and manage employee leave requests
                </Typography>
            </Paper>

            {/* MUI Tabs Implementation */}
            <Paper sx={styles.tabsContainer}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    sx={{ '& .MuiTabs-indicator': styles.indicator }}
                    variant="fullWidth"
                    indicatorColor="primary"
                    textColor="primary"
                >
                    <Tab
                        icon={<AccessTimeIcon />}
                        label="Pending"
                        iconPosition="start"
                    />
                    <Tab
                        icon={<ApprovedIcon />}
                        label="Approved"
                        iconPosition="start"
                    />
                    <Tab
                        icon={<RejectedIcon />}
                        label="Rejected"
                        iconPosition="start"
                    />
                </Tabs>
            </Paper>

            {/* Leave Request Cards */}
            <Grid container spacing={3}>
                {filteredRequests.length > 0 ? (
                    filteredRequests.map((leave) => (
                        <Grid item xs={12} sm={6} md={4} key={leave._id}>
                            <Card sx={styles.leaveCard}>
                                <CardContent>
                                    <Box sx={styles.cardHeader}>
                                        <Box>
                                            <Typography variant="h6" component="h2">
                                                {leave.employee_name}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                {leave.leave_type}
                                            </Typography>
                                        </Box>
                                        {getStatusChip(leave.status)}
                                    </Box>

                                    <Divider sx={{ marginBottom: '16px' }} />

                                    <Box sx={styles.cardInfo}>
                                        <Box sx={styles.infoRow}>
                                            <CalendarIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                            <Typography variant="body2">
                                                <strong>Start:</strong> {new Date(leave.start_date).toLocaleDateString()}
                                            </Typography>
                                        </Box>
                                        <Box sx={styles.infoRow}>
                                            <CalendarIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                            <Typography variant="body2">
                                                <strong>End:</strong> {new Date(leave.end_date).toLocaleDateString()}
                                            </Typography>
                                        </Box>
                                        <Box sx={styles.infoRow}>
                                            <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                            <Typography variant="body2">
                                                <strong>Days:</strong> {calculateDays(leave.start_date, leave.end_date)}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Typography variant="subtitle2" gutterBottom>
                                        Reason:
                                    </Typography>
                                    <Box sx={styles.reasonContainer}>
                                        <Typography variant="body2">
                                            {leave.reason}
                                        </Typography>
                                    </Box>

                                    <Box sx={styles.actionButtons}>
                                        <Button
                                            variant="outlined"
                                            startIcon={<ViewIcon />}
                                            onClick={() => handleView(leave)}
                                            sx={styles.viewButton}
                                        >
                                            View
                                        </Button>

                                        {leave.status === 'Pending' && (
                                            <>
                                                <Button
                                                    variant="contained"
                                                    startIcon={<RejectedIcon />}
                                                    onClick={() => handleReject(leave)}
                                                    sx={styles.rejectButton}
                                                >
                                                    Reject
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    startIcon={<ApprovedIcon />}
                                                    onClick={() => handleApprove(leave)}
                                                    sx={styles.approveButton}
                                                >
                                                    Approve
                                                </Button>
                                            </>
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Grid item xs={12}>
                        <Paper sx={styles.noData}>
                            <Typography variant="h6">
                                No {selectedStatus} Requests Found
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                There are no leave requests with {selectedStatus} status.
                            </Typography>
                        </Paper>
                    </Grid>
                )}
            </Grid>

            {/* Rejection Dialog */}
            <Dialog
                open={selectedLeave !== null}
                onClose={() => setSelectedLeave(null)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    Provide Reason for Rejection
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Rejection Reason"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSelectedLeave(null)} color="inherit">
                        Cancel
                    </Button>
                    <Button onClick={submitRejection} color="error" variant="contained">
                        Submit Rejection
                    </Button>
                </DialogActions>
            </Dialog>

            {/* View Leave Details Dialog */}
            <Dialog
                open={viewDialogOpen}
                onClose={handleCloseViewDialog}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    Leave Request Details
                </DialogTitle>
                <DialogContent dividers>
                    {viewDialogData && (
                        <Box sx={{ p: 1 }}>
                            <Typography variant="h6" gutterBottom>
                                {viewDialogData.employee_name}
                            </Typography>

                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2">Leave Type</Typography>
                                    <Typography variant="body1">{viewDialogData.leave_type}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2">Status</Typography>
                                    <Box sx={{ mt: 1 }}>
                                        {getStatusChip(viewDialogData.status)}
                                    </Box>
                                </Grid>
                            </Grid>

                            <Divider sx={{ my: 2 }} />

                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2">Start Date</Typography>
                                    <Typography variant="body1">
                                        {new Date(viewDialogData.start_date).toLocaleDateString()}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2">End Date</Typography>
                                    <Typography variant="body1">
                                        {new Date(viewDialogData.end_date).toLocaleDateString()}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2">Total Days</Typography>
                                    <Typography variant="body1">{viewDialogData.totalDays}</Typography>
                                </Grid>
                            </Grid>

                            <Divider sx={{ my: 2 }} />

                            <Typography variant="subtitle2">Reason for Leave</Typography>
                            <Paper elevation={0} sx={{ p: 2, bgcolor: '#f5f5f5', mt: 1 }}>
                                <Typography variant="body1">{viewDialogData.reason}</Typography>
                            </Paper>

                            {viewDialogData.status === 'Rejected' && viewDialogData.rejectionReason && (
                                <>
                                    <Typography variant="subtitle2" sx={{ mt: 2 }}>Rejection Reason</Typography>
                                    <Paper elevation={0} sx={{ p: 2, bgcolor: '#ffebee', mt: 1 }}>
                                        <Typography variant="body1">{viewDialogData.rejectionReason}</Typography>
                                    </Paper>
                                </>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseViewDialog} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    <AlertTitle>{snackbar.severity === 'success' ? 'Success' :
                        snackbar.severity === 'error' ? 'Error' :
                            snackbar.severity === 'warning' ? 'Warning' : 'Info'}</AlertTitle>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default LeaveStatusPage;