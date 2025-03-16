import React, { useState, useEffect } from 'react';
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
  Divider,
  Button,
  Paper,
  Chip,
  keyframes,
  Avatar,
  CircularProgress,
} from '@mui/material';
import {
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  Assessment as AssessmentIcon,
  Event as EventIcon,
  School as SchoolIcon,
  Forum as ForumIcon,
  Add as AddIcon,
  Announcement as AnnouncementIcon,
} from '@mui/icons-material';
import BaseLayout from '../Layout/BaseLayout';
import { getAllLectures } from '../../services/lectureService';
import { getUserProfile } from '../../services/userService';

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

function ExpertHome() {
  const navigate = useNavigate();
  const { role, user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [expertName, setExpertName] = useState("");
  const [expertTitle, setExpertTitle] = useState("Career Guidance Expert");
  const [expertStats, setExpertStats] = useState({
    scheduledLectures: 0,
    totalStudents: 0,
    completedLectures: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingLectures, setUpcomingLectures] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch user profile if not available in redux store
        let userProfile = user;
        if (!userProfile || !userProfile.first_name) {
          const profileData = await getUserProfile();
          userProfile = profileData;
        }
        
        // Set expert name and title
        setExpertName(userProfile.first_name || userProfile.email.split('@')[0]);
        setExpertTitle(userProfile.expertise ? userProfile.expertise : "Career Guidance Expert");
        
        // Fetch all lectures
        const lectures = await getAllLectures();
        
        // Filter lectures by the current expert
        const expertLectures = lectures.filter(lecture => 
          lecture.expert && lecture.expert.id === userProfile.id
        );
        
        // Count scheduled (upcoming) lectures
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const scheduledLectures = expertLectures.filter(lecture => {
          const lectureDate = new Date(lecture.date);
          lectureDate.setHours(0, 0, 0, 0);
          return lectureDate >= today && lecture.status === 'Upcoming';
        });
        
        // Count completed lectures
        const completedLectures = expertLectures.filter(lecture => 
          lecture.status === 'Completed'
        );
        
        // Count total unique students across all lectures
        const uniqueStudentIds = new Set();
        expertLectures.forEach(lecture => {
          // Use registration_count as an approximation if we don't have detailed registration data
          if (lecture.registration_count) {
            // This is just an approximation since we don't have the actual student IDs
            for (let i = 0; i < lecture.registration_count; i++) {
              uniqueStudentIds.add(`lecture-${lecture.id}-student-${i}`);
            }
          }
        });
        
        // Format upcoming lectures for display
        const formattedUpcomingLectures = scheduledLectures.slice(0, 3).map(lecture => {
          const lectureDate = new Date(lecture.date);
          const options = { weekday: 'long', month: 'long', day: 'numeric' };
          const formattedDate = lectureDate.toLocaleDateString('en-US', options);
          
          return {
            id: lecture.id,
            title: lecture.title,
            attendees: lecture.registration_count || 0,
            time: `${formattedDate}, ${lecture.start_time}`,
          };
        });
        
        // Create recent activities based on lecture creations and updates
        const activities = [];
        
        // Sort lectures by created_at or updated_at date (most recent first)
        const sortedLectures = [...expertLectures].sort((a, b) => {
          const dateA = new Date(a.updated_at || a.created_at);
          const dateB = new Date(b.updated_at || b.created_at);
          return dateB - dateA;
        });
        
        // Add lecture creation/update activities
        sortedLectures.slice(0, 3).forEach(lecture => {
          const date = new Date(lecture.updated_at || lecture.created_at);
          const daysAgo = Math.floor((today - date) / (1000 * 60 * 60 * 24));
          const timeAgo = daysAgo === 0 ? 'Today' : daysAgo === 1 ? 'Yesterday' : `${daysAgo} days ago`;
          
          activities.push({
            id: `lecture-${lecture.id}`,
            action: `${lecture.updated_at !== lecture.created_at ? 'Updated' : 'Created'} lecture: ${lecture.title}`,
            time: timeAgo,
          });
        });
        
        // Update state with fetched data
        setExpertStats({
          scheduledLectures: scheduledLectures.length,
          totalStudents: uniqueStudentIds.size,
          completedLectures: completedLectures.length,
        });
        
        setUpcomingLectures(formattedUpcomingLectures);
        setRecentActivities(activities.length > 0 ? activities : [
          { id: 1, action: 'No recent activities', time: '' },
        ]);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);
  
  // Show loading state while fetching data
  if (loading) {
    return (
      <BaseLayout role={role}>
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
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}>
          <CircularProgress size={60} sx={{ color: '#00E5FF' }} />
        </Box>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout role={role}>
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
                    Welcome, {expertName}
                  </Typography>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.9)',
                      mb: 4,
                      fontWeight: 500,
                    }}
                  >
                    {expertTitle} | Guiding students towards their ideal career paths
                  </Typography>
                  <Box sx={{ 
                    display: 'flex',
                    gap: 2,
                    justifyContent: { xs: 'center', md: 'flex-start' },
                    flexWrap: 'wrap',
                  }}>
                    <Button 
                      variant="contained" 
                      startIcon={<AddIcon />}
                      onClick={() => navigate('/schedule-lecture')}
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
                      Create Lecture
                    </Button>
                    <Button 
                      variant="outlined" 
                      startIcon={<AnnouncementIcon />}
                      onClick={() => navigate('/post-announcement')}
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
                      Post Announcement
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
                  {expertName.split(' ').map(n => n[0]).join('')}
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
                    <EventIcon sx={{ fontSize: 40, color: '#00E5FF', mr: 2 }} />
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        color: '#ffffff',
                        fontWeight: 600,
                      }}
                    >
                      Scheduled Lectures
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
                    {expertStats.scheduledLectures}
                  </Typography>
                  <Button 
                    variant="text" 
                    onClick={() => navigate('/lectures')}
                    sx={{ 
                      fontWeight: 600,
                      color: 'rgba(255, 255, 255, 0.9)',
                      '&:hover': {
                        color: '#00E5FF',
                      }
                    }}
                  >
                    View Schedule
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
                    <PeopleIcon sx={{ fontSize: 40, color: '#00E5FF', mr: 2 }} />
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        color: '#ffffff',
                        fontWeight: 600,
                      }}
                    >
                      Total Students
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
                    {expertStats.totalStudents}
                  </Typography>
                  <Button 
                    variant="text" 
                    onClick={() => navigate('/students')}
                    sx={{ 
                      fontWeight: 600,
                      color: 'rgba(255, 255, 255, 0.9)',
                      '&:hover': {
                        color: '#00E5FF',
                      }
                    }}
                  >
                    View Students
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
                    <SchoolIcon sx={{ fontSize: 40, color: '#00E5FF', mr: 2 }} />
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        color: '#ffffff',
                        fontWeight: 600,
                      }}
                    >
                      Completed Lectures
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
                    {expertStats.completedLectures}
                  </Typography>
                  <Button 
                    variant="text" 
                    onClick={() => navigate('/lectures')}
                    sx={{ 
                      fontWeight: 600,
                      color: 'rgba(255, 255, 255, 0.9)',
                      '&:hover': {
                        color: '#00E5FF',
                      }
                    }}
                  >
                    View History
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Activity and Schedule Section */}
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
                          animation: `${slideInRight} 1s ease-out ${0.5 + index * 0.1}s both`,
                        }}
                      >
                        <ListItemIcon>
                          <AssignmentIcon sx={{ color: '#00E5FF' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={
                            <Typography 
                              variant="body1" 
                              sx={{ 
                                color: 'rgba(255, 255, 255, 0.9)',
                                fontWeight: 500,
                              }}
                            >
                              {activity.action}
                            </Typography>
                          }
                          secondary={
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: 'rgba(255, 255, 255, 0.6)',
                              }}
                            >
                              {activity.time}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Upcoming Lectures */}
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
                    <EventIcon sx={{ fontSize: 40, color: '#00E5FF', mr: 2 }} />
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        color: '#ffffff',
                        fontWeight: 600,
                      }}
                    >
                      Upcoming Lectures
                    </Typography>
                  </Box>
                  <List>
                    {upcomingLectures.length > 0 ? (
                      upcomingLectures.map((lecture, index) => (
                        <Paper 
                          key={lecture.id}
                          sx={{ 
                            mb: 2,
                            p: 2,
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: 2,
                            animation: `${slideInRight} 1s ease-out ${0.6 + index * 0.1}s both`,
                          }}
                        >
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              color: '#00E5FF',
                              fontWeight: 600,
                              mb: 1,
                            }}
                          >
                            {lecture.title}
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Chip 
                              label={lecture.time} 
                              size="small" 
                              sx={{ 
                                background: 'rgba(0, 229, 255, 0.2)',
                                color: '#00E5FF',
                                fontWeight: 500,
                              }} 
                            />
                            <Chip 
                              icon={<PeopleIcon sx={{ fontSize: '1rem !important', color: '#00E5FF !important' }} />}
                              label={`${lecture.attendees} Students`} 
                              size="small" 
                              sx={{ 
                                background: 'rgba(0, 229, 255, 0.1)',
                                color: '#00E5FF',
                                fontWeight: 500,
                              }} 
                            />
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                            <Button 
                              variant="text" 
                              size="small"
                              onClick={() => navigate(`/lectures/${lecture.id}`)}
                              sx={{ 
                                color: '#00E5FF',
                                '&:hover': {
                                  background: 'rgba(0, 229, 255, 0.1)',
                                }
                              }}
                            >
                              View Details
                            </Button>
                          </Box>
                        </Paper>
                      ))
                    ) : (
                      <Paper 
                        sx={{ 
                          mb: 2,
                          p: 2,
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: 2,
                          animation: `${slideInRight} 1s ease-out 0.6s both`,
                          textAlign: 'center',
                        }}
                      >
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            color: 'rgba(255, 255, 255, 0.7)',
                          }}
                        >
                          No upcoming lectures
                        </Typography>
                      </Paper>
                    )}
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

export default ExpertHome; 
