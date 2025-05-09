import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Button,
    Typography,
    Container,
    List,
    ListItem,
    ListItemText,
    Divider,
    Pagination,
    TextField
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Employee = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [employeesPerPage] = useState(10);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedShift, setSelectedShift] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/employees');
                setEmployees(response.data);
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch employee data', error.message);
                setLoading(false);
            }
        };

        fetchEmployees();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    // Apply filters
    const filteredEmployees = employees.filter(emp => {
        const matchesDepartment =
            selectedDepartment === '' || emp.department?.toLowerCase().includes(selectedDepartment.toLowerCase());
        const matchesShift =
            selectedShift === '' || emp.shift?.toLowerCase().includes(selectedShift.toLowerCase());
        return matchesDepartment && matchesShift;
    });

    // Pagination logic
    const indexOfLastEmployee = page * employeesPerPage;
    const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
    const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleEmployeeClick = (id) => {
        navigate(`/employee/${id}`);
    };

    return (
        <Container style={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>
                Employee List
            </Typography>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                <TextField
                    label="Filter by Department"
                    variant="outlined"
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    style={{ flex: 1 }}
                />
                <TextField
                    label="Filter by Shift"
                    variant="outlined"
                    value={selectedShift}
                    onChange={(e) => setSelectedShift(e.target.value)}
                    style={{ flex: 1 }}
                />
            </div>

            {/* Add Employee Button */}
            <Button
                variant="contained"
                color="primary"
                style={{ marginBottom: '20px' }}
                onClick={() => navigate('/employee/add')}
            >
                Add New Employee
            </Button>

            {/* Employee List */}
            {filteredEmployees.length === 0 ? (
                <p>No employees found.</p>
            ) : (
                <List>
                    {currentEmployees.map((emp) => (
                        <div key={emp._id}>
                            <ListItem
                                style={{ padding: '10px', border: '1px solid #ccc', cursor: 'pointer' }}
                                onClick={() => handleEmployeeClick(emp._id)}
                            >
                                <ListItemText
                                    primary={`${emp.fullName} (${emp.employeeId})`}
                                    secondary={`Email: ${emp.email} | Designation: ${emp.designation} | Department: ${emp.department} | Shift: ${emp.shift} | Status: ${emp.status}`}
                                />
                            </ListItem>
                            <Divider />
                        </div>
                    ))}
                </List>
            )}

            {/* Pagination */}
            <Pagination
                count={Math.ceil(filteredEmployees.length / employeesPerPage)}
                page={page}
                onChange={handlePageChange}
                color="primary"
                style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}
            />
        </Container>
    );
};

export default Employee;
