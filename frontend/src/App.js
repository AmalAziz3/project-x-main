import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme/theme';
import Home from './components/home/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import VerifyReset from './components/auth/VerifyReset';
import VerifyRegistration from './components/auth/VerifyRegistration';
import DashboardStudent from './components/dashboard/DashboardStudent';
import AdminDashboard from './components/dashboard/AdminDashboard';
import StudentProfile from './components/profile/StudentProfile';
import AdminProfile from './components/profile/AdminProfile';
import ExpertProfile from './components/profile/ExpertProfile';
import Report from './components/report/Report';
import Results from './components/results/Results';
import Questionnaire from './components/questionnaire/Questionnaire';
import RoleSelection from './components/auth/RoleSelection';
import Communication from './components/communication/Communication';
import Announcements from './components/notifications/Notifications';
import Management from './components/management/Management';
import TestAnalysis from './components/admin/TestAnalysis';
import DataDisplay from './components/admin/DataDisplay';
import ViewLectures from './components/lectures/ViewLectures';
import ScheduleLecture from './components/lectures/ScheduleLecture';
import EditLecture from './components/lectures/EditLecture';
import PostAnnouncement from './components/announcements/PostAnnouncement';
// import Dashboard from './components/dashboard/Dashboard';
import StudentHome from './components/home/StudentHome';
import ExpertManagement from './components/dashboard/ExpertManagement';
import ExpertSupport from './components/dashboard/ExpertSupport';
import { useSelector, useDispatch } from 'react-redux';
import ExpertHome from './components/home/ExpertHome';
import { initializeAuthThunk } from './store/authSlice';
import { CircularProgress, Box } from '@mui/material';

// Conditional redirect component based on user role
const LecturesRedirect = () => {
  const { role } = useSelector((state) => state.auth);
  
  // If user is student or admin, redirect to view-lectures
  // Otherwise (expert or any other role), show the ExpertManagement component
  if (role === 'student' || role === 'admin') {
    return <Navigate to="/view-lectures" replace />;
  }
  
  return <ExpertManagement />;
};

// App component with unrestricted routes for frontend development
function App() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  
  useEffect(() => {
    // Initialize authentication state when app loads
    dispatch(initializeAuthThunk());
  }, [dispatch]);
  
  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url('/Background.jpg')`,
        backgroundSize: 'cover',
      }}>
        <CircularProgress size={60} sx={{ color: '#00E5FF' }} />
      </Box>
    );
  }
  
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/Home" element={<Home />} />
          <Route path="/" element={<Navigate to="/Home" replace />} />
          <Route path="/role-selection" element={<RoleSelection />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-reset" element={<VerifyReset />} />
          <Route path="/verify-registration" element={<VerifyRegistration />} />

          {/* Student Routes */}
          <Route path="/dashboard/student" element={<DashboardStudent />} />
          <Route path="/home/student" element={<StudentHome />} />
          <Route path="/profile/student" element={<StudentProfile />} />

          {/* Admin Routes */}
          <Route path="/home/admin" element={<AdminDashboard />} />
          <Route path="/management" element={<Management />} />
          <Route path="/admin/test-analysis" element={<TestAnalysis />} />
          <Route path="/admin/data-display" element={<DataDisplay />} />
          <Route path="/profile/admin" element={<AdminProfile />} />

          {/* Expert Routes */}
          <Route path="/home/expert" element={<ExpertHome />} />
          <Route path="/expert-support" element={<ExpertSupport />} />
          <Route path="/profile/expert" element={<ExpertProfile />} />
          
          {/* Shared Routes */}
          <Route path="/lectures" element={<LecturesRedirect />} />
          <Route path="/view-lectures" element={<ViewLectures />} />
          <Route path="/schedule-lecture" element={<ScheduleLecture />} />
          <Route path="/edit-lecture/:id" element={<EditLecture />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/post-announcement" element={<PostAnnouncement />} />
          <Route path="/edit-announcement/:id" element={<PostAnnouncement />} />
          <Route path="/questionnaire" element={<Questionnaire />} />
          <Route path="/report" element={<Report />} />
          <Route path="/results" element={<Results />} />
          <Route path="/communication" element={<Communication />} />
          <Route path="/notifications" element={<Announcements />} />

          {/* Redirect /expert-home to /home/expert */}
          <Route path="/expert-home" element={<Navigate to="/home/expert" replace />} />
          {/* Redirect /expert-lectures to /lectures */}
          <Route path="/expert-lectures" element={<Navigate to="/lectures" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
