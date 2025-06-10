import { useEffect, useState } from 'react';
import {
    Pencil,
    FileText,
    ClipboardIcon,
    ChevronDown,
    ChevronUp,
    UserCheck,
    Loader2
} from 'lucide-react';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';

export default function EmployeeManagement() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [masterCheckbox, setMasterCheckbox] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployees = async () => {
            const API_BASE_URL =
                import.meta.env.MODE === 'development'
                    ? import.meta.env.VITE_API_URL_LOCAL
                    : import.meta.env.VITE_API_URL_PROD;
            try {
                const response = await axios.get(`${API_BASE_URL}/api/employees`);
                setEmployees(response.data);
                setLoading(false);
            } catch (error) {
                setError("Failed to load employees. Please try again later.");
                console.error("Fetch error:", error.message);
                setLoading(false);
            }
        };

        fetchEmployees();
    }, []);

    const handleNavigation = (path) => {
        navigate(path);
    };
    
    // Sorting functionality
    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortedEmployees = () => {
        const sortableEmployees = [...employees];
        if (sortConfig.key) {
            sortableEmployees.sort((a, b) => {
                // Define mapping between column keys and actual object properties
                const keyMapping = {
                    'id': 'employeeCode',
                    'name': 'name',
                    // Keep other mappings as they are
                    'department': 'department',
                    'designation': 'designation'
                };
                
                // Use the mapped property name
                const actualKey = keyMapping[sortConfig.key] || sortConfig.key;
                
                if (a[actualKey] < b[actualKey]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[actualKey] > b[actualKey]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableEmployees;
    };

    // Checkbox functionality
    const handleSelectAll = () => {
        const newMasterState = !masterCheckbox;
        setMasterCheckbox(newMasterState);
        if (newMasterState) {
            setSelectedEmployees(employees.map(emp => emp.employeeCode));
        } else {
            setSelectedEmployees([]);
        }
    };

    const handleSelectEmployee = (id) => {
        const selectedIndex = selectedEmployees.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = [...selectedEmployees, id];
        } else {
            newSelected = selectedEmployees.filter(empId => empId !== id);
        }

        setSelectedEmployees(newSelected);
        setMasterCheckbox(newSelected.length === employees.length);
    };

    const isSelected = (id) => selectedEmployees.indexOf(id) !== -1;


    const handleViewDetails = (employeeCode) => {
        alert(`Viewing details for employee with ID: ${employeeCode}`);
        // Navigation or modal logic would go here
    };

    const handleDuplicate = (id) => {
        alert(`Creating a duplicate record for employee with ID: ${id}`);
        // Duplicate logic would go here
    };

    const handleAssignBranch = (id) => {
        alert(`Assigning branch for employee with ID: ${id}`);
        // Branch assignment logic would go here
    };


    const handleManageMobilePermission = () => {
        alert('Managing mobile permissions');
        // Open mobile permission management modal/page
    };

    const handleBulkAssignBranch = () => {
        alert('Bulk assigning branch');
        // Open branch assignment modal for selected employees
    };

    // Render sort icon
    const renderSortIcon = (key) => {
        if (sortConfig.key !== key) {
            return <ChevronDown className="ml-1 h-4 w-4" />;
        }
        return sortConfig.direction === 'ascending' ?
            <ChevronUp className="ml-1 h-4 w-4 text-blue-500" /> :
            <ChevronDown className="ml-1 h-4 w-4 text-blue-500" />;
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="bg-white rounded shadow">
                {/* Header section */}
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h1 className="text-xl font-medium">
                        Employee Details <span className="text-blue-500">({employees.length})</span>
                    </h1>
                    <div className="flex gap-3">
                        <button
                            onClick={handleManageMobilePermission}
                            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded text-sm font-medium"
                        >
                            Manage Mobile Permission
                        </button>
                        <button
                            onClick={handleBulkAssignBranch}
                            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded text-sm font-medium"
                        >
                            Assign Branch
                        </button>
                        <button
                            onClick={() => handleNavigation('/employee/add')}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium"
                        >
                            Add Employee
                        </button>
                        <div className="relative">
                            <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded text-sm font-medium flex items-center">
                                Actions <ChevronDown className="ml-2 h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Table section */}
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex justify-center items-center p-12">
                            <Loader2 size={40} className="animate-spin text-blue-600" />
                            <span className="ml-3 text-gray-600">Loading employees...</span>
                        </div>
                    ) : error ? (
                        <div className="text-center p-6 text-red-600">
                            <p>{error}</p>
                        </div>
                    ) : (
                        <table className="min-w-full">
                            <thead className="bg-blue-50">
                                <tr>
                                    <th className="w-12 px-4 py-3">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4"
                                            checked={masterCheckbox}
                                            onChange={handleSelectAll}
                                        />
                                    </th>
                                    <th className="px-4 py-3 text-left">
                                        <button
                                            className="flex items-center text-xs font-medium text-gray-700 uppercase"
                                            onClick={() => requestSort('id')}
                                        >
                                            Emp Id {renderSortIcon('id')}
                                        </button>
                                    </th>
                                    <th className="px-4 py-3 text-left">
                                        <button
                                            className="flex items-center text-xs font-medium text-gray-700 uppercase"
                                            onClick={() => requestSort('name')}
                                        >
                                            Name {renderSortIcon('name')}
                                        </button>
                                    </th>
                                    <th className="px-4 py-3 text-left">
                                        <button
                                            className="flex items-center text-xs font-medium text-gray-700 uppercase"
                                            onClick={() => requestSort('department')}
                                        >
                                            Department {renderSortIcon('department')}
                                        </button>
                                    </th>
                                    <th className="px-4 py-3 text-left">
                                        <button
                                            className="flex items-center text-xs font-medium text-gray-700 uppercase"
                                            onClick={() => requestSort('designation')}
                                        >
                                            Designation {renderSortIcon('designation')}
                                        </button>
                                    </th>
                                    <th className="px-4 py-3 text-left">
                                        <span className="text-xs font-medium text-gray-700 uppercase">Date Of Joining</span>
                                    </th>
                                    <th className="px-4 py-3 text-left">
                                        <span className="text-xs font-medium text-gray-700 uppercase">Biometrics Registered</span>
                                    </th>
                                    <th className="px-4 py-3 text-left">
                                        <span className="text-xs font-medium text-gray-700 uppercase">Action</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {getSortedEmployees().length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="px-4 py-6 text-center text-gray-500">
                                            No employees found
                                        </td>
                                    </tr>
                                ) : (
                                    getSortedEmployees().map((employee) => (
                                        <tr
                                            key={employee.employeeCode}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-4 py-3">
                                                <input
                                                    type="checkbox"
                                                    className="h-4 w-4"
                                                    checked={isSelected(employee.employeeCode)}
                                                    onChange={() => handleSelectEmployee(employee.employeeCode)}
                                                />
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700">{employee.employeeCode}</td>
                                            <td className="px-4 py-3 text-sm text-gray-700">{employee.name}</td>
                                            <td className="px-4 py-3 text-sm text-gray-700">{employee.department}</td>
                                            <td className="px-4 py-3 text-sm text-gray-700">{employee.designation}</td>
                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                {new Date(employee.dateOfJoining).toLocaleDateString('en-GB')}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                {employee.biometrics ?
                                                    <div className="flex items-center">
                                                        <UserCheck size={16} className="text-green-600 mr-1" />
                                                        <span>Face ID</span>
                                                    </div> :
                                                    "-"
                                                }
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleAssignBranch(employee.employeeCode)}
                                                        className="px-2 py-1 bg-white border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-50"
                                                    >
                                                        Assign Branch
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleNavigation(`/employee/${employee._id}`);
                                                        }}
                                                        className="p-1 text-gray-600 hover:text-blue-600 border border-gray-200 rounded"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleViewDetails(employee.employeeCode)}
                                                        className="p-1 text-gray-600 hover:text-blue-600 border border-gray-200 rounded"
                                                    >
                                                        <FileText size={16} />
                                                    </button>
                                                    {employee.hasDocs && (
                                                        <button
                                                            onClick={() => handleDuplicate(employee.employeeCode)}
                                                            className="p-1 text-gray-600 hover:text-blue-600 border border-gray-200 rounded"
                                                        >
                                                            <ClipboardIcon size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}