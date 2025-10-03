// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/Common/ProtectedRoute';
import LoadingSpinner from './components/Common/LoadingSpinner';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import StudentLeaveApplication from './pages/student/LeaveApplication';
import StudentLeaveHistory from './pages/student/LeaveHistory';
import StudentAttendance from './pages/student/Attendance';
import StudentSchedule from './pages/student/Schedule';

// Parent Pages
import ParentDashboard from './pages/parent/Dashboard';
import ParentAttendance from './pages/parent/Attendance';
import ParentLeaves from './pages/parent/Leaves';

// Coach Pages
import CoachDashboard from './pages/coach/Dashboard';
import CoachLeaveRequests from './pages/coach/LeaveRequests';
import CoachMarkAttendance from './pages/coach/MarkAttendance';
import CoachStudents from './pages/coach/Students';
import CoachSchedule from './pages/coach/Schedule';
import CoachReports from './pages/coach/Reports';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminStaffManagement from './pages/admin/StaffManagement';
import AdminSettings from './pages/admin/Settings';

// Common Pages
import Unauthorized from './components/Common/Unauthorized';
import NotFound from './components/Common/NotFound';

function App() {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading..." />
      </div>
    );
  }

  return (
    <div className="App">
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/register" 
          element={!isAuthenticated ? <Register /> : <Navigate to="/" replace />} 
        />
        
        {/* Redirect root based on user role */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? (
              user.role === 'student' ? <Navigate to="/student" replace /> :
              user.role === 'parent' ? <Navigate to="/parent" replace /> :
              user.role === 'coach' ? <Navigate to="/coach" replace /> :
              user.role === 'admin' ? <Navigate to="/admin" replace /> :
              <Navigate to="/login" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        {/* Student Routes */}
        <Route 
          path="/student/*" 
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <Routes>
                <Route index element={<StudentDashboard />} />
                <Route path="leave" element={<StudentLeaveApplication />} />
                <Route path="leaves" element={<StudentLeaveHistory />} />
                <Route path="attendance" element={<StudentAttendance />} />
                <Route path="schedule" element={<StudentSchedule />} />
              </Routes>
            </ProtectedRoute>
          } 
        />

        {/* Parent Routes */}
        <Route 
          path="/parent/*" 
          element={
            <ProtectedRoute allowedRoles={['parent']}>
              <Routes>
                <Route index element={<ParentDashboard />} />
                <Route path="attendance" element={<ParentAttendance />} />
                <Route path="leaves" element={<ParentLeaves />} />
              </Routes>
            </ProtectedRoute>
          } 
        />

        {/* Coach Routes */}
        <Route 
          path="/coach/*" 
          element={
            <ProtectedRoute allowedRoles={['coach', 'admin']}>
              <Routes>
                <Route index element={<CoachDashboard />} />
                <Route path="leaves" element={<CoachLeaveRequests />} />
                <Route path="attendance" element={<CoachMarkAttendance />} />
                <Route path="students" element={<CoachStudents />} />
                <Route path="schedule" element={<CoachSchedule />} />
                <Route path="reports" element={<CoachReports />} />
              </Routes>
            </ProtectedRoute>
          } 
        />

        {/* Admin Routes */}
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Routes>
                <Route index element={<AdminDashboard />} />
                <Route path="staff" element={<AdminStaffManagement />} />
                <Route path="settings" element={<AdminSettings />} />
              </Routes>
            </ProtectedRoute>
          } 
        />

        {/* Common Routes */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;