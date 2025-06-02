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