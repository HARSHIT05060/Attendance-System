import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Employee = () => {
    const [employees, setEmployees] = useState([]);
    const [departmentFilter, setDepartmentFilter] = useState('');
    const [designationFilter, setDesignationFilter] = useState('');

    // Fetch employee data from backend
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get('http://localhost:5000/employees', {
                    params: {
                        department: departmentFilter,
                        designation: designationFilter
                    }
                });
                setEmployees(response.data);
            } catch (error) {
                console.error("Error fetching employees:", error);
            }
        };

        fetchEmployees();
    }, [departmentFilter, designationFilter]); // Re-fetch data if filters change

    return (
        <div>
            <h1>Employee List</h1>

            {/* Filters */}
            <div>
                <label>Department: </label>
                <input
                    type="text"
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    placeholder="Enter Department"
                />
            </div>

            <div>
                <label>Designation: </label>
                <input
                    type="text"
                    value={designationFilter}
                    onChange={(e) => setDesignationFilter(e.target.value)}
                    placeholder="Enter Designation"
                />
            </div>

            {/* Employee List */}
            <ul>
                {employees.map((employee) => (
                    <li key={employee._id}>
                        {employee.name} - {employee.department} - {employee.designation}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Employee;
