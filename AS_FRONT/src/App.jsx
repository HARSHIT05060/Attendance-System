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
    // Log the current mode and the backend URL for debugging
    console.log("Backend URL:", import.meta.env.MODE === 'development'
      ? import.meta.env.VITE_API_URL_LOCAL
      : import.meta.env.VITE_API_URL_PROD);

    // Set the API URL based on the environment
    const apiUrl = import.meta.env.MODE === 'development'
      ? import.meta.env.VITE_API_URL_LOCAL  // Local API URL for development
      : import.meta.env.VITE_API_URL_PROD; // Production API URL for deployed environment

    // Make the API call
    api.get(`${apiUrl}/api/data`)
      .then((res) => {
        console.log("Data:", res.data);
      })
      .catch((err) => {
        console.error("Error:", err);
        if (err.response) {
          console.error("Response Error:", err.response.data);
        }
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

