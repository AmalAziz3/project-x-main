import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
} from '@mui/material';
import {
  Home as HomeIcon,
  Support as SupportIcon,
  Visibility as VisibilityIcon,
  Schedule as ScheduleIcon,
  School as SchoolIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
import BaseLayout from '../Layout/BaseLayout';

function ExpertManagement() {
  console.log('ExpertManagement component rendered');
  const navigate = useNavigate();

  return (
    <BaseLayout role="expert">
      <Box sx={{ 
        minHeight: '100vh',
        background: '#000',
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url('/background.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        color: 'white',
        pt: 4,
      }}>
        {/* Main Content */}
        <Container maxWidth="lg" sx={{ pt: 5, pb: 10 }}>
          <Box sx={{ mb: 6 }}>
            <Typography 
              variant="h3" 
              component="h1" 
              sx={{ 
                color: '#00E5FF', 
                fontWeight: 'bold',
                textAlign: 'center',
                mb: 2,
                textShadow: '0 0 20px rgba(0, 229, 255, 0.5)',
              }}
            >
              Lecture Management
            </Typography>
            <Typography 
              variant="h6" 
              component="p" 
              sx={{ 
                color: 'white',
                textAlign: 'center',
                maxWidth: '800px',
                mx: 'auto',
              }}
            >
              Create, schedule, and manage your lectures to help students discover their path to success
            </Typography>
          </Box>

          <Grid container spacing={4} justifyContent="center">
            {/* View Lectures Card */}
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 4, 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  background: 'rgba(0, 0, 0, 0.6)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  border: '1px solid rgba(0, 229, 255, 0.3)',
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0 0 20px rgba(0, 229, 255, 0.5)',
                    cursor: 'pointer',
                  },
                }}
                onClick={() => navigate('/view-lectures')}
              >
                <VisibilityIcon sx={{ fontSize: 80, color: '#00E5FF', mb: 3 }} />
                <Typography variant="h4" component="h2" sx={{ color: 'white', mb: 2 }}>
                  View Lectures
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3 }}>
                  View, edit and manage your scheduled lectures
                </Typography>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    color: '#00E5FF',
                    borderColor: '#00E5FF',
                    '&:hover': {
                      borderColor: '#00E5FF',
                      backgroundColor: 'rgba(0, 229, 255, 0.1)',
                    },
                    px: 4,
                    borderRadius: 2,
                  }}
                >
                  View Lectures
                </Button>
              </Paper>
            </Grid>

            {/* Schedule Lecture Card */}
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 4, 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  background: 'rgba(0, 0, 0, 0.6)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  border: '1px solid rgba(0, 229, 255, 0.3)',
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0 0 20px rgba(0, 229, 255, 0.5)',
                    cursor: 'pointer',
                  },
                }}
                onClick={() => navigate('/schedule-lecture')}
              >
                <ScheduleIcon sx={{ fontSize: 80, color: '#00E5FF', mb: 3 }} />
                <Typography variant="h4" component="h2" sx={{ color: 'white', mb: 2 }}>
                  Schedule Lecture
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3 }}>
                  Create and schedule new lectures for students
                </Typography>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    color: '#00E5FF',
                    borderColor: '#00E5FF',
                    '&:hover': {
                      borderColor: '#00E5FF',
                      backgroundColor: 'rgba(0, 229, 255, 0.1)',
                    },
                    px: 4,
                    borderRadius: 2,
                  }}
                >
                  Schedule New Lecture
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </BaseLayout>
  );
}

export default ExpertManagement; 
