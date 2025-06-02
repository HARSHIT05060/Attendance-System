// import React, { useState, useEffect } from 'react';
// import { Calendar, Users, Clock, Coffee, UserCheck, Fingerprint, ChevronDown } from 'lucide-react';

// // Mock data for different shifts
// const mockEmployeeData = {
//   "all": [
//     {
//       id: 'TG17118',
//       name: 'Nitin Jain',
//       department: 'Pressure Gauges - Domestic',
//       designation: 'Manager',
//       firstPunch: '01:47 PM',
//       lastPunch: '-',
//       workingHours: '05h 59m',
//       breakHours: '-',
//       status: 'checked-in'
//     },
//     {
//       id: 'TG17119',
//       name: 'Aarav Kumar',
//       department: 'Software Development',
//       designation: 'Developer',
//       firstPunch: '09:15 AM',
//       lastPunch: '06:30 PM',
//       workingHours: '08h 15m',
//       breakHours: '01h 00m',
//       status: 'checked-in'
//     },
//     {
//       id: 'TG17120',
//       name: 'Priya Sharma',
//       department: 'HR',
//       designation: 'HR Manager',
//       firstPunch: '-',
//       lastPunch: '-',
//       workingHours: '-',
//       breakHours: '-',
//       status: 'not-in'
//     }
//   ],
//   "default": [
//     {
//       id: 'TG17118',
//       name: 'Nitin Jain',
//       department: 'Pressure Gauges - Domestic',
//       designation: 'Manager',
//       firstPunch: '01:47 PM',
//       lastPunch: '-',
//       workingHours: '05h 59m',
//       breakHours: '-',
//       status: 'checked-in'
//     }
//   ],
//   "morning": [
//     {
//       id: 'TG17119',
//       name: 'Aarav Kumar',
//       department: 'Software Development',
//       designation: 'Developer',
//       firstPunch: '09:15 AM',
//       lastPunch: '06:30 PM',
//       workingHours: '08h 15m',
//       breakHours: '01h 00m',
//       status: 'checked-in'
//     }
//   ],
//   "night": [
//     {
//       id: 'TG17120',
//       name: 'Priya Sharma',
//       department: 'HR',
//       designation: 'HR Manager',
//       firstPunch: '-',
//       lastPunch: '-',
//       workingHours: '-',
//       breakHours: '-',
//       status: 'not-in'
//     }
//   ]
// };

// const Home = () => {
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [selectedShift, setSelectedShift] = useState('all');
//   const [employees, setEmployees] = useState([]);
//   const [showCalendar, setShowCalendar] = useState(false);
//   const [stats, setStats] = useState({
//     totalEmployees: 478,
//     currentlyWorking: 1,
//     onBreak: 0,
//     timeOff: 0,
//     pendingBiometrics: 406,
//     checkedIn: 1,
//     notInYet: 477,
//     timeOffToday: 0
//   });

//   // Format selected date for display
//   const formattedDate = selectedDate.toLocaleDateString('en-US', {
//     day: 'numeric',
//     month: 'short',
//     year: 'numeric'
//   });

//   // Update employees when shift changes
//   useEffect(() => {
//     if (mockEmployeeData[selectedShift]) {
//       setEmployees(mockEmployeeData[selectedShift]);

//       // Update stats based on selected shift and date
//       const checkedInCount = mockEmployeeData[selectedShift].filter(emp => emp.status === 'checked-in').length;
//       const totalCount = mockEmployeeData[selectedShift].length;

//       setStats(prev => ({
//         ...prev,
//         currentlyWorking: checkedInCount,
//         checkedIn: checkedInCount,
//         notInYet: totalCount - checkedInCount,
//       }));
//     } else {
//       setEmployees([]);
//     }
//   }, [selectedShift, selectedDate]);

//   // Function to handle date change
//   const handleDateChange = (date) => {
//     setSelectedDate(date);
//     setShowCalendar(false);
//   };

