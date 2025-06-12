import React, { useEffect, useState } from "react";
import { X, Plus, Calendar, Clock, Users, Trash2 } from "lucide-react";

const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
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
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);


    // Updated newShift state structure
    const [newShift, setNewShift] = useState({
        name: '',
        weekOffEnabled: false,
        occasionalWorkingEnabled: false,
        occasionalWorkingDays: 1,
        schedule: {
            Sunday: {
                isActive: false,
                isWeekOff: false,
                fromHour: 9,
                fromMinute: '00',
                fromPeriod: 'AM',
                toHour: 6,
                toMinute: '00',
                toPeriod: 'PM'
            },
            Monday: {
                isActive: true,
                isWeekOff: false,
                fromHour: 9,
                fromMinute: '00',
                fromPeriod: 'AM',
                toHour: 6,
                toMinute: '00',
                toPeriod: 'PM'
            },
            Tuesday: {
                isActive: true,
                isWeekOff: false,
                fromHour: 9,
                fromMinute: '00',
                fromPeriod: 'AM',
                toHour: 6,
                toMinute: '00',
                toPeriod: 'PM'
            },
            Wednesday: {
                isActive: true,
                isWeekOff: false,
                fromHour: 9,
                fromMinute: '00',
                fromPeriod: 'AM',
                toHour: 6,
                toMinute: '00',
                toPeriod: 'PM'
            },
            Thursday: {
                isActive: true,
                isWeekOff: false,
                fromHour: 9,
                fromMinute: '00',
                fromPeriod: 'AM',
                toHour: 6,
                toMinute: '00',
                toPeriod: 'PM'
            },
            Friday: {
                isActive: true,
                isWeekOff: false,
                fromHour: 9,
                fromMinute: '00',
                fromPeriod: 'AM',
                toHour: 6,
                toMinute: '00',
                toPeriod: 'PM'
            },
            Saturday: {
                isActive: false,
                isWeekOff: false,
                fromHour: 9,
                fromMinute: '00',
                fromPeriod: 'AM',
                toHour: 6,
                toMinute: '00',
                toPeriod: 'PM'
            }
        }
    });

    // Days configuration
    const daysOfWeekFull = [
        { full: 'Monday', short: 'Mo' },
        { full: 'Tuesday', short: 'Tu' },
        { full: 'Wednesday', short: 'We' },
        { full: 'Thursday', short: 'Th' },
        { full: 'Friday', short: 'Fr' },
        { full: 'Saturday', short: 'Sa' },
        { full: 'Sunday', short: 'Su' }
    ];


    // Helper function to calculate daily hours
    const calculateDailyHours = (schedule) => {
        if (!schedule.isActive) return 0;

        const fromHour = parseInt(schedule.fromHour);
        const fromMinute = parseInt(schedule.fromMinute);
        const fromPeriod = schedule.fromPeriod;
        const toHour = parseInt(schedule.toHour);
        const toMinute = parseInt(schedule.toMinute);
        const toPeriod = schedule.toPeriod;

        // Convert to 24-hour format
        let fromTime24 = fromHour;
        if (fromPeriod === 'PM' && fromHour !== 12) fromTime24 += 12;
        if (fromPeriod === 'AM' && fromHour === 12) fromTime24 = 0;

        let toTime24 = toHour;
        if (toPeriod === 'PM' && toHour !== 12) toTime24 += 12;
        if (toPeriod === 'AM' && toHour === 12) toTime24 = 0;

        // Calculate total minutes
        const fromTotalMinutes = fromTime24 * 60 + fromMinute;
        let toTotalMinutes = toTime24 * 60 + toMinute;

        // Handle overnight shifts
        if (toTotalMinutes <= fromTotalMinutes) {
            toTotalMinutes += 24 * 60; // Add 24 hours
        }

        const diffMinutes = toTotalMinutes - fromTotalMinutes;
        const hours = diffMinutes / 60;

        return hours.toFixed(1);
    };

    // Helper function to calculate total weekly hours
    const calculateTotalWeeklyHours = () => {
        return Object.values(newShift.schedule)
            .filter(schedule => schedule.isActive)
            .reduce((total, schedule) => {
                return total + parseFloat(calculateDailyHours(schedule));
            }, 0)
            .toFixed(1);
    };


    // Handler for time changes
    const handleTimeChange = (day, field, value) => {
        setNewShift(prev => ({
            ...prev,
            schedule: {
                ...prev.schedule,
                [day]: {
                    ...prev.schedule[day],
                    [field]: value
                }
            }
        }));
    };
    const getOrdinalSuffix = (num) => {
        const j = num % 10;
        const k = num % 100;
        if (j == 1 && k != 11) return "st";
        if (j == 2 && k != 12) return "nd";
        if (j == 3 && k != 13) return "rd";
        return "th";
    };

    // Handler for day toggle
    const handleDayToggle = (day, checked) => {
        setNewShift(prev => ({
            ...prev,
            schedule: {
                ...prev.schedule,
                [day]: {
                    ...prev.schedule[day],
                    isActive: checked,
                    // If making it active, ensure it's not week off
                    isWeekOff: checked ? false : prev.schedule[day].isWeekOff,
                    // Reset occasional working settings when making it active
                    occasionalWorkingEnabled: checked ? false : prev.schedule[day].occasionalWorkingEnabled,
                    occasionalWorkingWeeks: checked ? [] : prev.schedule[day].occasionalWorkingWeeks
                }
            }
        }));
    };
    const handleOccasionalWeekToggle = (day, week, checked) => {
        setNewShift(prev => {
            const currentWeeks = prev.schedule[day].occasionalWorkingWeeks || [];
            const updatedWeeks = checked
                ? [...currentWeeks, week].sort((a, b) => a - b) // Add week and sort
                : currentWeeks.filter(w => w !== week); // Remove week

            return {
                ...prev,
                schedule: {
                    ...prev.schedule,
                    [day]: {
                        ...prev.schedule[day],
                        occasionalWorkingWeeks: updatedWeeks
                    }
                }
            };
        });
    };
    const handleOccasionalTimeChange = (day, field, value) => {
        setNewShift(prev => ({
            ...prev,
            schedule: {
                ...prev.schedule,
                [day]: {
                    ...prev.schedule[day],
                    [field]: value
                }
            }
        }));
    };

    // Complete handleOccasionalWorkingToggle function
    const handleOccasionalWorkingToggle = (day, checked) => {
        setNewShift(prev => ({
            ...prev,
            schedule: {
                ...prev.schedule,
                [day]: {
                    ...prev.schedule[day],
                    occasionalWorkingEnabled: checked,
                    // Reset selected weeks when disabling
                    occasionalWorkingWeeks: checked ? (prev.schedule[day].occasionalWorkingWeeks || []) : [],
                    // Set default times when enabling
                    occasionalFromHour: checked ? (prev.schedule[day].occasionalFromHour || 9) : null,
                    occasionalFromMinute: checked ? (prev.schedule[day].occasionalFromMinute || '00') : null,
                    occasionalFromPeriod: checked ? (prev.schedule[day].occasionalFromPeriod || 'AM') : null,
                    occasionalToHour: checked ? (prev.schedule[day].occasionalToHour || 6) : null,
                    occasionalToMinute: checked ? (prev.schedule[day].occasionalToMinute || '00') : null,
                    occasionalToPeriod: checked ? (prev.schedule[day].occasionalToPeriod || 'PM') : null
                }
            }
        }));
    };

    // Handler for week off toggle
    const handleWeekOffToggle = (day, checked) => {
        setNewShift(prev => ({
            ...prev,
            schedule: {
                ...prev.schedule,
                [day]: {
                    ...prev.schedule[day],
                    isWeekOff: checked,
                    isActive: checked ? false : prev.schedule[day].isActive,
                    // Reset occasional working settings when week off is disabled
                    occasionalWorkingEnabled: checked ? false : false,
                    occasionalWorkingWeeks: checked ? [] : [],
                    occasionalFromHour: checked ? 9 : null,
                    occasionalFromMinute: checked ? '00' : null,
                    occasionalFromPeriod: checked ? 'AM' : null,
                    occasionalToHour: checked ? 6 : null,
                    occasionalToMinute: checked ? '00' : null,
                    occasionalToPeriod: checked ? 'PM' : null
                }
            }
        }));
    };

    // Reset form function
    const resetForm = () => {
        setNewShift({
            name: '',
            schedule: {
                Monday: {
                    isActive: false,
                    isWeekOff: false,
                    fromHour: 9,
                    fromMinute: '00',
                    fromPeriod: 'AM',
                    toHour: 6,
                    toMinute: '00',
                    toPeriod: 'PM',
                    occasionalWorkingEnabled: false,
                    occasionalWorkingWeeks: [],
                    occasionalFromHour: 9,
                    occasionalFromMinute: '00',
                    occasionalFromPeriod: 'AM',
                    occasionalToHour: 6,
                    occasionalToMinute: '00',
                    occasionalToPeriod: 'PM'
                },
                Tuesday: {
                    isActive: false,
                    isWeekOff: false,
                    fromHour: 9,
                    fromMinute: '00',
                    fromPeriod: 'AM',
                    toHour: 6,
                    toMinute: '00',
                    toPeriod: 'PM',
                    occasionalWorkingEnabled: false,
                    occasionalWorkingWeeks: [],
                    occasionalFromHour: 9,
                    occasionalFromMinute: '00',
                    occasionalFromPeriod: 'AM',
                    occasionalToHour: 6,
                    occasionalToMinute: '00',
                    occasionalToPeriod: 'PM'
                },
                Wednesday: {
                    isActive: false,
                    isWeekOff: false,
                    fromHour: 9,
                    fromMinute: '00',
                    fromPeriod: 'AM',
                    toHour: 6,
                    toMinute: '00',
                    toPeriod: 'PM',
                    occasionalWorkingEnabled: false,
                    occasionalWorkingWeeks: [],
                    occasionalFromHour: 9,
                    occasionalFromMinute: '00',
                    occasionalFromPeriod: 'AM',
                    occasionalToHour: 6,
                    occasionalToMinute: '00',
                    occasionalToPeriod: 'PM'
                },
                Thursday: {
                    isActive: false,
                    isWeekOff: false,
                    fromHour: 9,
                    fromMinute: '00',
                    fromPeriod: 'AM',
                    toHour: 6,
                    toMinute: '00',
                    toPeriod: 'PM',
                    occasionalWorkingEnabled: false,
                    occasionalWorkingWeeks: [],
                    occasionalFromHour: 9,
                    occasionalFromMinute: '00',
                    occasionalFromPeriod: 'AM',
                    occasionalToHour: 6,
                    occasionalToMinute: '00',
                    occasionalToPeriod: 'PM'
                },
                Friday: {
                    isActive: false,
                    isWeekOff: false,
                    fromHour: 9,
                    fromMinute: '00',
                    fromPeriod: 'AM',
                    toHour: 6,
                    toMinute: '00',
                    toPeriod: 'PM',
                    occasionalWorkingEnabled: false,
                    occasionalWorkingWeeks: [],
                    occasionalFromHour: 9,
                    occasionalFromMinute: '00',
                    occasionalFromPeriod: 'AM',
                    occasionalToHour: 6,
                    occasionalToMinute: '00',
                    occasionalToPeriod: 'PM'
                },
                Saturday: {
                    isActive: false,
                    isWeekOff: false,
                    fromHour: 9,
                    fromMinute: '00',
                    fromPeriod: 'AM',
                    toHour: 6,
                    toMinute: '00',
                    toPeriod: 'PM',
                    occasionalWorkingEnabled: false,
                    occasionalWorkingWeeks: [],
                    occasionalFromHour: 9,
                    occasionalFromMinute: '00',
                    occasionalFromPeriod: 'AM',
                    occasionalToHour: 6,
                    occasionalToMinute: '00',
                    occasionalToPeriod: 'PM'
                },
                Sunday: {
                    isActive: false,
                    isWeekOff: false,
                    fromHour: 9,
                    fromMinute: '00',
                    fromPeriod: 'AM',
                    toHour: 6,
                    toMinute: '00',
                    toPeriod: 'PM',
                    occasionalWorkingEnabled: false,
                    occasionalWorkingWeeks: [],
                    occasionalFromHour: 9,
                    occasionalFromMinute: '00',
                    occasionalFromPeriod: 'AM',
                    occasionalToHour: 6,
                    occasionalToMinute: '00',
                    occasionalToPeriod: 'PM'
                }
            }
        });
        setError('');
        setSuccess('');
    };


    const [assignDetails, setAssignDetails] = useState({
        employeeCode: "",
        shiftId: "",
        date: "",
    });

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
            setError(`Failed to load shifts: ${err.message}`);
            setShifts([]);
        } finally {
            setIsLoading(false);
        }
    };

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

    const handleCreateShift = async () => {
        // Clear previous messages
        setError('');
        setSuccess('');

        // Validate shift name
        if (!newShift.name.trim()) {
            setError('Please enter a shift name');
            return;
        }

        // Check for active working days
        const activeWorkingDays = Object.values(newShift.schedule).filter(s => s.isActive);

        if (activeWorkingDays.length === 0) {
            setError('Please set working hours for at least one day');
            return;
        }

        // Validate that active days have proper time configuration
        const invalidDays = activeWorkingDays.filter(schedule => {
            const fromHour = parseInt(schedule.fromHour);
            const toHour = parseInt(schedule.toHour);
            const fromPeriod = schedule.fromPeriod;
            const toPeriod = schedule.toPeriod;

            // Check if times are valid
            if (!fromHour || !toHour || !fromPeriod || !toPeriod) {
                return true;
            }

            // Check if the time range makes sense
            const dailyHours = parseFloat(calculateDailyHours(schedule));
            return dailyHours <= 0 || dailyHours > 24;
        });

        if (invalidDays.length > 0) {
            setError('Please set valid working hours for all active days');
            return;
        }

        setIsLoading(true);

        try {
            // Prepare data for backend
            const shiftData = {
                name: newShift.name.trim(),
                schedule: newShift.schedule,
                totalWeeklyHours: parseFloat(calculateTotalWeeklyHours()),
                activeWorkingDays: activeWorkingDays.length
            };

            const API_BASE_URL =
                import.meta.env.MODE === 'development'
                    ? import.meta.env.VITE_API_URL_LOCAL
                    : import.meta.env.VITE_API_URL_PROD;
            // Your API call here
            const response = await fetch(`${API_BASE_URL}/api/shifts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(shiftData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create shift');
            }

            await response.json();
            setSuccess('Shift created successfully!');

            // Close sidebar after 2 seconds
            setTimeout(() => {
                setShowCreateShiftSidebar(false);
                resetForm();
            }, 2000);

        } catch (error) {
            console.error('Error creating shift:', error);
            setError(error.message || 'Failed to create shift. Please try again.');
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

            setShifts(prev =>
                prev.map(shift =>
                    (shift._id || shift.id) === assignDetails.shiftId
                        ? { ...shift, assignedCount: (shift.assignedCount || 0) + 1 }
                        : shift
                )
            );

            setSuccess("Shift assigned successfully!");
            setAssignDetails({ employeeCode: "", shiftId: "", date: "" });

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
        if (!shiftId) {
            setError("Invalid shift ID");
            return;
        }

        const confirmDelete = window.confirm(`Are you sure you want to delete "${shiftName}" shift?`);
        if (!confirmDelete) return;

        try {
            setIsLoading(true);
            setError("");
            setSuccess("");

            console.log('Deleting shift with ID:', shiftId); // Debug log

            const response = await fetch(`${API_BASE_URL}/api/shifts/${shiftId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });

            console.log('Delete response status:', response.status); // Debug log

            if (!response.ok) {
                let errorData = {};
                try {
                    errorData = await response.json();
                    console.log('Delete error response:', errorData); // Debug log
                } catch (parseError) {
                    console.error('Error parsing delete response:', parseError);
                    throw new Error(`Server error: ${response.status} ${response.statusText}`);
                }
                throw new Error(errorData.message || errorData.error || 'Failed to delete shift');
            }

            // Try to parse response, but don't fail if empty
            try {
                const text = await response.text();
                if (text) {
                    JSON.parse(text);
                }
            } catch (parseError) {
                console.log('No JSON response body (this is okay for DELETE)', parseError);
            }

            // Remove shift from local state
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

    const getActiveDays = (schedule) => {
        if (!schedule || typeof schedule !== 'object') return [];

        return Object.keys(schedule).filter(day => {
            const daySchedule = schedule[day];
            return daySchedule && daySchedule.isActive === true;
        });
    };

    const handleViewEmployees = async (shiftId) => {
        try {
            setIsLoading(true);
            setError("");

            const response = await fetch(`${API_BASE_URL}/api/shifts/${shiftId}/employees`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch employees for shift ${shiftId}`);
            }

            const data = await response.json();

            // Assuming `data` is an array of employee objects
            setSelectedEmployees(data); // setSelectedEmployees is a state hook
            setIsEmployeeModalOpen(true); // open a modal or drawer to show data
        } catch (err) {
            console.error("Error fetching employees:", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
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
                                        {shift.isDefault && (
                                            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-1">
                                                Default
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-1">
                                            {daysOfWeekFull.map((day) => {
                                                const activeDays = getActiveDays(shift.schedule);
                                                const isActive = activeDays.includes(day.full);
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
                                    <td className="p-4 font-bold text-blue-600">{shift.assignedCount || 0}</td>
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
                                                onClick={() => handleViewEmployees(shift._id || shift.id)}
                                            >
                                                <Users size={16} />
                                            </button>
                                            {isEmployeeModalOpen && (
                                                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                                    <div className="bg-white p-6 rounded-lg w-96 max-h-[80vh] overflow-y-auto">
                                                        <h2 className="text-xl font-semibold mb-4">Assigned Employees</h2>
                                                        {selectedEmployees.length === 0 ? (
                                                            <p>No employees assigned to this shift.</p>
                                                        ) : (
                                                            <ul className="space-y-2">
                                                                {selectedEmployees.map((emp) => (
                                                                    <li key={emp._id} className="border p-2 rounded">
                                                                        <div className="font-medium">{emp.name}</div>
                                                                        <div className="text-sm text-gray-600">{emp.email}</div>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        )}
                                                        <button
                                                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                                            onClick={() => setIsEmployeeModalOpen(false)}
                                                        >
                                                            Close
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
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
                        className="flex-1 bg-black bg-opacity-50 backdrop-blur-sm"
                        onClick={() => {
                            if (!isLoading) {
                                setShowCreateShiftSidebar(false);
                                resetForm();
                            }
                        }}
                    ></div>
                    <div className="w-[500px] bg-white h-full shadow-2xl overflow-y-auto border-l border-gray-200">
                        {/* Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Create New Shift</h2>
                                    <p className="text-sm text-gray-500 mt-1">Set up a new work shift schedule</p>
                                </div>
                                <button
                                    onClick={() => {
                                        if (!isLoading) {
                                            setShowCreateShiftSidebar(false);
                                            resetForm();
                                        }
                                    }}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
                                    disabled={isLoading}
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            {/* Error Message in Sidebar */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex justify-between items-start">
                                    <div className="flex items-start gap-2">
                                        <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                                            <X size={12} className="text-red-600" />
                                        </div>
                                        <span className="text-sm">{error}</span>
                                    </div>
                                    <button onClick={clearMessages} className="text-red-700 hover:text-red-900">
                                        <X size={16} />
                                    </button>
                                </div>
                            )}

                            {/* Success Message in Sidebar */}
                            {success && (
                                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                                            <div className="w-2 h-2 rounded-full bg-green-600"></div>
                                        </div>
                                        <span className="text-sm font-medium">{success}</span>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-6">
                                {/* Shift Name */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                                        Shift Name
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 transition-all"
                                        placeholder="e.g., Morning Shift, Night Shift"
                                        value={newShift.name}
                                        onChange={(e) => setNewShift({ ...newShift, name: e.target.value })}
                                        disabled={isLoading}
                                        maxLength={50}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">{newShift.name.length}/50 characters</p>
                                </div>

                                {/* Working Hours */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-4">
                                        Working Hours & Week Off Configuration
                                    </label>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="space-y-3">
                                            {Object.entries(newShift.schedule).map(([day, schedule]) => (
                                                <div key={day} className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                                                    <div className="p-4">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${schedule.isActive
                                                                    ? 'bg-blue-500 text-white shadow-md'
                                                                    : schedule.isWeekOff
                                                                        ? 'bg-red-100 text-red-600'
                                                                        : 'bg-gray-100 text-gray-500'
                                                                    }`}>
                                                                    {daysOfWeekFull.find(d => d.full === day)?.short}
                                                                </div>
                                                                <span className="text-sm font-medium text-gray-800 w-20">{day}</span>
                                                            </div>

                                                            <div className="flex items-center gap-4">
                                                                <div className="flex items-center gap-2">
                                                                    <label className="text-xs text-gray-500">Working Day</label>
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={schedule.isActive}
                                                                        onChange={(e) => handleDayToggle(day, e.target.checked)}
                                                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                                                        disabled={isLoading}
                                                                    />
                                                                </div>

                                                                <div className="flex items-center gap-2">
                                                                    <label className="text-xs text-red-600">Week Off</label>
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={schedule.isWeekOff}
                                                                        onChange={(e) => handleWeekOffToggle(day, e.target.checked)}
                                                                        className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                                                                        disabled={isLoading || schedule.isActive}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {schedule.isActive && (
                                                            <div className="space-y-3">
                                                                {/* From Time */}
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-sm font-medium text-gray-600 w-12">From:</span>
                                                                    <select
                                                                        value={schedule.fromHour}
                                                                        onChange={(e) => handleTimeChange(day, 'fromHour', e.target.value)}
                                                                        className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                        disabled={isLoading}
                                                                    >
                                                                        {[...Array(12)].map((_, i) => (
                                                                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                                                                        ))}
                                                                    </select>
                                                                    <span className="text-gray-400">:</span>
                                                                    <select
                                                                        value={schedule.fromMinute}
                                                                        onChange={(e) => handleTimeChange(day, 'fromMinute', e.target.value)}
                                                                        className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                        disabled={isLoading}
                                                                    >
                                                                        <option value="00">00</option>
                                                                        <option value="15">15</option>
                                                                        <option value="30">30</option>
                                                                        <option value="45">45</option>
                                                                    </select>
                                                                    <select
                                                                        value={schedule.fromPeriod}
                                                                        onChange={(e) => handleTimeChange(day, 'fromPeriod', e.target.value)}
                                                                        className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                        disabled={isLoading}
                                                                    >
                                                                        <option value="AM">AM</option>
                                                                        <option value="PM">PM</option>
                                                                    </select>
                                                                </div>

                                                                {/* To Time */}
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-sm font-medium text-gray-600 w-12">To:</span>
                                                                    <select
                                                                        value={schedule.toHour}
                                                                        onChange={(e) => handleTimeChange(day, 'toHour', e.target.value)}
                                                                        className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                        disabled={isLoading}
                                                                    >
                                                                        {[...Array(12)].map((_, i) => (
                                                                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                                                                        ))}
                                                                    </select>
                                                                    <span className="text-gray-400">:</span>
                                                                    <select
                                                                        value={schedule.toMinute}
                                                                        onChange={(e) => handleTimeChange(day, 'toMinute', e.target.value)}
                                                                        className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                        disabled={isLoading}
                                                                    >
                                                                        <option value="00">00</option>
                                                                        <option value="15">15</option>
                                                                        <option value="30">30</option>
                                                                        <option value="45">45</option>
                                                                    </select>
                                                                    <select
                                                                        value={schedule.toPeriod}
                                                                        onChange={(e) => handleTimeChange(day, 'toPeriod', e.target.value)}
                                                                        className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                        disabled={isLoading}
                                                                    >
                                                                        <option value="AM">AM</option>
                                                                        <option value="PM">PM</option>
                                                                    </select>
                                                                </div>

                                                                {/* Daily Hours Display */}
                                                                <div className="bg-blue-50 rounded-md p-2">
                                                                    <span className="text-xs text-blue-800 font-medium">
                                                                        Daily Hours: {calculateDailyHours(schedule)} hours
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Week Off Configuration */}
                                                        {schedule.isWeekOff && (
                                                            <div className="mt-4 space-y-3">
                                                                <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                                                                    <div className="flex items-center gap-2 mb-3">
                                                                        <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                                                                            <div className="w-2 h-2 rounded-full bg-white"></div>
                                                                        </div>
                                                                        <span className="text-sm font-medium text-red-800">
                                                                            {day} is marked as Week Off
                                                                        </span>
                                                                    </div>

                                                                    {/* Occasional Working Option */}
                                                                    <div className="flex items-center gap-3 mb-3">
                                                                        <input
                                                                            type="checkbox"
                                                                            id={`occasional-${day}`}
                                                                            checked={schedule.occasionalWorkingEnabled || false}
                                                                            onChange={(e) => handleOccasionalWorkingToggle(day, e.target.checked)}
                                                                            className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                                                                            disabled={isLoading}
                                                                        />
                                                                        <label htmlFor={`occasional-${day}`} className="text-sm font-medium text-orange-700">
                                                                            Allow Occasional Working on Week Off Days
                                                                        </label>
                                                                    </div>

                                                                    {/* Occasional Working Days Selection */}
                                                                    {schedule.occasionalWorkingEnabled && (
                                                                        <div className="space-y-3">
                                                                            <div className="bg-orange-50 rounded-md p-3 border border-orange-200">
                                                                                <label className="block text-sm font-medium text-orange-800 mb-2">
                                                                                    Select which occurrences of {day} should be working days:
                                                                                </label>
                                                                                <div className="grid grid-cols-5 gap-2">
                                                                                    {[1, 2, 3, 4, 5].map((week) => (
                                                                                        <label key={week} className="flex items-center gap-2 text-sm">
                                                                                            <input
                                                                                                type="checkbox"
                                                                                                checked={schedule.occasionalWorkingWeeks?.includes(week) || false}
                                                                                                onChange={(e) => handleOccasionalWeekToggle(day, week, e.target.checked)}
                                                                                                className="w-3 h-3 text-orange-600 rounded focus:ring-orange-500"
                                                                                                disabled={isLoading}
                                                                                            />
                                                                                            <span className="text-orange-700">{week}{getOrdinalSuffix(week)}</span>
                                                                                        </label>
                                                                                    ))}
                                                                                </div>

                                                                                {/* Selected weeks display */}
                                                                                {schedule.occasionalWorkingWeeks && schedule.occasionalWorkingWeeks.length > 0 && (
                                                                                    <div className="mt-2 p-2 bg-white rounded border border-orange-300">
                                                                                        <span className="text-xs text-orange-800 font-medium">
                                                                                            Working: {schedule.occasionalWorkingWeeks.map(week => `${week}${getOrdinalSuffix(week)}`).join(', ')} {day} of each month
                                                                                        </span>
                                                                                    </div>
                                                                                )}
                                                                            </div>

                                                                            {/* Time Selection for Occasional Working Days */}
                                                                            {schedule.occasionalWorkingWeeks && schedule.occasionalWorkingWeeks.length > 0 && (
                                                                                <div className="bg-blue-50 rounded-md p-3 border border-blue-200">
                                                                                    <label className="block text-sm font-medium text-blue-800 mb-2">
                                                                                        Working hours for occasional {day}s:
                                                                                    </label>

                                                                                    {/* From Time */}
                                                                                    <div className="flex items-center gap-2 mb-2">
                                                                                        <span className="text-sm font-medium text-blue-700 w-12">From:</span>
                                                                                        <select
                                                                                            value={schedule.occasionalFromHour || 9}
                                                                                            onChange={(e) => handleOccasionalTimeChange(day, 'occasionalFromHour', e.target.value)}
                                                                                            className="border border-blue-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                                            disabled={isLoading}
                                                                                        >
                                                                                            {[...Array(12)].map((_, i) => (
                                                                                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                                                                                            ))}
                                                                                        </select>
                                                                                        <span className="text-blue-400">:</span>
                                                                                        <select
                                                                                            value={schedule.occasionalFromMinute || '00'}
                                                                                            onChange={(e) => handleOccasionalTimeChange(day, 'occasionalFromMinute', e.target.value)}
                                                                                            className="border border-blue-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                                            disabled={isLoading}
                                                                                        >
                                                                                            <option value="00">00</option>
                                                                                            <option value="15">15</option>
                                                                                            <option value="30">30</option>
                                                                                            <option value="45">45</option>
                                                                                        </select>
                                                                                        <select
                                                                                            value={schedule.occasionalFromPeriod || 'AM'}
                                                                                            onChange={(e) => handleOccasionalTimeChange(day, 'occasionalFromPeriod', e.target.value)}
                                                                                            className="border border-blue-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                                            disabled={isLoading}
                                                                                        >
                                                                                            <option value="AM">AM</option>
                                                                                            <option value="PM">PM</option>
                                                                                        </select>
                                                                                    </div>

                                                                                    {/* To Time */}
                                                                                    <div className="flex items-center gap-2">
                                                                                        <span className="text-sm font-medium text-blue-700 w-12">To:</span>
                                                                                        <select
                                                                                            value={schedule.occasionalToHour || 6}
                                                                                            onChange={(e) => handleOccasionalTimeChange(day, 'occasionalToHour', e.target.value)}
                                                                                            className="border border-blue-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                                            disabled={isLoading}
                                                                                        >
                                                                                            {[...Array(12)].map((_, i) => (
                                                                                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                                                                                            ))}
                                                                                        </select>
                                                                                        <span className="text-blue-400">:</span>
                                                                                        <select
                                                                                            value={schedule.occasionalToMinute || '00'}
                                                                                            onChange={(e) => handleOccasionalTimeChange(day, 'occasionalToMinute', e.target.value)}
                                                                                            className="border border-blue-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                                            disabled={isLoading}
                                                                                        >
                                                                                            <option value="00">00</option>
                                                                                            <option value="15">15</option>
                                                                                            <option value="30">30</option>
                                                                                            <option value="45">45</option>
                                                                                        </select>
                                                                                        <select
                                                                                            value={schedule.occasionalToPeriod || 'PM'}
                                                                                            onChange={(e) => handleOccasionalTimeChange(day, 'occasionalToPeriod', e.target.value)}
                                                                                            className="border border-blue-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                                            disabled={isLoading}
                                                                                        >
                                                                                            <option value="AM">AM</option>
                                                                                            <option value="PM">PM</option>
                                                                                        </select>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Summary */}
                                        <div className="mt-4 space-y-2">
                                            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                                                        <div className="w-2 h-2 rounded-full bg-white"></div>
                                                    </div>
                                                    <span className="text-sm font-medium text-blue-800">
                                                        Active working days: {Object.values(newShift.schedule).filter(s => s.isActive).length}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                                                        <div className="w-2 h-2 rounded-full bg-white"></div>
                                                    </div>
                                                    <span className="text-sm font-medium text-green-800">
                                                        Total weekly hours: {calculateTotalWeeklyHours()} hours
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                                                        <div className="w-2 h-2 rounded-full bg-white"></div>
                                                    </div>
                                                    <span className="text-sm font-medium text-red-800">
                                                        Week off days: {Object.values(newShift.schedule).filter(s => s.isWeekOff).length}
                                                    </span>
                                                </div>
                                                {Object.entries(newShift.schedule)
                                                    .filter(([schedule]) => schedule.isWeekOff && schedule.occasionalWorkingEnabled)
                                                    .map(([day, schedule]) => (
                                                        <div key={day} className="flex items-center gap-2">
                                                            <div className="w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center">
                                                                <div className="w-2 h-2 rounded-full bg-white"></div>
                                                            </div>
                                                            <span className="text-sm font-medium text-orange-800">
                                                                {day}: {schedule.occasionalWorkingWeeks?.length || 0} occasional working day(s)
                                                            </span>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-6 border-t border-gray-200">
                                <button
                                    onClick={() => {
                                        if (!isLoading) {
                                            setShowCreateShiftSidebar(false);
                                            resetForm();
                                        }
                                    }}
                                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateShift}
                                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Plus size={18} />
                                            Create Shift
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Assign Shift Sidebar */}
            {showAssignShiftSidebar && (
                <div className="fixed inset-0 z-50 flex">
                    <div
                        className="flex-1 bg-black bg-opacity-50 backdrop-blur-sm"
                        onClick={() => {
                            if (!isLoading) {
                                setShowAssignShiftSidebar(false);
                                resetForm();
                            }
                        }}
                    ></div>
                    <div className="w-[400px] bg-white h-full shadow-2xl overflow-y-auto border-l border-gray-200">
                        {/* Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Assign Shift</h2>
                                    <p className="text-sm text-gray-500 mt-1">Assign a shift to an employee</p>
                                </div>
                                <button
                                    onClick={() => {
                                        if (!isLoading) {
                                            setShowAssignShiftSidebar(false);
                                            resetForm();
                                        }
                                    }}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
                                    disabled={isLoading}
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            {/* Error Message in Sidebar */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex justify-between items-start">
                                    <div className="flex items-start gap-2">
                                        <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                                            <X size={12} className="text-red-600" />
                                        </div>
                                        <span className="text-sm">{error}</span>
                                    </div>
                                    <button onClick={clearMessages} className="text-red-700 hover:text-red-900">
                                        <X size={16} />
                                    </button>
                                </div>
                            )}

                            {/* Success Message in Sidebar */}
                            {success && (
                                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                                            <div className="w-2 h-2 rounded-full bg-green-600"></div>
                                        </div>
                                        <span className="text-sm font-medium">{success}</span>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-6">
                                {/* Employee Selection */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                                        Select Employee
                                    </label>
                                    <select
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 transition-all"
                                        value={assignDetails.employeeCode}
                                        onChange={(e) => setAssignDetails({ ...assignDetails, employeeCode: e.target.value })}
                                        disabled={isLoading}
                                    >
                                        <option value="">Choose an employee</option>
                                        {employees.map((employee) => (
                                            <option key={employee._id || employee.id} value={employee._id || employee.id}>
                                                {employee.name || employee.firstName + ' ' + (employee.lastName || '')} - {employee.employeeCode || employee.code}
                                            </option>
                                        ))}
                                    </select>
                                    {employees.length === 0 && (
                                        <p className="text-xs text-gray-500 mt-1">No employees found</p>
                                    )}
                                </div>

                                {/* Shift Selection */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                                        Select Shift
                                    </label>
                                    <select
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 transition-all"
                                        value={assignDetails.shiftId}
                                        onChange={(e) => setAssignDetails({ ...assignDetails, shiftId: e.target.value })}
                                        disabled={isLoading}
                                    >
                                        <option value="">Choose a shift</option>
                                        {shifts.map((shift) => (
                                            <option key={shift._id || shift.id} value={shift._id || shift.id}>
                                                {shift.name} - {getActiveDays(shift.schedule).length} active days
                                            </option>
                                        ))}
                                    </select>
                                    {shifts.length === 0 && (
                                        <p className="text-xs text-gray-500 mt-1">No shifts available</p>
                                    )}
                                </div>

                                {/* Date Selection */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                                        Select Date
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 transition-all"
                                        value={assignDetails.date}
                                        onChange={(e) => setAssignDetails({ ...assignDetails, date: e.target.value })}
                                        disabled={isLoading}
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>

                                {/* Selected Shift Preview */}
                                {assignDetails.shiftId && (
                                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                        <h4 className="text-sm font-semibold text-blue-900 mb-2">Shift Preview</h4>
                                        {(() => {
                                            const selectedShift = shifts.find(s => (s._id || s.id) === assignDetails.shiftId);
                                            if (!selectedShift) return null;

                                            return (
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-blue-700">Shift Name:</span>
                                                        <span className="font-medium text-blue-900">{selectedShift.name}</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-blue-700">Active Days:</span>
                                                        <span className="font-medium text-blue-900">{getActiveDays(selectedShift.schedule).length} days</span>
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-6 border-t border-gray-200">
                                <button
                                    onClick={() => {
                                        if (!isLoading) {
                                            setShowAssignShiftSidebar(false);
                                            resetForm();
                                        }
                                    }}
                                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAssignShift}
                                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Assigning...
                                        </>
                                    ) : (
                                        <>
                                            <Users size={18} />
                                            Assign Shift
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShiftManagement;