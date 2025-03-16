// Shared styles for base layout components
import {
  Home as HomeIcon,
  Create as CreateIcon,
  Assessment as AssessmentIcon,
  School as SchoolIcon,
  Forum as ForumIcon,
  Storage as StorageIcon,
  Analytics as AnalyticsIcon,
  Support as SupportIcon,
  ManageAccounts as ManagementIcon,
} from '@mui/icons-material';
import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Paper, Card } from '@mui/material';

export const navigationConfig = {
  student: [
    { label: 'Home', icon: <HomeIcon sx={{ fontSize: '2rem' }} />, path: '/home/student' },
    { label: 'Perform Test', icon: <CreateIcon sx={{ fontSize: '2rem' }} />, path: '/questionnaire' },
    { label: 'Report', icon: <AssessmentIcon sx={{ fontSize: '2rem' }} />, path: '/report' },
    { label: 'Lectures', icon: <SchoolIcon sx={{ fontSize: '2rem' }} />, path: '/view-lectures' },
    { label: 'Communication', icon: <ForumIcon sx={{ fontSize: '2rem' }} />, path: '/communication' },
  ],
  admin: [
    { label: 'Home', icon: <HomeIcon sx={{ fontSize: '2rem' }} />, path: '/home/admin' },
    { label: 'Management', icon: <ManagementIcon sx={{ fontSize: '2rem' }} />, path: '/management' },
    { label: 'Test Analysis', icon: <AnalyticsIcon sx={{ fontSize: '2rem' }} />, path: '/admin/test-analysis' },
    { label: 'Data Display', icon: <StorageIcon sx={{ fontSize: '2rem' }} />, path: '/admin/data-display' },
  ],
  expert: [
    { label: 'Home', icon: <HomeIcon sx={{ fontSize: '2rem' }} />, path: '/home/expert' },
    { label: 'Management', icon: <ManagementIcon sx={{ fontSize: '2rem' }} />, path: '/lectures' },
    { label: 'Support', icon: <SupportIcon sx={{ fontSize: '2rem' }} />, path: '/expert-support' },
  ],
};

export const footerStyles = {
  paper: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1100,
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 0,
    boxShadow: '0px -1px 4px rgba(0, 0, 0, 0.05)',
    height: '80px',
  },
  navigation: {
    height: '100%',
    backgroundColor: 'transparent',
    display: 'flex',
    justifyContent: 'space-around',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 32px',
    '& .MuiBottomNavigationAction-root': {
      minWidth: '180px',
      padding: '12px 0',
      '&.Mui-selected': {
        '& .MuiBottomNavigationAction-label': {
          fontSize: '0.875rem',
          color: '#2196f3',
        },
        '& .MuiSvgIcon-root': {
          color: '#2196f3',
          transform: 'scale(1.1)',
        },
      },
      '& .MuiBottomNavigationAction-label': {
        fontSize: '0.875rem',
        color: '#1a237e',
        marginTop: '8px',
      },
      '& .MuiSvgIcon-root': {
        color: '#1a237e',
        fontSize: '2rem',
        marginBottom: '4px',
        transition: 'transform 0.2s ease-in-out',
      },
    },
  }
};

export const headerStyles = {
  appBar: {
    zIndex: 1200,
    backgroundColor: 'white',
    color: '#1a237e',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0 20px',
  },
  avatar: {
    bgcolor: '#1a237e',
    width: 40,
    height: 40,
  }
};

export const baseLayoutStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    width: '100%',
  },
  mainContent: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: 'transparent',
  }
};

export const cardStyles = {
  default: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    height: '100%',
  },
  hoverable: {
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    }
  }
};

export const MainContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  flexDirection: 'column',
}));

export const ContentContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.default,
}));

export const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
  },
}));

export const DashboardContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(3),
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  padding: theme.spacing(3),
}));

export const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
}));

export const FooterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(3),
  marginTop: 'auto',
}));

export const FooterContent = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '16px',
});

export const FooterLinks = styled(Box)({
  display: 'flex',
  gap: '24px',
  alignItems: 'center',
  '& a': {
    color: 'inherit',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}); 
