import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Employee from './pages/Employee'
import EmployeeDetail from './pages/EmployeeDetail'; // New page for employee details
import AddEmployee from './pages/AddEmployee';
import LeaveApplication from './pages/LeaveApplication';
import LeaveStatusPage from './pages/LeaveStatus';
import Navbar from './Components/Navbar';
import Usermanagement from './pages/Usermanagement';
import api from "./api";
import Home from './Components/Home';
const App = () => {
  useEffect(() => {
    api.get("/api/data") // or change this to a valid route like /api/employees
      .then((res) => {
        console.log("Data:", res.data);
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  }, []);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/usermanage" element={<Usermanagement />} />
        <Route exact path="/leaveapplication" element={<LeaveApplication />} />
        <Route exact path="/leavestatusPage" element={<LeaveStatusPage />} />
        <Route exact path="/employee" element={<Employee />} />
        <Route path="/employee/add" element={<AddEmployee />} />
        <Route path="/employee/:id" element={<EmployeeDetail />} />
      </Routes>
    </Router>
  );
};

export default App;

