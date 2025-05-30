import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import FacultyLayout from './components/FacultyLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ManageStudents from './pages/ManageStudents';
import ManageFaculty from './pages/ManageFaculty';
import ManageSubjects from './pages/ManageSubjects';
import ManageAttendance from './pages/ManageAttendance';
import ManageReports from './pages/ManageReports';
import ManageUsers from './pages/ManageUsers';
import AttendancePanel from './pages/AttendancePanel';
import AttendanceConsole from './pages/AttendanceConsole';
/**
 * Access Map:
 * 
 * Faculty: Can access their own subjects, students, attendance records, and 
 * attendance reports of their subjects. Faculty can access Manage Subjects, 
 * Manage Students, Manage Attendance, and Manage Reports pages.
 * 
 * Admin: Can access all subjects, students, faculties, and everything else
 */

const App = () => {
  // Use localStorage to maintain authentication state across page refreshes
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('');

  // Check localStorage for auth state on component mount
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    const role = localStorage.getItem('userRole');
    
    if (authStatus === 'true' && role) {
      setIsAuthenticated(true);
      setUserRole(role);
    }
  }, []);

  // Function to handle login
  const handleLogin = (role) => {
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userRole', role);
    setIsAuthenticated(true);
    setUserRole(role);
  };

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    setIsAuthenticated(false);
    setUserRole('');
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />
        } />
        <Route path="/register" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />
        } />

        {/* Admin routes - Full access to everything */}
        <Route path="/admin/*" element={
          isAuthenticated && userRole === 'admin' ? 
            <AdminLayout onLogout={handleLogout} /> : 
            <Navigate to="/login" replace />
        }>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="manage-students" element={<ManageStudents />} />
          <Route path="manage-faculty" element={<ManageFaculty />} />
          <Route path="manage-subjects" element={<ManageSubjects />} />
          <Route path="manage-attendance" element={<ManageAttendance />} />
          <Route path="manage-reports" element={<ManageReports />} />
          <Route path="manage-users" element={<ManageUsers />} />
          <Route path="attendance-console" element={<AttendanceConsole />} />
        </Route>

        {/* Faculty routes - Access to subjects, students, attendance, and reports */}
        <Route path="/faculty/*" element={
          isAuthenticated && userRole === 'faculty' ? 
            <FacultyLayout onLogout={handleLogout} /> : 
            <Navigate to="/login" replace />
        }>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="manage-students" element={<ManageStudents />} />
          <Route path="manage-subjects" element={<ManageSubjects />} />
          <Route path="manage-attendance" element={<ManageAttendance />} />
          <Route path="attendance-panel" element={<AttendancePanel />} />
          <Route path="manage-reports" element={<ManageReports />} />
          <Route path="attendance-console" element={<AttendanceConsole />} />
        </Route>

        {/* Root path redirect based on role */}
        <Route path="/" element={
          !isAuthenticated ? (
            <Navigate to="/login" replace />
          ) : userRole === 'admin' ? (
            <Navigate to="/admin/dashboard" replace />
          ) : (
            <Navigate to="/faculty/dashboard" replace />
          )
        } />
        
        <Route path="/dashboard" element={
          !isAuthenticated ? (
            <Navigate to="/login" replace />
          ) : userRole === 'admin' ? (
            <Navigate to="/admin/dashboard" replace />
          ) : (
            <Navigate to="/faculty/dashboard" replace />
          )
        } />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;