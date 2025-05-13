import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import {
    TextField,
    Button,
    Container,
    Typography,
    Paper,
    Grid,
    Box,
    MenuItem,
    InputAdornment,
    Divider,
    Stepper,
    Step,
    StepLabel,
    createTheme,
    ThemeProvider
} from '@mui/material';
import {
    Person,
    Badge,
    Email,
    Phone,
    Work,
    Business,
    AttachMoney,
    CalendarMonth,
    AccountBalance,
    ToggleOn,
    AccessTime,
    Fingerprint,
    Face,
    PhotoCamera
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


// Custom theme
const theme = createTheme({
    palette: {
        primary: {
            main: '#2563eb', // Blue color
            light: '#3b82f6',
            dark: '#1d4ed8',
        },
        secondary: {
            main: '#10b981', // Green color
            light: '#34d399',
            dark: '#059669',
        },
        background: {
            default: '#f3f4f6',
            paper: '#ffffff',
        },
        text: {
            primary: '#1f2937',
            secondary: '#6b7280',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h4: {
            fontWeight: 600,
            color: '#1f2937',
        },
        subtitle1: {
            color: '#4b5563',
            fontWeight: 500,
        },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 500,
                    padding: '10px 24px',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                            borderColor: '#3b82f6',
                        },
                    },
                },
            },
        },
    },
});

// Employee status options
const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'probation', label: 'Probation' },
    { value: 'onLeave', label: 'On Leave' },
    { value: 'terminated', label: 'Terminated' }
];

// Shift options
const shiftOptions = [
    { value: 'morning', label: 'Morning (8:00 AM - 4:00 PM)' },
    { value: 'evening', label: 'Evening (4:00 PM - 12:00 AM)' },
    { value: 'night', label: 'Night (12:00 AM - 8:00 AM)' },
    { value: 'flexible', label: 'Flexible Hours' }
];


// Department options
const departmentOptions = [
    { label: "Human Resources", value: "hr" },
    { label: "Engineering", value: "engineering" },
    { label: "Marketing", value: "marketing" },
    { label: "Sales", value: "sales" },
    { label: "Finance", value: "finance" },
];


const AddEmployee = () => {
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const [photoPreview, setPhotoPreview] = useState(null);

    // Handle navigation (replace with your actual navigation method)
    const handleNavigation = (path) => {
        console.log(`Navigate to: ${path}`);
        navigate(path);
    };

    const [formData, setFormData] = useState({
        fullName: '',
        employeeId: '',
        personalEmail: '',
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
        if (name === 'photo' && files.length > 0) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
                setFormData({ ...formData, photo: reader.result });
            };
            reader.readAsDataURL(files[0]);
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

    const handleNext = () => {
        setActiveStep((prevStep) => prevStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    const steps = ['Personal Information', 'Job Details', 'Additional Info'];

    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Full Name"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                                variant="outlined"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Person color="primary" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Employee ID"
                                name="employeeId"
                                value={formData.employeeId}
                                onChange={handleChange}
                                required
                                variant="outlined"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Badge color="primary" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Email"
                                name="personalEmail"
                                type="email"
                                value={formData.personalEmail}
                                onChange={handleChange}
                                required
                                variant="outlined"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Email color="primary" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Phone Number"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                required
                                variant="outlined"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Phone color="primary" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                    </Grid>
                );
            case 1:
                return (
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Designation"
                                name="designation"
                                value={formData.designation}
                                onChange={handleChange}
                                required
                                variant="outlined"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Work color="primary" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                select
                                label="Department"
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                required
                                variant="outlined"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Business color="primary" />
                                        </InputAdornment>
                                    ),
                                }}
                            >
                                {departmentOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Salary"
                                name="salary"
                                type="number"
                                value={formData.salary}
                                onChange={handleChange}
                                required
                                variant="outlined"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AttachMoney color="primary" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Joining Date"
                                name="joiningDate"
                                value={formData.joiningDate}
                                onChange={handleChange}
                                required
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <CalendarMonth color="primary" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Bank Account Details"
                                name="bankAccountDetails"
                                value={formData.bankAccountDetails}
                                onChange={handleChange}
                                required
                                variant="outlined"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AccountBalance color="primary" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                    </Grid>
                );
            case 2:
                return (
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                select
                                label="Status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                required
                                variant="outlined"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <ToggleOn color="primary" />
                                        </InputAdornment>
                                    ),
                                }}
                            >
                                {statusOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                select
                                label="Shift"
                                name="shift"
                                value={formData.shift}
                                onChange={handleChange}
                                required
                                variant="outlined"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AccessTime color="primary" />
                                        </InputAdornment>
                                    ),
                                }}
                            >
                                {shiftOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Face Recognition (Biometric)"
                                name="biometricFaceRecognition"
                                value={formData.biometricFaceRecognition || ''}
                                onChange={handleChange}
                                variant="outlined"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Face color="primary" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Fingerprint (Biometric)"
                                name="biometricFingerprint"
                                value={formData.biometricFingerprint || ''}
                                onChange={handleChange}
                                variant="outlined"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Fingerprint color="primary" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ mt: 2, mb: 2 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Employee Photo
                                </Typography>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        p: 2,
                                        border: '1px dashed',
                                        borderColor: 'grey.400',
                                        borderRadius: 1,
                                        bgcolor: 'background.paper',
                                        minHeight: 150,
                                    }}
                                >
                                    {photoPreview ? (
                                        <img
                                            src={photoPreview}
                                            alt="Employee Preview"
                                            style={{ maxWidth: '100%', maxHeight: 150 }}
                                        />
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">
                                            No photo selected
                                        </Typography>
                                    )}
                                    <Button
                                        variant="outlined"
                                        component="label"
                                        startIcon={<PhotoCamera />}
                                        sx={{ mt: 2 }}
                                    >
                                        Upload Photo
                                        <input
                                            type="file"
                                            name="photo"
                                            accept="image/*"
                                            hidden
                                            onChange={handleChange}
                                        />
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                );
            default:
                return 'Unknown step';
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
                <Container maxWidth="md">
                    <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                        <button
                            onClick={() => handleNavigation('/employee')}
                            className="flex items-center text-blue-600 hover:text-blue-800 font-medium mb-4 transition-colors"
                        >
                            <ArrowLeft size={18} className="mr-1" />
                            Back to Employee List
                        </button>
                        <Typography variant="h4" align="center" gutterBottom>
                            Add New Employee
                        </Typography>
                        <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 4 }}>
                            Complete the form below to register a new employee in the system
                        </Typography>

                        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>

                        <Divider sx={{ mb: 4 }} />

                        <form onSubmit={handleSubmit}>
                            {getStepContent(activeStep)}

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                                <Button
                                    disabled={activeStep === 0}
                                    onClick={handleBack}
                                    variant="outlined"
                                >
                                    Back
                                </Button>
                                <Box>
                                    {activeStep === steps.length - 1 ? (
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            sx={{ boxShadow: 2 }}
                                        >
                                            Submit
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            onClick={handleNext}
                                            color="primary"
                                            sx={{ boxShadow: 2 }}
                                        >
                                            Next
                                        </Button>
                                    )}
                                </Box>
                            </Box>
                        </form>
                    </Paper>
                </Container>
            </Box>
        </ThemeProvider>
    );
};

export default AddEmployee;