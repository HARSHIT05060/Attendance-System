import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Employee from './pages/Employee';
import EmployeeDetail from './pages/EmployeeDetail';
import AddEmployee from './pages/AddEmployee';
import LeaveApplication from './pages/LeaveApplication';
import LeaveStatusPage from './pages/LeaveStatus';
import Navbar from './Components/Navbar';
import Usermanagement from './pages/Usermanagement';
import api from "./api";
import Home from './Components/Home';
import AddUser from './pages/AddUser';
import Sidebar from './Components/Sidebar';

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
              <Route exact path="/usermanage" element={<Usermanagement />} />
              <Route path="/add-user" element={<AddUser />} />
              <Route exact path="/leaveapplication" element={<LeaveApplication />} />
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
