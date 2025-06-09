import { useState, useEffect } from 'react';
import {
    User,
    Pencil,
    Save,
    Trash2,
    Briefcase,
    Mail,
    Phone,
    CreditCard,
    Tag,
    Clock,
    Activity,
    Shield,
    Fingerprint,
    ArrowLeft,
    Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const EmployeeDetail = () => {
    // State for employee data and UI states
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const navigate = useNavigate();

    const employeeId = window.location.pathname.split('/').pop() || '1'; // Fallback to '1' if no ID in URL

    // Handle navigation (replace with your actual navigation method)
    const handleNavigation = (path) => {
        console.log(`Navigate to: ${path}`);
        navigate(path);
    };

    // Fetch employee data from API
    useEffect(() => {
        const fetchEmployeeData = async () => {
            setLoading(true);

            const API_BASE_URL =
                import.meta.env.MODE === 'development'
                    ? import.meta.env.VITE_API_URL_LOCAL
                    : import.meta.env.VITE_API_URL_PROD;

            try {
                const response = await fetch(`${API_BASE_URL}/api/employees/${employeeId}`);

                if (!response.ok) {
                    throw new Error(`Failed to fetch employee: ${response.status}`);
                }

                const data = await response.json();
                setEmployee(data);
                setError(null);
            } catch (err) {
                console.error("Error fetching employee data:", err);
                setError(`Failed to load employee data: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployeeData();
    }, [employeeId]);


    // Handle form updates
    const handleInputChange = (field, value) => {
        setEmployee(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Save employee data to API
    const handleSaveClick = async () => {
        setLoading(true);

        const API_BASE_URL =
            import.meta.env.MODE === 'development'
                ? import.meta.env.VITE_API_URL_LOCAL
                : import.meta.env.VITE_API_URL_PROD;

        try {
            const response = await fetch(`${API_BASE_URL}/api/employees/${employeeId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(employee)
            });

            if (!response.ok) {
                throw new Error(`Failed to update employee: ${response.status}`);
            }

            const updatedData = await response.json();
            setEmployee(updatedData);
            setIsEditing(false);
            setError(null);
        } catch (err) {
            console.error("Error updating employee data:", err);
            setError(`Failed to save changes: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };


    // Delete employee via API
    const handleDeleteClick = async () => {
        setLoading(true);

        const API_BASE_URL =
            import.meta.env.MODE === 'development'
                ? import.meta.env.VITE_API_URL_LOCAL
                : import.meta.env.VITE_API_URL_PROD;

        try {
            const response = await fetch(`${API_BASE_URL}/api/employees/${employeeId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`Failed to delete employee: ${response.status}`);
            }

            // Close modal and navigate
            setShowDeleteModal(false);
            handleNavigation('/employee');
        } catch (err) {
            console.error("Error deleting employee:", err);
            setError(`Failed to delete employee: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };


    // Function to get status color
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
        <div className="min-h-screen bg-gray-50 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header with back button */}
                <div className="mb-8">
                    <button
                        onClick={() => handleNavigation('/employee')}
                        className="flex items-center text-blue-600 hover:text-blue-800 font-medium mb-4 transition-colors"
                    >
                        <ArrowLeft size={18} className="mr-1" />
                        Back to Employee List
                    </button>

                    <h1 className="text-3xl font-bold text-gray-900">Employee Details</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        View and manage employee information
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center p-12">
                        <Loader2 size={40} className="animate-spin text-blue-600" />
                        <span className="ml-3 text-gray-600">Loading employee details...</span>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center text-red-600">
                        <p className="font-medium">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                ) : employee && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {/* Left Column - Photo and Basic Info */}
                        <div className="col-span-1">
                            <div className="bg-white rounded-lg shadow overflow-hidden">
                                <div className="bg-blue-600 p-4">
                                    <div className="flex justify-center">
                                        {employee.photo ? (
                                            <img
                                                src={employee.photo}
                                                alt={employee.name}
                                                className="h-32 w-32 rounded-full border-4 border-white object-cover"
                                            />
                                        ) : (
                                            <div className="h-32 w-32 rounded-full bg-white flex items-center justify-center text-blue-600 text-3xl font-bold">
                                                {employee.name?.split(' ').map(name => name[0]).join('')}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="p-4">
                                    <h2 className="text-xl font-bold text-center text-gray-800 mb-1">{employee.name}</h2>
                                    <p className="text-center text-gray-500 mb-4">{employee.designation}</p>

                                    <div className="pt-4 border-t border-gray-200">
                                        <div className="flex items-center py-2">
                                            <Tag size={18} className="text-gray-400 mr-3" />
                                            <p className="text-sm">
                                                <span className="text-gray-500">Employee ID:</span>{' '}
                                                <span className="font-medium text-gray-900">{employee.employeeCode}</span>
                                            </p>
                                        </div>

                                        <div className="flex items-center py-2">
                                            <Briefcase size={18} className="text-gray-400 mr-3" />
                                            <p className="text-sm">
                                                <span className="text-gray-500">Department:</span>{' '}
                                                <span className="font-medium text-gray-900">{employee.department}</span>
                                            </p>
                                        </div>

                                        <div className="flex items-center py-2">
                                            <Activity size={18} className="text-gray-400 mr-3" />
                                            <p className="text-sm">
                                                <span className="text-gray-500">Status:</span>{' '}
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(employee.status)}`}>
                                                    {employee.status}
                                                </span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-200">
                                        <h3 className="text-sm font-medium text-gray-700 mb-3">Biometric Information</h3>
                                        <div className="flex items-center py-2">
                                            <Shield size={18} className="text-gray-400 mr-3" />
                                            <p className="text-sm">
                                                <span className="text-gray-500">Face Recognition:</span>{' '}
                                                <span className={`font-medium ${employee.biometricFaceRecognition ? 'text-green-600' : 'text-gray-400'}`}>
                                                    {employee.biometricFaceRecognition ? 'Available' : 'Not Available'}
                                                </span>
                                            </p>
                                        </div>

                                        <div className="flex items-center py-2">
                                            <Fingerprint size={18} className="text-gray-400 mr-3" />
                                            <p className="text-sm">
                                                <span className="text-gray-500">Fingerprint:</span>{' '}
                                                <span className={`font-medium ${employee.biometricFingerprint ? 'text-green-600' : 'text-gray-400'}`}>
                                                    {employee.biometricFingerprint ? 'Available' : 'Not Available'}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Employee Details Form */}
                        <div className="col-span-1 md:col-span-3">
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Full Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <User size={16} className="text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                value={employee.name || ''}
                                                onChange={(e) => handleInputChange('name', e.target.value)}
                                                disabled={!isEditing}
                                                className={`pl-10 block w-full shadow-sm rounded-md py-2 px-3 border ${isEditing
                                                    ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                                    : 'border-gray-200 bg-gray-50 text-gray-600'
                                                    }`}
                                            />
                                        </div>
                                    </div>

                                    {/* Employee ID */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Tag size={16} className="text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                value={employee.employeeCode || ''}
                                                onChange={(e) => handleInputChange('employeeCode', e.target.value)}
                                                disabled={!isEditing}
                                                className={`pl-10 block w-full shadow-sm rounded-md py-2 px-3 border ${isEditing
                                                    ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                                    : 'border-gray-200 bg-gray-50 text-gray-600'
                                                    }`}
                                            />
                                        </div>
                                    </div>
                                    {/* Company Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Email</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Mail size={16} className="text-gray-400" />
                                            </div>
                                            <input
                                                type="email"
                                                value={employee.email || ''}
                                                onChange={(e) => handleInputChange('email', e.target.value)}
                                                disabled={!isEditing}
                                                className={`pl-10 block w-full shadow-sm rounded-md py-2 px-3 border ${isEditing
                                                    ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                                    : 'border-gray-200 bg-gray-50 text-gray-600'
                                                    }`}
                                            />
                                        </div>
                                    </div>
                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Personal Email</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Mail size={16} className="text-gray-400" />
                                            </div>
                                            <input
                                                type="email"
                                                value={employee.email || ''}
                                                onChange={(e) => handleInputChange('email', e.target.value)}
                                                disabled={!isEditing}
                                                className={`pl-10 block w-full shadow-sm rounded-md py-2 px-3 border ${isEditing
                                                    ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                                    : 'border-gray-200 bg-gray-50 text-gray-600'
                                                    }`}
                                            />
                                        </div>
                                    </div>

                                    {/* Phone Number */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Phone size={16} className="text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                value={employee.mobile || ''}
                                                onChange={(e) => handleInputChange('mobile', e.target.value)}
                                                disabled={!isEditing}
                                                className={`pl-10 block w-full shadow-sm rounded-md py-2 px-3 border ${isEditing
                                                    ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                                    : 'border-gray-200 bg-gray-50 text-gray-600'
                                                    }`}
                                            />
                                        </div>
                                    </div>

                                    {/* Department */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Briefcase size={16} className="text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                value={employee.department || ''}
                                                onChange={(e) => handleInputChange('department', e.target.value)}
                                                disabled={!isEditing}
                                                className={`pl-10 block w-full shadow-sm rounded-md py-2 px-3 border ${isEditing
                                                    ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                                    : 'border-gray-200 bg-gray-50 text-gray-600'
                                                    }`}
                                            />
                                        </div>
                                    </div>

                                    {/* Designation */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <User size={16} className="text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                value={employee.designation || ''}
                                                onChange={(e) => handleInputChange('designation', e.target.value)}
                                                disabled={!isEditing}
                                                className={`pl-10 block w-full shadow-sm rounded-md py-2 px-3 border ${isEditing
                                                    ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                                    : 'border-gray-200 bg-gray-50 text-gray-600'
                                                    }`}
                                            />
                                        </div>
                                    </div>

                                    {/* Salary */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <CreditCard size={16} className="text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                value={employee.salary || ''}
                                                onChange={(e) => handleInputChange('salary', e.target.value)}
                                                disabled={!isEditing}
                                                className={`pl-10 block w-full shadow-sm rounded-md py-2 px-3 border ${isEditing
                                                    ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                                    : 'border-gray-200 bg-gray-50 text-gray-600'
                                                    }`}
                                            />
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Activity size={16} className="text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                value={employee.status || ''}
                                                onChange={(e) => handleInputChange('status', e.target.value)}
                                                disabled={!isEditing}
                                                className={`pl-10 block w-full shadow-sm rounded-md py-2 px-3 border ${isEditing
                                                    ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                                    : 'border-gray-200 bg-gray-50 text-gray-600'
                                                    }`}
                                            />
                                        </div>
                                    </div>

                                    {/* Shift */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Shift</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Clock size={16} className="text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                value={employee.shift || ''}
                                                onChange={(e) => handleInputChange('shift', e.target.value)}
                                                disabled={!isEditing}
                                                className={`pl-10 block w-full shadow-sm rounded-md py-2 px-3 border ${isEditing
                                                    ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                                    : 'border-gray-200 bg-gray-50 text-gray-600'
                                                    }`}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* API Status Message */}
                                {error && (
                                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                                        {error}
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="mt-8 flex justify-center space-x-4">
                                    {!isEditing ? (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                            disabled={loading}
                                        >
                                            <Pencil size={18} className="mr-2" />
                                            Edit Employee
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleSaveClick}
                                            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                            disabled={loading}
                                        >
                                            <Save size={18} className="mr-2" />
                                            Save Changes
                                        </button>
                                    )}

                                    <button
                                        onClick={() => setShowDeleteModal(true)}
                                        className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                        disabled={loading}
                                    >
                                        <Trash2 size={18} className="mr-2" />
                                        Delete Employee
                                    </button>
                                    {showDeleteModal && (
                                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                                            <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full">
                                                <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
                                                <p className="mb-6">Are you sure you want to delete this employee?</p>
                                                <div className="flex justify-end space-x-4">
                                                    <button
                                                        onClick={() => setShowDeleteModal(false)}
                                                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={handleDeleteClick}
                                                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmployeeDetail;