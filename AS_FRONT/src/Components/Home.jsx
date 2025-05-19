import React, { useState, useEffect } from 'react';
import { Calendar, Users, Clock, Coffee, UserCheck, Fingerprint, ChevronDown } from 'lucide-react';

// Mock data for different shifts
const mockEmployeeData = {
  "all": [
    {
      id: 'TG17118',
      name: 'Nitin Jain',
      department: 'Pressure Gauges - Domestic',
      designation: 'Manager',
      firstPunch: '01:47 PM',
      lastPunch: '-',
      workingHours: '05h 59m',
      breakHours: '-',
      status: 'checked-in'
    },
    {
      id: 'TG17119',
      name: 'Aarav Kumar',
      department: 'Software Development',
      designation: 'Developer',
      firstPunch: '09:15 AM',
      lastPunch: '06:30 PM',
      workingHours: '08h 15m',
      breakHours: '01h 00m',
      status: 'checked-in'
    },
    {
      id: 'TG17120',
      name: 'Priya Sharma',
      department: 'HR',
      designation: 'HR Manager',
      firstPunch: '-',
      lastPunch: '-',
      workingHours: '-',
      breakHours: '-',
      status: 'not-in'
    }
  ],
  "default": [
    {
      id: 'TG17118',
      name: 'Nitin Jain',
      department: 'Pressure Gauges - Domestic',
      designation: 'Manager',
      firstPunch: '01:47 PM',
      lastPunch: '-',
      workingHours: '05h 59m',
      breakHours: '-',
      status: 'checked-in'
    }
  ],
  "morning": [
    {
      id: 'TG17119',
      name: 'Aarav Kumar',
      department: 'Software Development',
      designation: 'Developer',
      firstPunch: '09:15 AM',
      lastPunch: '06:30 PM',
      workingHours: '08h 15m',
      breakHours: '01h 00m',
      status: 'checked-in'
    }
  ],
  "night": [
    {
      id: 'TG17120',
      name: 'Priya Sharma',
      department: 'HR',
      designation: 'HR Manager',
      firstPunch: '-',
      lastPunch: '-',
      workingHours: '-',
      breakHours: '-',
      status: 'not-in'
    }
  ]
};