//   return (
//     <div className="bg-gray-100 min-h-screen p-4">
//       <div className="max-w-7xl mx-auto">
//         {/* Attendance Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
//           {/* Total Employees */}
//           <div className="bg-white rounded-lg p-4 shadow">
//             <div className="flex items-start">
//               <div className="rounded-full bg-blue-100 p-2 mr-4">
//                 <Users className="h-6 w-6 text-blue-500" />
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">Total Employees</p>
//                 <h2 className="text-2xl font-bold">{stats.totalEmployees}</h2>
//               </div>
//             </div>
//           </div>

//           {/* Currently Working */}
//           <div className="bg-white rounded-lg p-4 shadow">
//             <div className="flex items-start">
//               <div className="rounded-full bg-green-100 p-2 mr-4">
//                 <UserCheck className="h-6 w-6 text-green-500" />
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">Currently Working</p>
//                 <h2 className="text-2xl font-bold">{stats.currentlyWorking}</h2>
//               </div>
//             </div>
//           </div>

//           {/* On Break */}
//           <div className="bg-white rounded-lg p-4 shadow">
//             <div className="flex items-start">
//               <div className="rounded-full bg-orange-100 p-2 mr-4">
//                 <Coffee className="h-6 w-6 text-orange-500" />
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">On Break</p>
//                 <h2 className="text-2xl font-bold">{stats.onBreak}</h2>
//               </div>
//             </div>
//           </div>

//           {/* Time Off */}
//           <div className="bg-white rounded-lg p-4 shadow">
//             <div className="flex items-start">
//               <div className="rounded-full bg-purple-100 p-2 mr-4">
//                 <Clock className="h-6 w-6 text-purple-500" />
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">Time Off</p>
//                 <h2 className="text-2xl font-bold">{stats.timeOff}</h2>
//               </div>
//             </div>
//           </div>

//           {/* Pending Biometrics */}
//           <div className="bg-white rounded-lg p-4 shadow">
//             <div className="flex items-start">
//               <div className="rounded-full bg-red-100 p-2 mr-4">
//                 <Fingerprint className="h-6 w-6 text-red-500" />
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">Pending Biometrics</p>
//                 <h2 className="text-2xl font-bold">{stats.pendingBiometrics}</h2>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Quick Attendance Summary */}
//         <div className="bg-white rounded-lg shadow mb-6">
//           <div className="p-4 border-b">
//             <div className="flex justify-between items-center">
//               <h2 className="text-lg font-medium">Quick Attendance Summary</h2>
//               <div className="relative">
//                 <button
//                   className="border rounded flex items-center p-2"
//                   onClick={() => setShowCalendar(!showCalendar)}
//                 >
//                   <Calendar className="h-4 w-4 mr-2" />
//                   <span>{formattedDate}</span>
//                   <ChevronDown className="h-4 w-4 ml-2" />
//                 </button>

//                 {showCalendar && (
//                   <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg z-10 p-2">
//                     <div className="p-2 grid grid-cols-7 gap-1">
//                       {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day, i) => (
//                         <div key={i} className="text-center text-xs font-medium text-gray-500">{day}</div>
//                       ))}

//                       {Array.from({ length: 31 }).map((_, i) => {
//                         const day = i + 1;
//                         const newDate = new Date(selectedDate);
//                         newDate.setDate(day);

//                         return (
//                           <button
//                             key={i}
//                             className={`w-8 h-8 rounded-full flex items-center justify-center text-sm
//                               ${selectedDate.getDate() === day ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
//                             onClick={() => {
//                               const newDate = new Date(selectedDate);
//                               newDate.setDate(day);
//                               handleDateChange(newDate);
//                             }}
//                           >
//                             {day}
//                           </button>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Shift Tabs */}
//           <div className="flex border-b">
//             <button
//               className={`px-6 py-2 font-medium flex items-center ${selectedShift === 'all' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
//               onClick={() => setSelectedShift('all')}
//             >
//               <span>All</span>
//               <span className="ml-2 text-xs bg-gray-200 px-2 py-0.5 rounded">{stats.totalEmployees}</span>
//             </button>

