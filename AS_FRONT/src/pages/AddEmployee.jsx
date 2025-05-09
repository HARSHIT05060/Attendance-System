import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddEmployee = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        employeeId: '',
        email: '',
        phoneNumber: '',
        designation: '',
        department: '',
        salary: '',
        joiningDate: '',
        bankAccountDetails: '',
        status: '',
        shift: '',
        biometricFaceRecognition: null,
        biometricFingerprint: null,
        photo: null,
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'photo') {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, photo: reader.result });
            };
            if (files.length > 0) reader.readAsDataURL(files[0]);
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/employees', formData);
            console.log('Employee added:', res.data);
            navigate('/employee');
        } catch (error) {
            console.error('Error adding employee:', error.message);
            if (error.response) {
                console.error('Details:', error.response.data);
            }
        }
    };

    return (
        <Container maxWidth="sm" style={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>Add New Employee</Typography>
            <form onSubmit={handleSubmit}>
                <TextField fullWidth label="Full Name" name="fullName" onChange={handleChange} required margin="normal" />
                <TextField fullWidth label="Employee ID" name="employeeId" onChange={handleChange} required margin="normal" />
                <TextField fullWidth label="Email" name="email" onChange={handleChange} required margin="normal" />
                <TextField fullWidth label="Phone Number" name="phoneNumber" onChange={handleChange} required margin="normal" />
                <TextField fullWidth label="Designation" name="designation" onChange={handleChange} required margin="normal" />
                <TextField fullWidth label="Department" name="department" onChange={handleChange} required margin="normal" />
                <TextField fullWidth label="Salary" name="salary" onChange={handleChange} required margin="normal" />
                <TextField fullWidth type="date" label="Joining Date" name="joiningDate" onChange={handleChange} required margin="normal" InputLabelProps={{ shrink: true }} />
                <TextField fullWidth label="Bank Account Details" name="bankAccountDetails" onChange={handleChange} required margin="normal" />
                <TextField fullWidth label="Status" name="status" onChange={handleChange} required margin="normal" />
                <TextField fullWidth label="Shift" name="shift" onChange={handleChange} required margin="normal" />

                {/* Optional biometric fields */}
                <TextField fullWidth label="Face Recognition (Biometric)" name="biometricFaceRecognition" onChange={handleChange} margin="normal" />
                <TextField fullWidth label="Fingerprint (Biometric)" name="biometricFingerprint" onChange={handleChange} margin="normal" />

                <Button variant="contained" component="label" style={{ marginTop: '10px' }}>
                    Upload Photo
                    <input type="file" name="photo" accept="image/*" hidden onChange={handleChange} />
                </Button>

                <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }}>
                    Submit
                </Button>
            </form>
        </Container>
    );
};

export default AddEmployee;
