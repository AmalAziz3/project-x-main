import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  keyframes,
  CircularProgress,
} from '@mui/material';
import {
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Event as EventIcon,
  Message as MessageIcon,
  Assessment as AssessmentIcon,
  PlayArrow as PlayArrowIcon,
  Star as StarIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import BaseLayout from '../Layout/BaseLayout';
import { getUserResults } from '../../services/questionnaireService';
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

function StudentHome() {
  const navigate = useNavigate();
  const { role, user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [studentStats, setStudentStats] = useState({
    completedTests: 0,
    upcomingLectures: 0,
    unreadMessages: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingLectures, setUpcomingLectures] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [studentTitle, setStudentTitle] = useState("Student");

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
        
        // Set student name and title
        setStudentName(userProfile.first_name || userProfile.email.split('@')[0]);
        setStudentTitle(userProfile.major ? `${userProfile.major} Student` : "Student");
        
        // Fetch questionnaire results
        const results = await getUserResults();
        
        // Count unique questionnaire submissions instead of all results
        // The API returns multiple results per submission (one for each recommended major)
        // We need to count unique date_taken values to get the actual number of tests completed
        let completedTests = 0;
        if (Array.isArray(results) && results.length > 0) {
          // Use a Set to track unique submission dates
          const uniqueSubmissionDates = new Set();
          
          results.forEach(result => {
            if (result.date_taken) {
              // Extract just the date part (without time) to group submissions from the same test
              const submissionDate = result.date_taken.split('T')[0];
              uniqueSubmissionDates.add(submissionDate);
            }
          });
          
          completedTests = uniqueSubmissionDates.size;
        }
        
        // Fetch lectures
        const lectures = await getAllLectures();
        
        // Filter upcoming lectures (lectures with future dates)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const upcoming = lectures.filter(lecture => {
          const lectureDate = new Date(lecture.date);
          lectureDate.setHours(0, 0, 0, 0);
          return lectureDate >= today && lecture.status === 'Upcoming';
        });
        
        // Format upcoming lectures for display
        const formattedUpcomingLectures = upcoming.slice(0, 3).map(lecture => {
          const lectureDate = new Date(lecture.date);
          const options = { weekday: 'long', month: 'long', day: 'numeric' };
          const formattedDate = lectureDate.toLocaleDateString('en-US', options);
          
          return {
            id: lecture.id,
            title: lecture.title,
            expert: lecture.expert ? `${lecture.expert.first_name} ${lecture.expert.last_name}` : 'TBA',
            time: `${formattedDate}, ${lecture.start_time}`,
          };
        });
        
        // Create recent activities based on test results and lecture registrations
        const activities = [];
        
        // Add test completion activities
        if (Array.isArray(results) && results.length > 0) {
          results.slice(0, 2).forEach(result => {
            const date = new Date(result.date_taken);
            const daysAgo = Math.floor((today - date) / (1000 * 60 * 60 * 24));
            const timeAgo = daysAgo === 0 ? 'Today' : daysAgo === 1 ? 'Yesterday' : `${daysAgo} days ago`;
            
            activities.push({
              id: `test-${result.id}`,
              action: `Completed assessment with ${result.major.name} recommendation`,
              time: timeAgo,
            });
          });
        }
        
        // Add lecture registration activities if available
        // This would require additional API endpoint to get user's lecture registrations
        
        // Update state with fetched data
        setStudentStats({
          completedTests,
          upcomingLectures: upcoming.length,
          unreadMessages: 0, // This would need a separate API endpoint
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
        <Box
          sx={{
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
          }}
        >
          <CircularProgress size={60} sx={{ color: '#00E5FF' }} />
        </Box>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout role={role}>
      <Box
        sx={{
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
        }}
      >
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
                    Welcome, {studentName}
                  </Typography>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.9)',
                      mb: 4,
                      fontWeight: 500,
                    }}
                  >
                    {studentTitle}
                  </Typography>
                  <Box sx={{ 
                    display: 'flex',
                    gap: 2,
                    justifyContent: { xs: 'center', md: 'flex-start' },
                    flexWrap: 'wrap',
                  }}>
                    <Button 
                      variant="contained" 
                      startIcon={<AssignmentIcon />}
                      onClick={() => navigate('/questionnaire')}
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
                      Take Assessment
                    </Button>
                    <Button 
                      variant="outlined" 
                      startIcon={<SchoolIcon />}
                      onClick={() => navigate('/view-lectures')}
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
                      View Lectures
                    </Button>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={5} sx={{ 
                textAlign: 'center',
                animation: `${fadeInUp} 1s ease-out 0.4s both`,
              }}>
                <Avatar
                  src="/avatars/student1.jpg"
                  alt={studentName}
                  sx={{
                    width: { xs: 150, md: 200 },
                    height: { xs: 150, md: 200 },
                    margin: '0 auto',
                    border: '5px solid rgba(0, 229, 255, 0.3)',
                    boxShadow: '0 0 30px rgba(0, 229, 255, 0.3)',
                  }}
                />
              </Grid>
            </Grid>
          </Box>

          {/* Stats Section */}
          <Grid container spacing={4} sx={{ mb: 6 }}>
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
                  animation: `${fadeInUp} 1s ease-out 0.5s both`,
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
                      Tests Completed
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
                    {studentStats.completedTests}
                  </Typography>
                  <Button 
                    variant="text" 
                    onClick={() => navigate('/report')}
                    sx={{ 
                      fontWeight: 600,
                      color: 'rgba(255, 255, 255, 0.9)',
                      '&:hover': {
                        color: '#00E5FF',
                      }
                    }}
                  >
                    View Reports
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
                  animation: `${fadeInUp} 1s ease-out 0.6s both`,
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
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      mb: 2,
                      color: '#00E5FF',
                      fontWeight: 700,
                    }}
                  >
                    {studentStats.upcomingLectures}
                  </Typography>
                  <Button 
                    variant="text" 
                    onClick={() => navigate('/view-lectures')}
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
                  animation: `${fadeInUp} 1s ease-out 0.7s both`,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <MessageIcon sx={{ fontSize: 40, color: '#00E5FF', mr: 2 }} />
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        color: '#ffffff',
                        fontWeight: 600,
                      }}
                    >
                      Unread Messages
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
                    {studentStats.unreadMessages}
                  </Typography>
                  <Button 
                    variant="text" 
                    onClick={() => navigate('/communication')}
                    sx={{ 
                      fontWeight: 600,
                      color: 'rgba(255, 255, 255, 0.9)',
                      '&:hover': {
                        color: '#00E5FF',
                      }
                    }}
                  >
                    View Messages
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Recent Activities and Upcoming Lectures */}
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
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
                  animation: `${fadeInUp} 1s ease-out 0.8s both`,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <TimelineIcon sx={{ fontSize: 40, color: '#00E5FF', mr: 2 }} />
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
                          <StarIcon sx={{ color: '#00E5FF' }} />
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
            <Grid item xs={12} md={6}>
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
                  animation: `${fadeInUp} 1s ease-out 0.9s both`,
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
                        <Box 
                          key={lecture.id} 
                          sx={{ 
                            mb: 2,
                            p: 2,
                            borderRadius: 2,
                            background: 'rgba(255, 255, 255, 0.05)',
                            animation: `${slideInRight} 1s ease-out ${1.0 + index * 0.1}s both`,
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
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: 'rgba(255, 255, 255, 0.7)',
                              mb: 1,
                            }}
                          >
                            {lecture.expert}
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Chip 
                              label={lecture.time} 
                              size="small" 
                              sx={{ 
                                background: 'rgba(0, 229, 255, 0.2)',
                                color: '#00E5FF',
                                fontWeight: 500,
                              }} 
                            />
                            <Button 
                              variant="text" 
                              size="small"
                              startIcon={<PlayArrowIcon />}
                              onClick={() => navigate(`/view-lectures/${lecture.id}`)}
                              sx={{ 
                                color: '#00E5FF',
                                '&:hover': {
                                  background: 'rgba(0, 229, 255, 0.1)',
                                }
                              }}
                            >
                              View
                            </Button>
                          </Box>
                        </Box>
                      ))
                    ) : (
                      <Box 
                        sx={{ 
                          mb: 2,
                          p: 2,
                          borderRadius: 2,
                          background: 'rgba(255, 255, 255, 0.05)',
                          animation: `${slideInRight} 1s ease-out 1.0s both`,
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
                      </Box>
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

export default StudentHome; 
