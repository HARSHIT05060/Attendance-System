import React, { useEffect, useState } from "react";
import { X, Plus, Calendar, Clock, Users, Trash2, Edit } from "lucide-react";

const daysOfWeek = [
    { short: "Su", full: "Sunday" },
    { short: "Mo", full: "Monday" },
    { short: "Tu", full: "Tuesday" },
    { short: "We", full: "Wednesday" },
    { short: "Th", full: "Thursday" },
    { short: "Fr", full: "Friday" },
    { short: "Sa", full: "Saturday" },
];
const shortToDayNumber = {
    'Su': 0,
    'Mo': 1,
    'Tu': 2,
    'We': 3,
    'Th': 4,
    'Fr': 5,
    'Sa': 6,
};
const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};



const ShiftManagement = () => {
    const [shifts, setShifts] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [showCreateShiftSidebar, setShowCreateShiftSidebar] = useState(false);
    const [showAssignShiftSidebar, setShowAssignShiftSidebar] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [newShift, setNewShift] = useState({
        name: "",
        startTime: "",
        endTime: "",
        daysApplicable: ['Mo', 'We', 'Fr']
    });

    const [assignDetails, setAssignDetails] = useState({
        employeeCode: "",
        shiftId: "",
        date: "",
    });

    // Fixed API base URL configuration
    const API_BASE_URL =
        import.meta.env.MODE === 'development'
            ? import.meta.env.VITE_API_URL_LOCAL
            : import.meta.env.VITE_API_URL_PROD;

    const [timeoutIds, setTimeoutIds] = useState([]);

    useEffect(() => {
        fetchShifts();
        fetchEmployees();

        return () => {
            timeoutIds.forEach(id => clearTimeout(id));
        };
    }, []);

    const addTimeout = (callback, delay) => {
        const id = setTimeout(() => {
            callback();
            setTimeoutIds(prev => prev.filter(timeoutId => timeoutId !== id));
        }, delay);
        setTimeoutIds(prev => [...prev, id]);
        return id;
    };

    // Fixed fetchShifts with better error handling
    const fetchShifts = async () => {
        try {
            setIsLoading(true);
            setError("");

            const response = await fetch(`${API_BASE_URL}/api/shifts`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 404) {
                    setShifts([]);
                    return;
                }
                throw new Error(`Failed to fetch shifts: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            // Ensure data is properly structured
            if (data && Array.isArray(data)) {
                setShifts(data);
            } else if (data && data.data && Array.isArray(data.data)) {
                setShifts(data.data);
            } else if (data && data.shifts && Array.isArray(data.shifts)) {
                setShifts(data.shifts);
            } else {
                setShifts([]);
            }
        } catch (err) {
            console.error('Fetch shifts error:', err);
            setError(`Failed to load shifts: ${err.message}`);
            setShifts([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Fixed fetchEmployees with better error handling
    const fetchEmployees = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/employees`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 404) {
                    setEmployees([]);
                    return;
                }
                throw new Error(`Failed to fetch employees: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            // Handle different response structures
            if (data && Array.isArray(data)) {
                setEmployees(data);
            } else if (data && data.data && Array.isArray(data.data)) {
                setEmployees(data.data);
            } else if (data && data.employees && Array.isArray(data.employees)) {
                setEmployees(data.employees);
            } else {
                setEmployees([]);
            }
        } catch (err) {
            console.error('Fetch employees error:', err);
            setError(`Failed to load employees: ${err.message}`);
            setEmployees([]);
        }
    };

    const toggleDay = (day) => {
        setNewShift((prev) => {
            if (prev.daysApplicable.includes(day)) {
                return {
                    ...prev,
                    daysApplicable: prev.daysApplicable.filter((d) => d !== day),
                };
            } else {
                return { ...prev, daysApplicable: [...prev.daysApplicable, day] };
            }
        });
    };

    const validateShiftForm = () => {
        setError("");

        if (!newShift.name.trim()) {
            setError("Shift name is required");
            return false;
        }
        if (!newShift.startTime) {
            setError("Start time is required");
            return false;
        }
        if (!newShift.endTime) {
            setError("End time is required");
            return false;
        }
        if (newShift.daysApplicable.length === 0) {
            setError("Please select at least one working day");
            return false;
        }

        // Proper time comparison
        const startTime = new Date(`2000-01-01T${newShift.startTime}:00`);
        const endTime = new Date(`2000-01-01T${newShift.endTime}:00`);

        if (startTime >= endTime) {
            setError("End time must be after start time");
            return false;
        }

        // Check for duplicate shift names
        const existingShift = shifts.find(shift =>
            shift.name && shift.name.toLowerCase() === newShift.name.toLowerCase().trim()
        );
        if (existingShift) {
            setError("Shift name already exists");
            return false;
        }

        return true;
    };

    // Fixed handleCreateShift with better error handling
    const handleCreateShift = async () => {
        if (!validateShiftForm()) {
            return;
        }

        setIsLoading(true);
        setError("");
        setSuccess("");

        try {
            const shiftData = {
                name: newShift.name.trim(),
                startTime: newShift.startTime,
                endTime: newShift.endTime,
                daysApplicable: newShift.daysApplicable,
                createdAt: new Date().toISOString(),
                assignedCount: 0
            };

            const response = await fetch(`${API_BASE_URL}/api/shifts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(shiftData)
            });

            let responseData;
            try {
                responseData = await response.json();
            } catch (error) {
                throw new Error('Invalid response from server', error);
            }

            if (!response.ok) {
                throw new Error(responseData.message || responseData.error || `Server error: ${response.status}`);
            }

            // Handle different response structures
            const newShiftData = responseData.data || responseData.shift || responseData;

            if (newShiftData && (newShiftData._id || newShiftData.id)) {
                setShifts(prev => [...prev, newShiftData]);
                setSuccess("Shift created successfully!");

                // Reset form
                setNewShift({
                    name: "",
                    startTime: "",
                    endTime: "",
                    daysApplicable: [],
                });

                // Close sidebar after success
                addTimeout(() => {
                    setShowCreateShiftSidebar(false);
                    setSuccess("");
                }, 1500);
            } else {
                throw new Error('Invalid response structure from server');
            }

        } catch (err) {
            console.error('Create shift error:', err);
            setError(err.message || "Failed to create shift. Please check your connection and try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const validateAssignForm = () => {
        setError("");

        if (!assignDetails.employeeCode) {
            setError("Please select an employee");
            return false;
        }
        if (!assignDetails.shiftId) {
            setError("Please select a shift");
            return false;
        }
        if (!assignDetails.date) {
            setError("Please select a date");
            return false;
        }

        // Check if date is not in the past
        const selectedDate = new Date(assignDetails.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            setError("Cannot assign shift to a past date");
            return false;
        }

        return true;
    };

    // Fixed handleAssignShift with better error handling
    const handleAssignShift = async () => {
        if (!validateAssignForm()) {
            return;
        }

        setIsLoading(true);
        setError("");
        setSuccess("");

        try {
            const assignmentData = {
                employeeId: assignDetails.employeeCode,
                shiftId: assignDetails.shiftId,
                date: assignDetails.date,
                createdAt: new Date().toISOString()
            };
            console.log("Sending assignmentData:", assignmentData);

            const response = await fetch(`${API_BASE_URL}/api/shifts/assign-shift`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(assignmentData)
            });

            let responseData;
            try {
                responseData = await response.json();
            } catch (error) {
                throw new Error('Invalid response from server', error);
            }

            if (!response.ok) {
                throw new Error(responseData.message || responseData.error || `Server error: ${response.status}`);
            }

            // Update assigned count for the shift
            setShifts(prev =>
                prev.map(shift =>
                    (shift._id || shift.id) === assignDetails.shiftId
                        ? { ...shift, assignedCount: (shift.assignedCount || 0) + 1 }
                        : shift
                )
            );

            setSuccess("Shift assigned successfully!");

            // Reset form
            setAssignDetails({ employeeCode: "", shiftId: "", date: "" });

            // Close sidebar after success
            addTimeout(() => {
                setShowAssignShiftSidebar(false);
                setSuccess("");
            }, 1500);

        } catch (err) {
            console.error('Assign shift error:', err);
            setError(err.message || "Failed to assign shift. Please check your connection and try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const getDayColor = (isActive) => {
        if (!isActive) return 'bg-gray-200 text-gray-500';
        return 'bg-blue-500 text-white';
    };

    const handleDeleteShift = async (shiftId, shiftName) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete "${shiftName}" shift?`);
        if (!confirmDelete) return;

        try {
            setIsLoading(true);
            setError("");
            setSuccess("");

            const response = await fetch(`${API_BASE_URL}/api/shifts/${shiftId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                let errorData = {};
                try {
                    errorData = await response.json();
                } catch {
                    throw new Error(`Server error: ${response.status}`);
                }
                throw new Error(errorData.message || 'Failed to delete shift');
            }

            setShifts(prev => prev.filter(shift => (shift._id || shift.id) !== shiftId));
            setSuccess("Shift deleted successfully!");
            addTimeout(() => setSuccess(""), 3000);

        } catch (err) {
            console.error('Delete shift error:', err);
            setError(err.message || "Failed to delete shift. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };


    const clearMessages = () => {
        setError("");
        setSuccess("");
    };

    const resetForm = () => {
        setNewShift({
            name: "",
            startTime: "",
            endTime: "",
            daysApplicable: [],
        });
        setAssignDetails({ employeeCode: "", shiftId: "", date: "" });
        clearMessages();
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Available Shifts ({shifts.length})
                    </h1>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => {
                            resetForm();
                            setShowAssignShiftSidebar(true);
                        }}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                        disabled={isLoading}
                    >
                        Assign Shift
                    </button>
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        disabled={isLoading}
                    >
                        Set Working Hours
                    </button>
                    <button
                        onClick={() => {
                            resetForm();
                            setShowCreateShiftSidebar(true);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                        disabled={isLoading}
                    >
                        <Plus size={18} />
                        Create Shift
                    </button>
                </div>
            </div>

            {/* Success Message */}
            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
                    <span>{success}</span>
                    <button onClick={clearMessages} className="text-green-700 hover:text-green-900">
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
                    <span>{error}</span>
                    <button onClick={clearMessages} className="text-red-700 hover:text-red-900">
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* Loading Indicator */}
            {isLoading && !showCreateShiftSidebar && !showAssignShiftSidebar && (
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">Loading...</span>
                </div>
            )}

            {/* Shifts Table */}
            <div className="bg-white rounded-lg shadow-sm border">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="text-left p-4 font-medium text-gray-700">Shift Name</th>
                            <th className="text-left p-4 font-medium text-gray-700">Shift Days</th>
                            <th className="text-left p-4 font-medium text-gray-700">Assigned Employees</th>
                            <th className="text-left p-4 font-medium text-gray-700">Created On</th>
                            <th className="text-left p-4 font-medium text-gray-700">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shifts.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center p-8 text-gray-500">
                                    {isLoading ? "Loading shifts..." : "No shifts found"}
                                    {!isLoading && shifts.length === 0 && (
                                        <div className="mt-2">
                                            <button
                                                onClick={() => {
                                                    resetForm();
                                                    setShowCreateShiftSidebar(true);
                                                }}
                                                className="text-blue-600 hover:text-blue-700 underline"
                                            >
                                                Create your first shift
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ) : (
                            shifts.map((shift) => (
                                <tr key={shift._id || shift.id} className="border-b hover:bg-gray-50">
                                    <td className="p-4">
                                        <div className="font-medium text-gray-900">{shift.name}</div>
                                        <div className="text-sm text-gray-500">
                                            {shift.startTime} - {shift.endTime}
                                        </div>
                                        {shift.isDefault && (
                                            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-1">
                                                Default
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-1">
                                            {daysOfWeek.map((day) => {
                                                const isActive = shift.daysApplicable?.includes(shortToDayNumber[day.short]);
                                                return (
                                                    <div
                                                        key={day.short}
                                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${getDayColor(isActive)}`}
                                                        title={day.full}
                                                    >
                                                        {day.short}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-gray-700">{shift.assignedCount || 0}</span>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-gray-500">
                                            {shift.createdAt ? formatDate(shift.createdAt) : '-'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <button
                                                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                                title="View Schedule"
                                            >
                                                <Calendar size={16} />
                                            </button>
                                            <button
                                                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                                title="View Employees"
                                            >
                                                <Users size={16} />
                                            </button>
                                            {!shift.isDefault && (
                                                <button
                                                    className="p-2 text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
                                                    onClick={() => handleDeleteShift(shift._id || shift.id, shift.name)}
                                                    title="Delete Shift"
                                                    disabled={isLoading}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Create Shift Sidebar */}
            {showCreateShiftSidebar && (
                <div className="fixed inset-0 z-50 flex">
                    <div
                        className="flex-1 bg-black bg-opacity-50"
                        onClick={() => {
                            if (!isLoading) {
                                setShowCreateShiftSidebar(false);
                                resetForm();
                            }
                        }}
                    ></div>
                    <div className=" w-96 bg-white h-full shadow-xl overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Create New Shift</h2>
                                <button
                                    onClick={() => {
                                        if (!isLoading) {
                                            setShowCreateShiftSidebar(false);
                                            resetForm();
                                        }
                                    }}
                                    className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                                    disabled={isLoading}
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Error Message in Sidebar */}
                            {error && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-4 text-sm flex justify-between items-center">
                                    <span>{error}</span>
                                    <button onClick={clearMessages} className="text-red-700 hover:text-red-900">
                                        <X size={14} />
                                    </button>
                                </div>
                            )}

                            {/* Success Message in Sidebar */}
                            {success && (
                                <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded mb-4 text-sm">
                                    {success}
                                </div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Shift Name *
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                        placeholder="Enter shift name"
                                        value={newShift.name}
                                        onChange={(e) => setNewShift({ ...newShift, name: e.target.value })}
                                        disabled={isLoading}
                                        maxLength={50}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Start Time *
                                        </label>
                                        <input
                                            type="time"
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                            value={newShift.startTime}
                                            onChange={(e) => setNewShift({ ...newShift, startTime: e.target.value })}
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            End Time *
                                        </label>
                                        <input
                                            type="time"
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                            value={newShift.endTime}
                                            onChange={(e) => setNewShift({ ...newShift, endTime: e.target.value })}
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Working Days * (Selected: {newShift.daysApplicable.length})
                                    </label>
                                    <div className="flex gap-2 flex-wrap">
                                        {daysOfWeek.map((day) => {
                                            const isSelected = newShift.daysApplicable.includes(day.short);
                                            return (
                                                <button
                                                    key={day.short}
                                                    type="button"
                                                    onClick={() => !isLoading && toggleDay(day.short)}
                                                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors disabled:opacity-50 ${isSelected
                                                        ? "bg-blue-600 text-white"
                                                        : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                                                        }`}
                                                    title={day.full}
                                                    disabled={isLoading}
                                                >
                                                    {day.short}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <button
                                        onClick={handleCreateShift}
                                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                Creating...
                                            </>
                                        ) : (
                                            <>
                                                <Plus size={16} />
                                                Create Shift
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Assign Shift Sidebar */}
            {showAssignShiftSidebar && (
                <div className="fixed inset-0 z-50 flex">
                    <div
                        className="flex-1 bg-black bg-opacity-50"
                        onClick={() => {
                            if (!isLoading) {
                                setShowAssignShiftSidebar(false);
                                resetForm();
                            }
                        }}
                    ></div>
                    <div className="w-96 bg-white h-full shadow-xl overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Assign Shift</h2>
                                <button
                                    onClick={() => {
                                        if (!isLoading) {
                                            setShowAssignShiftSidebar(false);
                                            resetForm();
                                        }
                                    }}
                                    className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                                    disabled={isLoading}
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Error Message in Sidebar */}
                            {error && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-4 text-sm flex justify-between items-center">
                                    <span>{error}</span>
                                    <button onClick={clearMessages} className="text-red-700 hover:text-red-900">
                                        <X size={14} />
                                    </button>
                                </div>
                            )}

                            {/* Success Message in Sidebar */}
                            {success && (
                                <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded mb-4 text-sm">
                                    {success}
                                </div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Select Employee *
                                    </label>
                                    <select
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                        value={assignDetails.employeeCode}
                                        onChange={(e) => setAssignDetails({ ...assignDetails, employeeCode: e.target.value })}
                                        disabled={isLoading}
                                    >
                                        <option value="">Select an employee</option>
                                        {employees.map((employee) => (
                                            <option key={employee._id || employee.id} value={employee._id || employee.id}>
                                                {employee.name} ({employee.employeeCode || employee.code})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Select Shift *
                                    </label>
                                    <select
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                        value={assignDetails.shiftId}
                                        onChange={(e) => setAssignDetails({ ...assignDetails, shiftId: e.target.value })}
                                        disabled={isLoading}
                                    >
                                        <option value="">Select a shift</option>
                                        {shifts.map((shift) => (
                                            <option key={shift._id || shift.id} value={shift._id || shift.id}>
                                                {shift.name} ({shift.startTime} - {shift.endTime})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Select Date *
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                        value={assignDetails.date}
                                        onChange={(e) => setAssignDetails({ ...assignDetails, date: e.target.value })}
                                        disabled={isLoading}
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>

                                <div className="pt-6">
                                    <button
                                        onClick={handleAssignShift}
                                        className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                Assigning...
                                            </>
                                        ) : (
                                            <>
                                                <Clock size={16} />
                                                Assign Shift
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShiftManagement;