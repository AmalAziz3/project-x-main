import React from 'react';
import {} from '@mui/material';
import {} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Paper,
  BottomNavigation,
  BottomNavigationAction,
} from '@mui/material';
import {
  Home as HomeIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Dashboard as DashboardIcon,
  Notifications as NotificationsIcon,
  Assessment as AssessmentIcon,
  Support as SupportIcon,
} from '@mui/icons-material';

// Define routes where the footer should not be displayed
const routesWithoutFooter = [
  '/login',
  '/register',
  '/forgot-password',
  '/verify-reset',
  '/verify-registration',
  '/role-selection',
  '/Home',
];

function Footer({ role }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if location is defined before using it
  if (!location || !location.pathname) {
    return null; // Don't render footer if location is not available
  }
  
  // Check if the current route should display the footer
  const shouldDisplayFooter = routesWithoutFooter.findIndex(
    (route) => location.pathname === route
  ) === -1;

  if (!shouldDisplayFooter) {
    return null;
  }

  return (
    <Paper 
      sx={{ 
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        bgcolor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(0, 229, 255, 0.2)',
        height: '70px',
        zIndex: 1000,
      }} 
      elevation={3}
    >
      <BottomNavigation
        value={location.pathname}
        showLabels
        sx={{
          bgcolor: 'transparent',
          height: '100%',
          '& .MuiBottomNavigationAction-root': {
            color: 'rgba(255, 255, 255, 0.7)',
            minWidth: 'auto',
            padding: '6px 12px',
            '&.Mui-selected': {
              color: '#00E5FF',
            },
            '&:hover': {
              color: '#00E5FF',
              '& .MuiSvgIcon-root': {
                transform: 'translateY(-2px)',
              },
            },
            '& .MuiBottomNavigationAction-label': {
              fontSize: '0.75rem',
              transition: 'font-size 0.2s ease-in-out',
              '&.Mui-selected': {
                fontSize: '0.875rem',
              },
              opacity: 1,
              color: 'inherit',
            },
          },
          '& .MuiSvgIcon-root': {
            fontSize: '24px',
            transition: 'transform 0.2s ease-in-out',
            marginBottom: '4px',
          },
        }}
      >
        <BottomNavigationAction
          label="Home"
          icon={<HomeIcon />}
          value={`/home/${role}`}
          onClick={() => navigate(`/home/${role}`)}
        />
        {role === 'student' && (
          <>
            <BottomNavigationAction
              label="Questionnaire"
              icon={<SchoolIcon />}
              value="/questionnaire"
              onClick={() => navigate('/questionnaire')}
            />
            <BottomNavigationAction
              label="Report"
              icon={<AssessmentIcon />}
              value="/report"
              onClick={() => navigate('/report')}
            />
          </>
        )}
        {role === 'expert' && (
          <>
            <BottomNavigationAction
              label="Management"
              icon={<DashboardIcon />}
              value="/lectures"
              onClick={() => navigate('/lectures')}
            />
            <BottomNavigationAction
              label="Support"
              icon={<SupportIcon />}
              value="/expert-support"
              onClick={() => navigate('/expert-support')}
            />
          </>
        )}
        {role === 'admin' && (
          <BottomNavigationAction
            label="Management"
            icon={<DashboardIcon />}
            value="/management"
            onClick={() => navigate('/management')}
          />
        )}
        <BottomNavigationAction
          label="Announcements"
          icon={<NotificationsIcon />}
          value="/notifications"
          onClick={() => navigate('/notifications')}
        />
        <BottomNavigationAction
          label="Profile"
          icon={<PersonIcon />}
          value={`/profile/${role}`}
          onClick={() => navigate(`/profile/${role}`)}
        />
      </BottomNavigation>
    </Paper>
  );
}

export default Footer; 