const Home = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedShift, setSelectedShift] = useState('all');
  const [employees, setEmployees] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [stats, setStats] = useState({
    totalEmployees: 478,
    currentlyWorking: 1,
    onBreak: 0,
    timeOff: 0,
    pendingBiometrics: 406,
    checkedIn: 1,
    notInYet: 477,
    timeOffToday: 0
  });

  // Format selected date for display
  const formattedDate = selectedDate.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  // Update employees when shift changes
  useEffect(() => {
    if (mockEmployeeData[selectedShift]) {
      setEmployees(mockEmployeeData[selectedShift]);

      // Update stats based on selected shift and date
      const checkedInCount = mockEmployeeData[selectedShift].filter(emp => emp.status === 'checked-in').length;
      const totalCount = mockEmployeeData[selectedShift].length;

      setStats(prev => ({
        ...prev,
        currentlyWorking: checkedInCount,
        checkedIn: checkedInCount,
        notInYet: totalCount - checkedInCount,
      }));
    } else {
      setEmployees([]);
    }
  }, [selectedShift, selectedDate]);

  // Function to handle date change
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setShowCalendar(false);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        {/* Attendance Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {/* Total Employees */}
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="flex items-start">
              <div className="rounded-full bg-blue-100 p-2 mr-4">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Employees</p>
                <h2 className="text-2xl font-bold">{stats.totalEmployees}</h2>
              </div>
            </div>
          </div>

          {/* Currently Working */}
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="flex items-start">
              <div className="rounded-full bg-green-100 p-2 mr-4">
                <UserCheck className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Currently Working</p>
                <h2 className="text-2xl font-bold">{stats.currentlyWorking}</h2>
              </div>
            </div>
          </div>

          {/* On Break */}
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="flex items-start">
              <div className="rounded-full bg-orange-100 p-2 mr-4">
                <Coffee className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">On Break</p>
                <h2 className="text-2xl font-bold">{stats.onBreak}</h2>
              </div>
            </div>
          </div>

          {/* Time Off */}
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="flex items-start">
              <div className="rounded-full bg-purple-100 p-2 mr-4">
                <Clock className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Time Off</p>
                <h2 className="text-2xl font-bold">{stats.timeOff}</h2>
              </div>
            </div>
          </div>

          {/* Pending Biometrics */}
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="flex items-start">
              <div className="rounded-full bg-red-100 p-2 mr-4">
                <Fingerprint className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending Biometrics</p>
                <h2 className="text-2xl font-bold">{stats.pendingBiometrics}</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Attendance Summary */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">Quick Attendance Summary</h2>
              <div className="relative">
                <button
                  className="border rounded flex items-center p-2"
                  onClick={() => setShowCalendar(!showCalendar)}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{formattedDate}</span>
                  <ChevronDown className="h-4 w-4 ml-2" />
                </button>

                {showCalendar && (
                  <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg z-10 p-2">
                    <div className="p-2 grid grid-cols-7 gap-1">
                      {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day, i) => (
                        <div key={i} className="text-center text-xs font-medium text-gray-500">{day}</div>
                      ))}

                      {Array.from({ length: 31 }).map((_, i) => {
                        const day = i + 1;
                        const newDate = new Date(selectedDate);
                        newDate.setDate(day);

                        return (
                          <button
                            key={i}
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm
                              ${selectedDate.getDate() === day ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
                            onClick={() => {
                              const newDate = new Date(selectedDate);
                              newDate.setDate(day);
                              handleDateChange(newDate);
                            }}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Shift Tabs */}
          <div className="flex border-b">
            <button
              className={`px-6 py-2 font-medium flex items-center ${selectedShift === 'all' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
              onClick={() => setSelectedShift('all')}
            >
              <span>All</span>
              <span className="ml-2 text-xs bg-gray-200 px-2 py-0.5 rounded">{stats.totalEmployees}</span>
            </button>

            <button
              className={`px-6 py-2 font-medium ${selectedShift === 'default' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
              onClick={() => setSelectedShift('default')}
            >
              Default Shift
            </button>

            <button
              className={`px-6 py-2 font-medium ${selectedShift === 'morning' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
              onClick={() => setSelectedShift('morning')}
            >
              Morning Shift
            </button>

            <button
              className={`px-6 py-2 font-medium ${selectedShift === 'night' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
              onClick={() => setSelectedShift('night')}
            >
              Night Shift
            </button>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
            {/* Checked In */}
            <div className="border rounded-lg flex items-center p-4">
              <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
              <div>
                <div className="font-bold text-lg">{stats.checkedIn}</div>
                <div className="text-sm text-gray-500">Checked In</div>
              </div>
            </div>

            {/* Not in Yet */}
            <div className="border rounded-lg flex items-center p-4">
              <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
              <div>
                <div className="font-bold text-lg">{stats.notInYet}</div>
                <div className="text-sm text-gray-500">Not in Yet</div>
              </div>
            </div>

            {/* Time Off */}
            <div className="border rounded-lg flex items-center p-4">
              <div className="h-3 w-3 rounded-full bg-purple-500 mr-2"></div>
              <div>
                <div className="font-bold text-lg">{stats.timeOffToday}</div>
                <div className="text-sm text-gray-500">Time Off</div>
              </div>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm">
                  <th className="px-4 py-3 text-left font-medium">Emp ID</th>
                  <th className="px-4 py-3 text-left font-medium">Name</th>
                  <th className="px-4 py-3 text-left font-medium">Dept.</th>
                  <th className="px-4 py-3 text-left font-medium">Designation</th>
                  <th className="px-4 py-3 text-left font-medium">First Punch</th>
                  <th className="px-4 py-3 text-left font-medium">Last Punch</th>
                  <th className="px-4 py-3 text-left font-medium">Total Working Hours</th>
                  <th className="px-4 py-3 text-left font-medium">Total Break Hours</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {employees.length > 0 ? (
                  employees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{employee.id}</td>
                      <td className="px-4 py-3 text-sm">{employee.name}</td>
                      <td className="px-4 py-3 text-sm">{employee.department}</td>
                      <td className="px-4 py-3 text-sm">{employee.designation}</td>
                      <td className="px-4 py-3 text-sm">{employee.firstPunch}</td>
                      <td className="px-4 py-3 text-sm">{employee.lastPunch}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="flex items-center">
                          {employee.workingHours}
                          {employee.workingHours === '05h 59m' && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500 ml-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">{employee.breakHours}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-4 py-6 text-center text-gray-500">
                      No employee data available for the selected shift and date
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;