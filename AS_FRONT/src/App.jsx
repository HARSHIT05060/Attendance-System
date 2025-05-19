import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Sidebar from './Components/Sidebar';
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

const App = () => {
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
    <Router>
      {/* Page wrapper with vertical layout */}
      <div className="flex flex-col h-30">
        <Navbar /> {/* Top Navbar */}

        {/* Main layout: Sidebar and content side-by-side */}
        <div className="flex flex-1">
          <Sidebar /> {/* Left Sidebar */}
          <main className="flex-1 p-4 overflow-y-auto">
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route exact path="/usermanage" element={<UserManagement />} />
              <Route path="/add-user" element={<AddUser />} />
              <Route exact path="/leaveapplication" element={<LeaveApplication />} />
              <Route exact path="/holidaycalender" element={<HolidayCalendar />} />
              <Route exact path="/leavestatusPage" element={<LeaveStatusPage />} />
              <Route exact path="/employee" element={<Employee />} />
              <Route path="/employee/add" element={<AddEmployee />} />
              <Route path="/employee/:id" element={<EmployeeDetail />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
