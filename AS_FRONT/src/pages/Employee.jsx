import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import {
    Search,
    UserPlus,
    Briefcase,
    Clock,
    Users,
    ChevronRight,
    Loader2
} from 'lucide-react';

const EmployeePage = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [employeesPerPage] = useState(6);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedShift, setSelectedShift] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const navigate = useNavigate(); // Initialize useNavigate for routing

    const handleNavigation = (path) => {
        navigate(path); // Use navigate() to redirect
    };

    // Fetch actual data from the API
    useEffect(() => {
        const fetchEmployees = async () => {
            const API_BASE_URL =
                import.meta.env.MODE === 'development'
                    ? import.meta.env.VITE_API_URL_LOCAL
                    : import.meta.env.VITE_API_URL_PROD;

            try {
                const response = await axios.get(`${API_BASE_URL}/api/employees`);
                setEmployees(response.data); // Assuming response.data contains the employee data
                setLoading(false);
            } catch (error) {
                setError("Failed to load employees. Please try again later.");
                console.error("Fetch error:", error.message);
                setLoading(false);
            }
        };

        fetchEmployees();
    }, []);


    const filteredEmployees = employees.filter(emp => {
        const matchesDepartment =
            selectedDepartment === '' || emp.department?.toLowerCase().includes(selectedDepartment.toLowerCase());
        const matchesShift =
            selectedShift === '' || emp.shift?.toLowerCase().includes(selectedShift.toLowerCase());
        const matchesSearch =
            searchTerm === '' ||
            emp.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.designation?.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesDepartment && matchesShift && matchesSearch;
    });

    const indexOfLastEmployee = page * employeesPerPage;
    const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
    const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleEmployeeClick = (id) => {
        handleNavigation(`/employee/${id}`); // Navigate to employee details page
    };

    const departments = [...new Set(employees.map(emp => emp.department).filter(Boolean))];
    const shifts = [...new Set(employees.map(emp => emp.shift).filter(Boolean))];

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'inactive':
                return 'bg-red-100 text-red-800';
            case 'on leave':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
                            <p className="mt-2 text-sm text-gray-600">
                                Manage your company's workforce with ease
                            </p>
                        </div>
                        <button
                            onClick={() => handleNavigation('/employee/add')}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                        >
                            <UserPlus size={20} />
                            <span>Add New Employee</span>
                        </button>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-grow">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Search size={18} className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search employees..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                        </div>

                        <div className="flex gap-4">
                            <div className="relative">
                                <select
                                    value={selectedDepartment}
                                    onChange={(e) => setSelectedDepartment(e.target.value)}
                                    className="appearance-none w-full p-2 pl-3 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                >
                                    <option value="">All Departments</option>
                                    {departments.map((dept, index) => (
                                        <option key={index} value={dept}>{dept}</option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                    <Briefcase size={16} className="text-gray-400" />
                                </div>
                            </div>

                            <div className="relative">
                                <select
                                    value={selectedShift}
                                    onChange={(e) => setSelectedShift(e.target.value)}
                                    className="appearance-none w-full p-2 pl-3 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                >
                                    <option value="">All Shifts</option>
                                    {shifts.map((shift, index) => (
                                        <option key={index} value={shift}>{shift}</option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                    <Clock size={16} className="text-gray-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Employee List */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {loading ? (
                        <div className="flex justify-center items-center p-12">
                            <Loader2 size={40} className="animate-spin text-blue-600" />
                            <span className="ml-3 text-gray-600">Loading employees...</span>
                        </div>
                    ) : error ? (
                        <div className="text-center p-6 text-red-600">
                            <p>{error}</p>
                        </div>
                    ) : filteredEmployees.length === 0 ? (
                        <div className="text-center p-8 text-gray-500">
                            <Users size={48} className="mx-auto text-gray-400 mb-4" />
                            <p>No employees found matching your criteria.</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Employee
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Department
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Designation
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Shift
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                <span className="sr-only">Actions</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {currentEmployees.map((employee) => (
                                            <tr
                                                key={employee._id}
                                                className="hover:bg-blue-50 cursor-pointer transition-colors duration-150"
                                                onClick={() => handleEmployeeClick(employee._id)}
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                                                            {employee.fullName.split(' ').map(name => name[0]).join('')}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">{employee.fullName}</div>
                                                            <div className="text-xs text-gray-500">{employee.employeeId}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">{employee.department}</td>
                                                <td className="px-6 py-4 text-sm text-gray-500">{employee.designation}</td>
                                                <td className="px-6 py-4 text-sm text-gray-500">{employee.shift}</td>
                                                <td className="px-6 py-4 text-sm">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(employee.status)}`}>
                                                        {employee.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-right">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleNavigation(`/employee/${employee._id}`); // Edit button redirection
                                                        }}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        Edit
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="flex justify-between items-center py-3 px-6">
                                <button
                                    onClick={() => handlePageChange(page - 1)}
                                    disabled={page === 1}
                                    className="text-sm text-blue-600 disabled:text-gray-400"
                                >
                                    Previous
                                </button>
                                <span className="text-sm text-gray-700">
                                    Page {page} of {Math.ceil(filteredEmployees.length / employeesPerPage)}
                                </span>
                                <button
                                    onClick={() => handlePageChange(page + 1)}
                                    disabled={page === Math.ceil(filteredEmployees.length / employeesPerPage)}
                                    className="text-sm text-blue-600 disabled:text-gray-400"
                                >
                                    Next
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmployeePage;
