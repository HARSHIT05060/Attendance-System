import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";

dayjs.extend(isoWeek);

// Attendance options with labels and colors
const attendanceOptions = [
  { value: "", label: "Select", className: "text-gray-600" },
  { value: "full-day", label: "Full Day", className: "text-green-800" },
  { value: "half-day", label: "Half Day", className: "text-red-800" },
  { value: "leave", label: "Leave", className: "text-blue-800" },
  { value: "paid-leave", label: "Paid Leave", className: "text-purple-800" },
  { value: "sick-leave", label: "Sick Leave", className: "text-pink-800" },
  { value: "work-from-home", label: "Work From Home", className: "text-yellow-800" },
  { value: "holiday", label: "Holiday", className: "text-teal-800" },
  { value: "business-trip", label: "Business Trip", className: "text-orange-800" },
];

// API base URL depending on environment
const API_BASE_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_API_URL_LOCAL
    : import.meta.env.VITE_API_URL_PROD;

// Helper: check if date is in the future (disable editing)
const isFutureDate = (date) => dayjs(date).isAfter(dayjs(), "day");

// Get week start (Monday) and end (Sunday) from selected date
const getWeekRange = (dateStr) => {
  const date = dayjs(dateStr);
  return {
    startDate: date.startOf("isoWeek").format("YYYY-MM-DD"),
    endDate: date.endOf("isoWeek").format("YYYY-MM-DD"),
  };
};

// Get array of week dates (7 days from Monday to Sunday)
const getWeekDates = (selectedDate) => {
  const { startDate } = getWeekRange(selectedDate);
  return Array.from({ length: 7 }).map((_, i) =>
    dayjs(startDate).add(i, "day").format("YYYY-MM-DD")
  );
};

export default function BulkAttendance() {
  const [employees, setEmployees] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [attendanceData, setAttendanceData] = useState({}); // { employeeId: { date: status } }
  const [originalAttendanceData, setOriginalAttendanceData] = useState({});
  const [isChanged, setIsChanged] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load employees on mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/employees`);
        const empList = Array.isArray(res.data)
          ? res.data
          : res.data.employees || [];
        setEmployees(empList);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  // Load attendance data when selectedDate or employees change
  useEffect(() => {
    if (!employees.length) return;

    const fetchAttendance = async () => {
      const { startDate, endDate } = getWeekRange(selectedDate);
      const newAttendance = {};

      await Promise.all(
        employees.map(async (emp) => {
          try {
            const res = await axios.get(
              `${API_BASE_URL}/api/attendance/employee/${emp.employeeId}/week`,
              { params: { startDate, endDate } }
            );
            // Convert array of records to {date: status} map
            const records = res.data.attendance || [];
            newAttendance[emp.employeeId] = records.reduce((acc, rec) => {
              acc[rec.date] = rec.status;
              return acc;
            }, {});
          } catch (err) {
            console.error(`Failed to fetch attendance for ${emp.employeeId}`, err);
            newAttendance[emp.employeeId] = {};
          }
        })
      );

      setAttendanceData(newAttendance);
      setOriginalAttendanceData(newAttendance);
      setIsChanged(false);
    };

    fetchAttendance();
  }, [selectedDate, employees]);

  // Detect changes (deep compare)
  useEffect(() => {
    setIsChanged(JSON.stringify(attendanceData) !== JSON.stringify(originalAttendanceData));
  }, [attendanceData, originalAttendanceData]);

  // Update attendance on select change
  const handleAttendanceChange = (employeeId, date, value) => {
    if (isFutureDate(date)) return; // don't allow future edits
    setAttendanceData((prev) => ({
      ...prev,
      [employeeId]: {
        ...prev[employeeId],
        [date]: value,
      },
    }));
  };

  // Save changed attendance to backend
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updates = [];

      for (const empId in attendanceData) {
        for (const date in attendanceData[empId]) {
          const newStatus = attendanceData[empId][date];
          const oldStatus = originalAttendanceData[empId]?.[date] || "";
          if (newStatus !== oldStatus) {
            updates.push({ employeeId: empId, date, status: newStatus });
          }
        }
      }

      // Make parallel API calls
      await Promise.all(
        updates.map(({ employeeId, date, status }) =>
          axios.put(`${API_BASE_URL}/api/attendance/update`, {
            employeeId,
            date,
            status,
          })
        )
      );

      setOriginalAttendanceData({ ...attendanceData });
      setIsChanged(false);
      alert("Attendance updated successfully!");
    } catch (error) {
      console.error("Failed to save attendance:", error);
      alert("Failed to update attendance. Try again later.");
    } finally {
      setIsSaving(false);
    }
  };

  // Week navigation by +/- 7 days
  const changeWeek = (delta) => {
    setSelectedDate(dayjs(selectedDate).add(delta * 7, "day").format("YYYY-MM-DD"));
  };

  const weekDates = getWeekDates(selectedDate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Weekly Bulk Attendance</h1>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <button
          onClick={() => changeWeek(-1)}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          aria-label="Previous Week"
        >
          ← Previous Week
        </button>
        <button
          onClick={() => changeWeek(1)}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          aria-label="Next Week"
        >
          Next Week →
        </button>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border p-2 rounded"
          aria-label="Select date to change week"
        />
      </div>

      <div className="overflow-auto max-w-full">
        <table className="table-auto border-collapse border border-gray-300 w-full text-sm">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="border border-gray-300 px-3 py-2 text-left">Employee</th>
              {weekDates.map((date) => (
                <th key={date} className="border border-gray-300 px-3 py-2 text-center">
                  <div>{dayjs(date).format("ddd")}</div>
                  <div className="text-xs text-gray-600">{dayjs(date).format("DD MMM")}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-8 text-gray-500">
                  Loading employees...
                </td>
              </tr>
            )}

            {employees.map((emp) => (
              <tr key={emp.employeeId} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-3 py-2 font-medium">
                  {emp.name || emp.employeeId}
                </td>
                {weekDates.map((date) => {
                  const status = attendanceData[emp.employeeId]?.[date] || "";
                  const disabled = isFutureDate(date);
                  return (
                    <td
                      key={date}
                      className="border border-gray-300 px-1 py-1 text-center"
                    >
                      <select
                        value={status}
                        disabled={disabled}
                        onChange={(e) =>
                          handleAttendanceChange(emp.employeeId, date, e.target.value)
                        }
                        className={`p-1 text-sm rounded border ${
                          disabled
                            ? "bg-gray-100 cursor-not-allowed"
                            : "bg-white cursor-pointer"
                        }`}
                        style={{ minWidth: 110 }}
                        aria-label={`Attendance for ${emp.name || emp.employeeId} on ${date}`}
                      >
                        {attendanceOptions.map(({ value, label, className }) => (
                          <option
                            key={value || "default"}
                            value={value}
                            className={className}
                          >
                            {label}
                          </option>
                        ))}
                      </select>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={handleSave}
          disabled={!isChanged || isSaving}
          className={`px-6 py-2 rounded font-semibold text-white ${
            isChanged && !isSaving
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
