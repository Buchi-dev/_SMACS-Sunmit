import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
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
import { Spin } from 'antd';

const App = () => {
  const { isAuthenticated, role, loading, logout } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />}
        />

        {/* Admin routes */}
        <Route
          path="/admin/*"
          element={
            isAuthenticated && role === 'admin' ? (
              <AdminLayout onLogout={logout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
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

        {/* Faculty routes */}
        <Route
          path="/faculty/*"
          element={
            isAuthenticated && role === 'faculty' ? (
              <FacultyLayout onLogout={logout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="manage-subjects" element={<ManageSubjects />} />
          <Route path="manage-attendance" element={<ManageAttendance />} />
          <Route path="attendance-panel" element={<AttendancePanel />} />
          <Route path="manage-reports" element={<ManageReports />} />
          <Route path="attendance-console" element={<AttendanceConsole />} />
        </Route>

        {/* Redirect root to proper dashboard */}
        <Route
          path="/"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : role === 'admin' ? (
              <Navigate to="/admin/dashboard" replace />
            ) : (
              <Navigate to="/faculty/dashboard" replace />
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : role === 'admin' ? (
              <Navigate to="/admin/dashboard" replace />
            ) : (
              <Navigate to="/faculty/dashboard" replace />
            )
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
