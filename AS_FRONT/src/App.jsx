import React, { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Sidebar from './Components/Sidebar';
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Home from './Components/Home';
import api from "./api";
import Employee from './pages/Employee/Employee';
import EmployeeDetail from './pages/Employee/EmployeeDetail';
import AddEmployee from './pages/Employee/AddEmployee';
import LeaveApplication from './pages/Leave/LeaveApplication';
import LeaveStatusPage from './pages/Leave/LeaveStatus';
import HolidayCalendar from './pages/Leave/HolidayCalendar';
import UserManagement from './pages/Users/Usermanagement';
import AddUser from './pages/Users/AddUser';
import BulkAttendance from './pages/Payroll/BulkAttendance';
import MonthlyPayroll from './pages/Payroll/MonthlyPayroll';
import HourlyPayroll from './pages/Payroll/HourlyPayroll';
import FinalizePayroll from './pages/Payroll/FinalizePayroll';
import ShiftManagement from './pages/ShiftManagement/ShiftManagement';

const App = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === "/" || location.pathname === "/signup";

  useEffect(() => {
    api.get("/api/data")
      .then((res) => {
        console.log("Data:", res.data);
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  }, []);

  return (
    <div className="flex flex-col h-30">
      {!isAuthPage && <Navbar />}
      <div className={`flex flex-1 ${!isAuthPage ? "ml-64 pt-16" : ""}`}>
        {!isAuthPage && <Sidebar />}
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/home" element={<Home />} />
            <Route path="/usermanage" element={<UserManagement />} />
            <Route path="/add-user" element={<AddUser />} />
            <Route path="/leaveapplication" element={<LeaveApplication />} />
            <Route path="/holidaycalender" element={<HolidayCalendar />} />
            <Route path="/leavestatusPage" element={<LeaveStatusPage />} />
            <Route path="/shift-management" element={<ShiftManagement />} />
            <Route path="/employee" element={<Employee />} />
            <Route path="/employee/add" element={<AddEmployee />} />
            <Route path="/employee/:id" element={<EmployeeDetail />} />
            <Route path="/bulk-attendance" element={<BulkAttendance />} />
            <Route path="/monthly-payroll" element={<MonthlyPayroll />} />
            <Route path="/hourly-payroll" element={<HourlyPayroll />} />
            <Route path="/finalize-payroll" element={<FinalizePayroll />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;