//             <button
//               className={`px-6 py-2 font-medium ${selectedShift === 'default' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
//               onClick={() => setSelectedShift('default')}
//             >
//               Default Shift
//             </button>

//             <button
//               className={`px-6 py-2 font-medium ${selectedShift === 'morning' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
//               onClick={() => setSelectedShift('morning')}
//             >
//               Morning Shift
//             </button>

//             <button
//               className={`px-6 py-2 font-medium ${selectedShift === 'night' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
//               onClick={() => setSelectedShift('night')}
//             >
//               Night Shift
//             </button>
//           </div>

//           {/* Status Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
//             {/* Checked In */}
//             <div className="border rounded-lg flex items-center p-4">
//               <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
//               <div>
//                 <div className="font-bold text-lg">{stats.checkedIn}</div>
//                 <div className="text-sm text-gray-500">Checked In</div>
//               </div>
//             </div>

//             {/* Not in Yet */}
//             <div className="border rounded-lg flex items-center p-4">
//               <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
//               <div>
//                 <div className="font-bold text-lg">{stats.notInYet}</div>
//                 <div className="text-sm text-gray-500">Not in Yet</div>
//               </div>
//             </div>

//             {/* Time Off */}
//             <div className="border rounded-lg flex items-center p-4">
//               <div className="h-3 w-3 rounded-full bg-purple-500 mr-2"></div>
//               <div>
//                 <div className="font-bold text-lg">{stats.timeOffToday}</div>
//                 <div className="text-sm text-gray-500">Time Off</div>
//               </div>
//             </div>
//           </div>

