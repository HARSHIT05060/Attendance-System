import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Typography, Container, TextField, Grid, Paper, Box } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

const EmployeeDetail = () => {
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    // Fetch employee details by ID when the component mounts
    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/employees/${id}`);
                setEmployee(response.data);
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch employee data' ,error.message);
                setLoading(false);
            }
        };

        fetchEmployee();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    // Handle Edit Click
    const handleEditClick = () => {
        setIsEditing(true); // Enable editing
    };

    // Handle Save Click
    const handleSaveClick = async () => {
        try {
            await axios.put(`http://localhost:5000/api/employees/${id}`, employee); // Update employee data
            setIsEditing(false); // Disable editing
        } catch (error) {
            setError('Failed to update employee data' , error.message);
        }
    };

    // Handle Delete Click
    const handleDeleteClick = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/employees/${id}`); // Delete employee
            navigate('/employee'); // Redirect back to employee list after deletion
        } catch (error) {
            setError('Failed to delete employee' , error.message);
        }
    };

    return (
        <Container style={{ padding: '20px', backgroundColor: '#f4f4f4' }}>
            <Typography variant="h4" gutterBottom style={{ color: '#333' }}>
                Employee Details
            </Typography>

            {employee && (
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        {/* Photo Section */}
                        <Paper elevation={3} style={{ padding: '20px', textAlign: 'center' }}>
                            <Typography variant="h6" gutterBottom style={{ color: '#333' }}>
                                Photo
                            </Typography>
                            {employee.photo ? (
                                <img src={employee.photo} alt="Employee" style={{ maxWidth: '100%', height: 'auto', borderRadius: '50%' }} />
                            ) : (
                                <div style={{ padding: '20px', backgroundColor: '#ddd', borderRadius: '50%' }}>
                                    <Typography variant="body1" style={{ color: '#333' }}>
                                        No Photo Available
                                    </Typography>
                                </div>
                            )}
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={8}>
                        <Paper elevation={3} style={{ padding: '20px' }}>
                            {/* Employee Details */}
                            <Box mb={2}>
                                <TextField
                                    label="Full Name"
                                    variant="outlined"
                                    fullWidth
                                    value={employee.fullName}
                                    onChange={(e) => setEmployee({ ...employee, fullName: e.target.value })}
                                    disabled={!isEditing}
                                />
                            </Box>
                            <Box mb={2}>
                                <TextField
                                    label="Employee ID"
                                    variant="outlined"
                                    fullWidth
                                    value={employee.employeeId}
                                    onChange={(e) => setEmployee({ ...employee, employeeId: e.target.value })}
                                    disabled={!isEditing}
                                />
                            </Box>
                            <Box mb={2}>
                                <TextField
                                    label="Email"
                                    variant="outlined"
                                    fullWidth
                                    value={employee.email}
                                    onChange={(e) => setEmployee({ ...employee, email: e.target.value })}
                                    disabled={!isEditing}
                                />
                            </Box>
                            <Box mb={2}>
                                <TextField
                                    label="Phone Number"
                                    variant="outlined"
                                    fullWidth
                                    value={employee.phoneNumber}
                                    onChange={(e) => setEmployee({ ...employee, phoneNumber: e.target.value })}
                                    disabled={!isEditing}
                                />
                            </Box>
                            <Box mb={2}>
                                <TextField
                                    label="Department"
                                    variant="outlined"
                                    fullWidth
                                    value={employee.department}
                                    onChange={(e) => setEmployee({ ...employee, department: e.target.value })}
                                    disabled={!isEditing}
                                />
                            </Box>
                            <Box mb={2}>
                                <TextField
                                    label="Designation"
                                    variant="outlined"
                                    fullWidth
                                    value={employee.designation}
                                    onChange={(e) => setEmployee({ ...employee, designation: e.target.value })}
                                    disabled={!isEditing}
                                />
                            </Box>
                            <Box mb={2}>
                                <TextField
                                    label="Salary"
                                    variant="outlined"
                                    fullWidth
                                    value={employee.salary}
                                    onChange={(e) => setEmployee({ ...employee, salary: e.target.value })}
                                    disabled={!isEditing}
                                />
                            </Box>
                            <Box mb={2}>
                                <TextField
                                    label="Status"
                                    variant="outlined"
                                    fullWidth
                                    value={employee.status}
                                    onChange={(e) => setEmployee({ ...employee, status: e.target.value })}
                                    disabled={!isEditing}
                                />
                            </Box>
                            <Box mb={2}>
                                <TextField
                                    label="Shift"
                                    variant="outlined"
                                    fullWidth
                                    value={employee.shift}
                                    onChange={(e) => setEmployee({ ...employee, shift: e.target.value })}
                                    disabled={!isEditing}
                                />
                            </Box>
                            {/* Biometric Section */}
                            <Box mb={2}>
                                <Typography variant="h6" style={{ color: '#333' }}>
                                    Biometric Information
                                </Typography>
                                <div>
                                    <strong>Face Recognition:</strong> {employee.biometricFaceRecognition ? 'Available' : 'Not Available'}
                                </div>
                                <div>
                                    <strong>Fingerprint:</strong> {employee.biometricFingerprint ? 'Available' : 'Not Available'}
                                </div>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Edit, Save, Delete Buttons */}
                    <Grid item xs={12} style={{ textAlign: 'center' }}>
                        {!isEditing ? (
                            <Button variant="contained" color="primary" onClick={handleEditClick} style={{ marginRight: '10px' }}>
                                Edit
                            </Button>
                        ) : (
                            <Button variant="contained" color="primary" onClick={handleSaveClick} style={{ marginRight: '10px' }}>
                                Save
                            </Button>
                        )}
                        <Button variant="contained" color="secondary" onClick={handleDeleteClick}>
                            Delete
                        </Button>
                    </Grid>
                </Grid>
            )}
        </Container>
    );
};

export default EmployeeDetail;
