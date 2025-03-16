import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Chip,
  Avatar,
  keyframes,
} from '@mui/material';
import {
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  Storage as StorageIcon,
  ManageAccounts as ManagementIcon,
  Analytics as AnalyticsIcon,
  Assignment as AssignmentIcon,
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import BaseLayout from '../Layout/BaseLayout';

// Define keyframes for animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

function AdminDashboard() {
  const navigate = useNavigate();
  // const auth = useSelector((state) => state.auth);

  // Mock data
  const adminName = "John";
  const adminTitle = "System Administrator";

  const adminStats = {
    totalUsers: 150,
    totalQuestionnaires: 120,
    activeUsers: 45,
  };

  const popularMajors = [
    { id: 1, name: 'Computer Science', count: 25 },
    { id: 2, name: 'Engineering', count: 20 },
    { id: 3, name: 'Business', count: 15 },
  ];

  const recentActivities = [
    { id: 1, action: 'New expert registration approved', time: '1 hour ago' },
    { id: 2, action: 'System maintenance completed', time: '3 hours ago' },
    { id: 3, action: 'Updated questionnaire database', time: '1 day ago' },
  ];

  return (
    <BaseLayout role="admin">
      <Box sx={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        minHeight: '100vh',
        width: '100%',
        margin: 0,
        padding: 0,
        background: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url('/background.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        display: 'flex',
        alignItems: 'flex-start',
        color: 'white',
        overflowY: 'auto',
        zIndex: 0,
        paddingBottom: '100px',
      }}>
        <Container maxWidth="lg" sx={{ py: 6 }}>
          {/* Hero Section */}
          <Box sx={{ 
            mb: 6,
            animation: `${fadeInUp} 1s ease-out`,
          }}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={7}>
                <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                  <Typography 
                    variant="h2" 
                    sx={{ 
                      color: '#00E5FF',
                      fontWeight: 800,
                      mb: 2,
                      fontSize: { xs: '2.5rem', md: '3.5rem' },
                      textShadow: '0 0 20px rgba(0, 229, 255, 0.5)',
                    }}
                  >
                    Welcome, {adminName}
                  </Typography>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.9)',
                      mb: 4,
                      fontWeight: 500,
                    }}
                  >
                    {adminTitle} | Managing the platform for optimal performance
                  </Typography>
                  <Box sx={{ 
                    display: 'flex',
                    gap: 2,
                    justifyContent: { xs: 'center', md: 'flex-start' },
                    flexWrap: 'wrap',
                  }}>
                    <Button 
                      variant="contained" 
                      startIcon={<ManagementIcon />}
                      onClick={() => navigate('/management')}
                      sx={{ 
                        borderRadius: 2,
                        px: 3,
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 600,
                        background: 'rgba(0, 229, 255, 0.9)',
                        '&:hover': {
                          background: 'rgba(0, 229, 255, 1)',
                        },
                        animation: `${fadeInUp} 1s ease-out 0.2s both`,
                      }}
                    >
                      User Management
                    </Button>
                    <Button 
                      variant="outlined" 
                      startIcon={<AnalyticsIcon />}
                      onClick={() => navigate('/admin/test-analysis')}
                      sx={{ 
                        borderRadius: 2,
                        px: 3,
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 600,
                        borderWidth: 2,
                        color: '#00E5FF',
                        borderColor: 'rgba(0, 229, 255, 0.5)',
                        '&:hover': {
                          borderColor: '#00E5FF',
                          background: 'rgba(0, 229, 255, 0.1)',
                        },
                        animation: `${fadeInUp} 1s ease-out 0.3s both`,
                      }}
                    >
                      Test Analysis
                    </Button>
                  </Box>
                </Box>
              </Grid>
              
              {/* Profile Avatar */}
              <Grid item xs={12} md={5} sx={{ 
                textAlign: 'center',
                animation: `${fadeInUp} 1s ease-out 0.4s both`,
              }}>
                <Avatar
                  sx={{
                    width: { xs: 150, md: 200 },
                    height: { xs: 150, md: 200 },
                    margin: '0 auto',
                    bgcolor: 'rgba(0, 229, 255, 0.2)',
                    border: '5px solid rgba(0, 229, 255, 0.3)',
                    boxShadow: '0 0 30px rgba(0, 229, 255, 0.3)',
                    fontSize: { xs: '3rem', md: '4rem' },
                    fontWeight: 600,
                    color: '#00E5FF',
                  }}
                >
                  {adminName[0]}
                </Avatar>
              </Grid>
            </Grid>
          </Box>

          {/* Stats Section */}
          <Grid container spacing={4} sx={{ mb: 6, animation: `${fadeInUp} 1s ease-out 0.2s both` }}>
            <Grid item xs={12} md={4}>
              <Card 
                sx={{ 
                  height: '100%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 0 20px rgba(0, 229, 255, 0.3)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <PeopleIcon sx={{ fontSize: 40, color: '#00E5FF', mr: 2 }} />
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        color: '#ffffff',
                        fontWeight: 600,
                      }}
                    >
                      Total Users
                    </Typography>
                  </Box>
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      mb: 2,
                      color: '#00E5FF',
                      fontWeight: 700,
                    }}
                  >
                    {adminStats.totalUsers}
                  </Typography>
                  <Button 
                    variant="text" 
                    onClick={() => navigate('/management')}
                    sx={{ 
                      fontWeight: 600,
                      color: 'rgba(255, 255, 255, 0.9)',
                      '&:hover': {
                        color: '#00E5FF',
                      }
                    }}
                  >
                    View Users
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card 
                sx={{ 
                  height: '100%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 0 20px rgba(0, 229, 255, 0.3)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <AssessmentIcon sx={{ fontSize: 40, color: '#00E5FF', mr: 2 }} />
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        color: '#ffffff',
                        fontWeight: 600,
                      }}
                    >
                      Total Questionnaires
                    </Typography>
                  </Box>
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      mb: 2,
                      color: '#00E5FF',
                      fontWeight: 700,
                    }}
                  >
                    {adminStats.totalQuestionnaires}
                  </Typography>
                  <Button 
                    variant="text" 
                    onClick={() => navigate('/admin/test-analysis')}
                    sx={{ 
                      fontWeight: 600,
                      color: 'rgba(255, 255, 255, 0.9)',
                      '&:hover': {
                        color: '#00E5FF',
                      }
                    }}
                  >
                    View Analysis
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card 
                sx={{ 
                  height: '100%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 0 20px rgba(0, 229, 255, 0.3)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <TrendingUpIcon sx={{ fontSize: 40, color: '#00E5FF', mr: 2 }} />
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        color: '#ffffff',
                        fontWeight: 600,
                      }}
                    >
                      Active Users
                    </Typography>
                  </Box>
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      mb: 2,
                      color: '#00E5FF',
                      fontWeight: 700,
                    }}
                  >
                    {adminStats.activeUsers}
                  </Typography>
                  <Button 
                    variant="text" 
                    onClick={() => navigate('/admin/data-display')}
                    sx={{ 
                      fontWeight: 600,
                      color: 'rgba(255, 255, 255, 0.9)',
                      '&:hover': {
                        color: '#00E5FF',
                      }
                    }}
                  >
                    View Analytics
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Activity and Popular Majors Section */}
          <Grid container spacing={4} sx={{ animation: `${fadeInUp} 1s ease-out 0.4s both` }}>
            {/* Recent Activities */}
            <Grid item xs={12} md={6}>
              <Card 
                sx={{ 
                  height: '100%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <AssignmentIcon sx={{ fontSize: 40, color: '#00E5FF', mr: 2 }} />
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        color: '#ffffff',
                        fontWeight: 600,
                      }}
                    >
                      Recent Activities
                    </Typography>
                  </Box>
                  <List>
                    {recentActivities.map((activity, index) => (
                      <ListItem 
                        key={activity.id}
                        sx={{ 
                          py: 1.5,
                          px: 2,
                          borderRadius: 1,
                          mb: 1,
                          background: 'rgba(255, 255, 255, 0.05)',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            background: 'rgba(255, 255, 255, 0.1)',
                          },
                          animation: `${slideInRight} 1s ease-out ${0.9 + index * 0.1}s both`,
                        }}
                      >
                        <ListItemIcon>
                          <AssignmentIcon sx={{ color: '#00E5FF' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={activity.action}
                          secondary={activity.time}
                          primaryTypographyProps={{ color: 'white' }}
                          secondaryTypographyProps={{ color: 'rgba(255, 255, 255, 0.7)' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Popular Majors */}
            <Grid item xs={12} md={6}>
              <Card 
                sx={{ 
                  height: '100%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <SchoolIcon sx={{ fontSize: 40, color: '#00E5FF', mr: 2 }} />
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        color: '#ffffff',
                        fontWeight: 600,
                      }}
                    >
                      Popular Majors
                    </Typography>
                  </Box>
                  <List>
                    {popularMajors.map((major, index) => (
                      <ListItem 
                        key={major.id}
                        sx={{ 
                          py: 1.5,
                          px: 2,
                          borderRadius: 1,
                          mb: 1,
                          background: 'rgba(255, 255, 255, 0.05)',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            background: 'rgba(255, 255, 255, 0.1)',
                          },
                          animation: `${slideInRight} 1s ease-out ${0.9 + index * 0.1}s both`,
                        }}
                      >
                        <ListItemIcon>
                          <SchoolIcon sx={{ color: '#00E5FF' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={major.name}
                          secondary={
                            <Chip 
                              label={`${major.count} Students`}
                              size="small"
                              sx={{ 
                                mt: 1,
                                backgroundColor: 'rgba(0, 229, 255, 0.1)',
                                color: '#00E5FF',
                                borderRadius: 1,
                              }}
                            />
                          }
                          primaryTypographyProps={{ color: 'white' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </BaseLayout>
  );
}

export default AdminDashboard; 
