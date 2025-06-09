import React, { useEffect, useState } from "react";
import axios from "axios";

const daysOfWeek = [
    { short: "S", full: "Sunday" },
    { short: "M", full: "Monday" },
    { short: "TU", full: "Tuesday" },
    { short: "WED", full: "Wednesday" },
    { short: "TH", full: "Thursday" },
    { short: "F", full: "Friday" },
    { short: "SAT", full: "Saturday" },
];

const ShiftManagement = () => {
    const [shifts, setShifts] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [assignedShifts, setAssignedShifts] = useState([]);
    const [newShift, setNewShift] = useState({
        name: "",
        startTime: "",
        endTime: "",
        daysApplicable: [], // now an array of selected days
    });
    const [assignDetails, setAssignDetails] = useState({
        employeeId: "",
        shiftId: "",
        date: "",
    });
    const [selectedEmployeeId, setSelectedEmployeeId] = useState("");

    useEffect(() => {
        fetchShifts();
        fetchEmployees();
    }, []);

    useEffect(() => {
        if (selectedEmployeeId) {
            fetchAssignedShifts(selectedEmployeeId);
        }
    }, [selectedEmployeeId]);

    const fetchShifts = async () => {
        const { data } = await axios.get("http://localhost:5000/api/shifts");
        setShifts(data);
    };

    const fetchEmployees = async () => {
        const { data } = await axios.get("http://localhost:5000/api/employees");
        setEmployees(data);
    };

    const fetchAssignedShifts = async (employeeId) => {
        const { data } = await axios.get(
            `http://localhost:5000/api/assigned-shifts/${employeeId}`
        );
        setAssignedShifts(data);
    };

    const toggleDay = (day) => {
        setNewShift((prev) => {
            if (prev.daysApplicable.includes(day)) {
                // remove day
                return {
                    ...prev,
                    daysApplicable: prev.daysApplicable.filter((d) => d !== day),
                };
            } else {
                // add day
                return { ...prev, daysApplicable: [...prev.daysApplicable, day] };
            }
        });
    };

    const handleCreateShift = async () => {
        try {
            // Backend should now expect daysApplicable as array or string (adjust accordingly)
            const payload = {
                name: newShift.name,
                startTime: newShift.startTime,
                endTime: newShift.endTime,
                daysApplicable: newShift.daysApplicable,
            };
            await axios.post("http://localhost:5000/api/shifts", payload);
            fetchShifts();
            setNewShift({
                name: "",
                startTime: "",
                endTime: "",
                daysApplicable: [],
            });
        } catch (err) {
            console.error(err);
        }
    };

    const handleAssignShift = async () => {
        try {
            await axios.post("http://localhost:5000/api/assign-shift", assignDetails);
            fetchAssignedShifts(assignDetails.employeeId);
            setAssignDetails({ employeeId: "", shiftId: "", date: "" });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="p-6 space-y-8">
            {/* Create Shift */}
            <div className="border rounded-lg p-4 shadow-md bg-white">
                <h2 className="text-xl font-bold mb-4">Create Shift</h2>
                <div className="grid grid-cols-2 gap-4">
                    <input
                        className="border p-2 rounded"
                        placeholder="Shift Name"
                        value={newShift.name}
                        onChange={(e) => setNewShift({ ...newShift, name: e.target.value })}
                    />
                    <input
                        className="border p-2 rounded"
                        type="time"
                        value={newShift.startTime}
                        onChange={(e) =>
                            setNewShift({ ...newShift, startTime: e.target.value })
                        }
                    />
                    <input
                        className="border p-2 rounded"
                        type="time"
                        value={newShift.endTime}
                        onChange={(e) =>
                            setNewShift({ ...newShift, endTime: e.target.value })
                        }
                    />

                    {/* Days Applicable as toggle buttons */}
                    <div className="col-span-2 flex flex-wrap gap-2 mt-2">
                        {daysOfWeek.map((day) => {
                            const isSelected = newShift.daysApplicable.includes(day.short);
                            return (
                                <button
                                    key={day.short}
                                    type="button"
                                    onClick={() => toggleDay(day.short)}
                                    className={`px-3 py-1 rounded border ${isSelected
                                            ? "bg-blue-600 text-white border-blue-600"
                                            : "bg-white text-gray-700 border-gray-300"
                                        }`}
                                >
                                    {day.short}
                                </button>
                            );
                        })}
                    </div>
                </div>
                <button
                    onClick={handleCreateShift}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Create Shift
                </button>
            </div>

            {/* Assign Shift */}
            <div className="border rounded-lg p-4 shadow-md bg-white">
                <h2 className="text-xl font-bold mb-4">Assign Shift</h2>
                <div className="grid grid-cols-3 gap-4">
                    <select
                        className="border p-2 rounded"
                        value={assignDetails.employeeId}
                        onChange={(e) =>
                            setAssignDetails({ ...assignDetails, employeeId: e.target.value })
                        }
                    >
                        <option value="">Select Employee</option>
                        {employees.map((emp) => (
                            <option key={emp._id} value={emp._id}>
                                {emp.fullName}
                            </option>
                        ))}
                    </select>
                    <select
                        className="border p-2 rounded"
                        value={assignDetails.shiftId}
                        onChange={(e) =>
                            setAssignDetails({ ...assignDetails, shiftId: e.target.value })
                        }
                    >
                        <option value="">Select Shift</option>
                        {shifts.map((shift) => (
                            <option key={shift._id} value={shift._id}>
                                {shift.name}
                            </option>
                        ))}
                    </select>
                    <input
                        className="border p-2 rounded"
                        type="date"
                        value={assignDetails.date}
                        onChange={(e) =>
                            setAssignDetails({ ...assignDetails, date: e.target.value })
                        }
                    />
                </div>
                <button
                    onClick={handleAssignShift}
                    className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    Assign Shift
                </button>
            </div>

            {/* View Assigned Shifts */}
            <div className="border rounded-lg p-4 shadow-md bg-white">
                <h2 className="text-xl font-bold mb-4">View Assigned Shifts</h2>
                <select
                    className="border p-2 rounded mb-4"
                    value={selectedEmployeeId}
                    onChange={(e) => setSelectedEmployeeId(e.target.value)}
                >
                    <option value="">Select Employee</option>
                    {employees.map((emp) => (
                        <option key={emp._id} value={emp._id}>
                            {emp.fullName}
                        </option>
                    ))}
                </select>

                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="border p-2">Date</th>
                            <th className="border p-2">Shift</th>
                            <th className="border p-2">Start</th>
                            <th className="border p-2">End</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assignedShifts.map((shift) => (
                            <tr key={shift._id}>
                                <td className="border p-2">
                                    {new Date(shift.date).toLocaleDateString()}
                                </td>
                                <td className="border p-2">{shift.shift.name}</td>
                                <td className="border p-2">{shift.shift.startTime}</td>
                                <td className="border p-2">{shift.shift.endTime}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ShiftManagement;