//           {/* Attendance Table */}
//           <div className="overflow-x-auto">
//             <table className="min-w-full">
//               <thead>
//                 <tr className="bg-gray-50 text-gray-500 text-sm">
//                   <th className="px-4 py-3 text-left font-medium">Emp ID</th>
//                   <th className="px-4 py-3 text-left font-medium">Name</th>
//                   <th className="px-4 py-3 text-left font-medium">Dept.</th>
//                   <th className="px-4 py-3 text-left font-medium">Designation</th>
//                   <th className="px-4 py-3 text-left font-medium">First Punch</th>
//                   <th className="px-4 py-3 text-left font-medium">Last Punch</th>
//                   <th className="px-4 py-3 text-left font-medium">Total Working Hours</th>
//                   <th className="px-4 py-3 text-left font-medium">Total Break Hours</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y">
//                 {employees.length > 0 ? (
//                   employees.map((employee) => (
//                     <tr key={employee.id} className="hover:bg-gray-50">
//                       <td className="px-4 py-3 text-sm">{employee.id}</td>
//                       <td className="px-4 py-3 text-sm">{employee.name}</td>
//                       <td className="px-4 py-3 text-sm">{employee.department}</td>
//                       <td className="px-4 py-3 text-sm">{employee.designation}</td>
//                       <td className="px-4 py-3 text-sm">{employee.firstPunch}</td>
//                       <td className="px-4 py-3 text-sm">{employee.lastPunch}</td>
//                       <td className="px-4 py-3 text-sm">
//                         <span className="flex items-center">
//                           {employee.workingHours}
//                           {employee.workingHours === '05h 59m' && (
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500 ml-1" viewBox="0 0 20 20" fill="currentColor">
//                               <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                             </svg>
//                           )}
//                         </span>
//                       </td>
//                       <td className="px-4 py-3 text-sm">{employee.breakHours}</td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan={8} className="px-4 py-6 text-center text-gray-500">
//                       No employee data available for the selected shift and date
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;  

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

  // Get current month's days
  const getCurrentMonthDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const days = [];
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    // Add actual days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    return days;
  };

  return (
    <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', padding: '16px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Attendance Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          {/* Total Employees */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <div style={{
                borderRadius: '50%',
                backgroundColor: '#dbeafe',
                padding: '8px',
                marginRight: '16px'
              }}>
                <Users style={{ height: '24px', width: '24px', color: '#3b82f6' }} />
              </div>
              <div>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 4px 0' }}>Total Employees</p>
                <h2 style={{ fontSize: '32px', fontWeight: 'bold', margin: '0' }}>{stats.totalEmployees}</h2>
              </div>
            </div>
          </div>

          {/* Currently Working */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <div style={{
                borderRadius: '50%',
                backgroundColor: '#dcfce7',
                padding: '8px',
                marginRight: '16px'
              }}>
                <UserCheck style={{ height: '24px', width: '24px', color: '#22c55e' }} />
              </div>
              <div>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 4px 0' }}>Currently Working</p>
                <h2 style={{ fontSize: '32px', fontWeight: 'bold', margin: '0' }}>{stats.currentlyWorking}</h2>
              </div>
            </div>
          </div>

          {/* On Break */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <div style={{
                borderRadius: '50%',
                backgroundColor: '#fed7aa',
                padding: '8px',
                marginRight: '16px'
              }}>
                <Coffee style={{ height: '24px', width: '24px', color: '#f97316' }} />
              </div>
              <div>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 4px 0' }}>On Break</p>
                <h2 style={{ fontSize: '32px', fontWeight: 'bold', margin: '0' }}>{stats.onBreak}</h2>
              </div>
            </div>
          </div>

          {/* Time Off */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <div style={{
                borderRadius: '50%',
                backgroundColor: '#e9d5ff',
                padding: '8px',
                marginRight: '16px'
              }}>
                <Clock style={{ height: '24px', width: '24px', color: '#a855f7' }} />
              </div>
              <div>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 4px 0' }}>Time Off</p>
                <h2 style={{ fontSize: '32px', fontWeight: 'bold', margin: '0' }}>{stats.timeOff}</h2>
              </div>
            </div>
          </div>

          {/* Pending Biometrics */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <div style={{
                borderRadius: '50%',
                backgroundColor: '#fecaca',
                padding: '8px',
                marginRight: '16px'
              }}>
                <Fingerprint style={{ height: '24px', width: '24px', color: '#ef4444' }} />
              </div>
              <div>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 4px 0' }}>Pending Biometrics</p>
                <h2 style={{ fontSize: '32px', fontWeight: 'bold', margin: '0' }}>{stats.pendingBiometrics}</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Attendance Summary */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '24px'
        }}>
          <div style={{
            padding: '16px',
            borderBottom: '1px solid #e5e7eb'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: '500', margin: '0' }}>Quick Attendance Summary</h2>
              <div style={{ position: 'relative' }}>
                <button
                  style={{
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px',
                    backgroundColor: 'white',
                    cursor: 'pointer'
                  }}
                  onClick={() => setShowCalendar(!showCalendar)}
                >
                  <Calendar style={{ height: '16px', width: '16px', marginRight: '8px' }} />
                  <span>{formattedDate}</span>
                  <ChevronDown style={{ height: '16px', width: '16px', marginLeft: '8px' }} />
                </button>

                {showCalendar && (
                  <div style={{
                    position: 'absolute',
                    right: '0',
                    marginTop: '8px',
                    backgroundColor: 'white',
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                    borderRadius: '8px',
                    zIndex: '10',
                    padding: '8px',
                    minWidth: '280px'
                  }}>
                    <div style={{ padding: '8px' }}>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, 1fr)',
                        gap: '4px',
                        marginBottom: '8px'
                      }}>
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day, i) => (
                          <div key={i} style={{
                            textAlign: 'center',
                            fontSize: '12px',
                            fontWeight: '500',
                            color: '#6b7280'
                          }}>
                            {day}
                          </div>
                        ))}
                      </div>

                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, 1fr)',
                        gap: '4px'
                      }}>
                        {getCurrentMonthDays().map((day, i) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'center' }}>
                            {day && (
                              <button
                                style={{
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '50%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '14px',
                                  border: 'none',
                                  cursor: 'pointer',
                                  backgroundColor: selectedDate.getDate() === day ? '#3b82f6' : 'transparent',
                                  color: selectedDate.getDate() === day ? 'white' : '#374151'
                                }}
                                onMouseEnter={(e) => {
                                  if (selectedDate.getDate() !== day) {
                                    e.target.style.backgroundColor = '#f3f4f6';
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (selectedDate.getDate() !== day) {
                                    e.target.style.backgroundColor = 'transparent';
                                  }
                                }}
                                onClick={() => {
                                  const newDate = new Date(selectedDate);
                                  newDate.setDate(day);
                                  handleDateChange(newDate);
                                }}
                              >
                                {day}
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Shift Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb' }}>
            {[
              { key: 'all', label: 'All', count: stats.totalEmployees },
              { key: 'default', label: 'Default Shift' },
              { key: 'morning', label: 'Morning Shift' },
              { key: 'night', label: 'Night Shift' }
            ].map((tab) => (
              <button
                key={tab.key}
                style={{
                  padding: '8px 24px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  borderBottom: selectedShift === tab.key ? '2px solid #3b82f6' : '2px solid transparent',
                  color: selectedShift === tab.key ? '#3b82f6' : '#6b7280'
                }}
                onClick={() => setSelectedShift(tab.key)}
              >
                <span>{tab.label}</span>
                {tab.count && (
                  <span style={{
                    marginLeft: '8px',
                    fontSize: '12px',
                    backgroundColor: '#e5e7eb',
                    padding: '2px 8px',
                    borderRadius: '12px'
                  }}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Status Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            padding: '16px'
          }}>
            {/* Checked In */}
            <div style={{
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              padding: '16px'
            }}>
              <div style={{
                height: '12px',
                width: '12px',
                borderRadius: '50%',
                backgroundColor: '#3b82f6',
                marginRight: '8px'
              }}></div>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{stats.checkedIn}</div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>Checked In</div>
              </div>
            </div>

            {/* Not in Yet */}
            <div style={{
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              padding: '16px'
            }}>
              <div style={{
                height: '12px',
                width: '12px',
                borderRadius: '50%',
                backgroundColor: '#ef4444',
                marginRight: '8px'
              }}></div>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{stats.notInYet}</div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>Not in Yet</div>
              </div>
            </div>

            {/* Time Off */}
            <div style={{
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              padding: '16px'
            }}>
              <div style={{
                height: '12px',
                width: '12px',
                borderRadius: '50%',
                backgroundColor: '#a855f7',
                marginRight: '8px'
              }}></div>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{stats.timeOffToday}</div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>Time Off</div>
              </div>
            </div>
          </div>

          {/* Attendance Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb' }}>
                  {['Emp ID', 'Name', 'Dept.', 'Designation', 'First Punch', 'Last Punch', 'Total Working Hours', 'Total Break Hours'].map((header) => (
                    <th key={header} style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontWeight: '500',
                      fontSize: '14px',
                      color: '#6b7280'
                    }}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {employees.length > 0 ? (
                  employees.map((employee, index) => (
                    <tr key={employee.id} style={{
                      borderTop: index > 0 ? '1px solid #e5e7eb' : 'none'
                    }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f9fafb';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}>
                      <td style={{ padding: '12px 16px', fontSize: '14px' }}>{employee.id}</td>
                      <td style={{ padding: '12px 16px', fontSize: '14px' }}>{employee.name}</td>
                      <td style={{ padding: '12px 16px', fontSize: '14px' }}>{employee.department}</td>
                      <td style={{ padding: '12px 16px', fontSize: '14px' }}>{employee.designation}</td>
                      <td style={{ padding: '12px 16px', fontSize: '14px' }}>{employee.firstPunch}</td>
                      <td style={{ padding: '12px 16px', fontSize: '14px' }}>{employee.lastPunch}</td>
                      <td style={{ padding: '12px 16px', fontSize: '14px' }}>
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                          {employee.workingHours}
                          {employee.workingHours === '05h 59m' && (
                            <svg style={{ height: '20px', width: '20px', color: '#f59e0b', marginLeft: '4px' }}
                              viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          )}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '14px' }}>{employee.breakHours}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} style={{
                      padding: '24px 16px',
                      textAlign: 'center',
                      color: '#6b7280'
                    }}>
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