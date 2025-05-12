import React from 'react';
import { BrowserRouter as Router, Route,  Routes } from 'react-router-dom';
import Employee from './pages/Employee'
import EmployeeDetail from './pages/EmployeeDetail'; // New page for employee details
import AddEmployee from './pages/AddEmployee';
import LeaveApplication from './pages/LeaveApplication';
import LeaveStatusPage from './pages/LeaveStatus';
import Navbar from './Components/Navbar';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
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

