import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    UserPlus,
    Briefcase,
    Clock,
    Users,
    ChevronRight,
    Loader2,
    Edit,
    FileText,
    Trash2,
    Copy
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

    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
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
            <div className="max-w-full mx-auto px-6 py-6">
                {/* Header section */}
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-800">
                            Employee Details <span className="text-blue-500">({filteredEmployees.length})</span>
                        </h1>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => handleNavigation('/employee/add')}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium flex items-center gap-2"
                        >
                            <UserPlus size={16} />
                            Add Employee
                        </button>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
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
                                className="pl-10 w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                        </div>

                        <div className="flex gap-4">
                            <div className="relative">
                                <select
                                    value={selectedDepartment}
                                    onChange={(e) => setSelectedDepartment(e.target.value)}
                                    className="appearance-none w-full p-2 pl-3 pr-8 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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
                                    className="appearance-none w-full p-2 pl-3 pr-8 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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

                {/* Employee Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
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
                                    <thead className="bg-blue-50">
                                        <tr>
                                            <th scope="col" className="p-3 w-10">
                                                <input type="checkbox" className="w-4 h-4" />
                                            </th>
                                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                                                Emp Id
                                            </th>
                                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                                                Name
                                            </th>
                                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                                                Department
                                            </th>
                                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                                                Designation
                                            </th>
                                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                                                Date Of Joining
                                            </th>
                                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                                                Status
                                            </th>
                                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {currentEmployees.map((employee) => (
                                            <tr key={employee._id} className="hover:bg-gray-50">

                                                <td className="p-3 w-10" onClick={(e) => e.stopPropagation()}>
                                                    <input type="checkbox" className="w-4 h-4" />
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-700">{employee.employeeId}</td>
                                                <td className="px-4 py-3 text-sm">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-xs">
                                                            {employee.photo ? (
                                                                <img
                                                                    src={employee.photo}
                                                                    alt={employee.fullName}
                                                                    className="h-8 w-8 rounded-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-xs">
                                                                    {employee.fullName.split(' ').map(name => name[0]).join('')}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="ml-3 text-gray-700">{employee.fullName}</div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-700">{employee.department}</td>
                                                <td className="px-4 py-3 text-sm text-gray-700">{employee.designation}</td>
                                                <td className="px-4 py-3 text-sm text-gray-700">{new Date(employee.joiningDate).toLocaleDateString('en-GB').replaceAll('/', '-')}</td>
                                                <td className="px-4 py-3 text-sm">
                                                    {employee.status && (
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(employee.status)}`}>
                                                            {employee.status}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-sm" onClick={(e) => e.stopPropagation()}>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleNavigation(`/employee/${employee._id}`);
                                                            }}
                                                            className="p-1 text-gray-600 hover:text-blue-600"
                                                        >
                                                            <Edit size={20} />
                                                        </button>
                                                        {/* <button className="p-1 text-gray-600 hover:text-blue-600">
                                                            <FileText size={16} />
                                                        </button> */}
                                                        {/* <button className="p-1 text-gray-600 hover:text-red-600">
                                                            <Trash2 size={16} />
                                                        </button> */}

                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="flex justify-between items-center py-3 px-6 border-t border-gray-200">
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