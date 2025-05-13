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
const App = () => {
  useEffect(() => {
    console.log("Backend URL:", import.meta.env.VITE_API_URL); // Should show URL in console

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
      <Navbar />
      <Routes>
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

