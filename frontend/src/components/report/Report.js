import React from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
  Container,
  keyframes,
} from '@mui/material';
import {
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
  WorkOutline as WorkIcon,
  Psychology as PsychologyIcon,
  Star as StarIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Assessment as AssessmentIcon,
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

// Mock data - Replace with actual data from your backend
const mockReportData = {
  recommendedMajor: 'Computer Science',
  matchScore: 85,
  alternativeMajors: [
    { name: 'Software Engineering', score: 80 },
    { name: 'Information Technology', score: 75 },
    { name: 'Data Science', score: 70 },
  ],
  strengths: [
    'Strong analytical skills',
    'Problem-solving ability',
    'Technical aptitude',
    'Mathematical proficiency',
  ],
  careerPaths: [
    {
      title: 'Software Developer',
      description: 'Design and develop software applications',
      growthRate: '22%',
      salary: '$105,000',
    },
    {
      title: 'Systems Analyst',
      description: 'Analyze and optimize computer systems',
      growthRate: '18%',
      salary: '$95,000',
    },
    {
      title: 'Database Administrator',
      description: 'Manage and secure databases',
      growthRate: '15%',
      salary: '$98,000',
    },
  ],
  recommendations: [
    'Consider taking advanced programming courses',
    'Participate in coding competitions',
    'Join computer science clubs or organizations',
    'Look for internship opportunities in software development',
  ],
};

function MatchScore({ score }) {
  const getScoreColor = (score) => {
    if (score >= 80) return '#00E5FF';
    if (score >= 60) return '#FFD700';
    return '#FF6B6B';
  };

  return (
    <Box sx={{ mb: 4, animation: `${fadeInUp} 1s ease-out 0.2s both` }}>
      <Typography 
        variant="h6" 
        gutterBottom
        sx={{ 
          color: '#ffffff',
          fontWeight: 600,
          mb: 2,
        }}
      >
        Match Score
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Box sx={{ flexGrow: 1, mr: 2 }}>
          <LinearProgress
            variant="determinate"
            value={score}
            sx={{ 
              height: 10, 
              borderRadius: 5,
              background: 'rgba(255, 255, 255, 0.1)',
              '& .MuiLinearProgress-bar': {
                background: `linear-gradient(90deg, ${getScoreColor(score)}, ${getScoreColor(score)}CC)`,
              }
            }}
          />
        </Box>
        <Typography 
          variant="body1" 
          sx={{ 
            color: getScoreColor(score),
            fontWeight: 'bold',
          }}
        >
          {score}%
        </Typography>
      </Box>
    </Box>
  );
}

function ReportContent() {
  const reportData = mockReportData; // Replace with actual data from your Redux store

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography 
        variant="h3" 
        sx={{ 
          mb: 4,
          color: '#00E5FF',
          fontWeight: 800,
          textAlign: 'center',
          textShadow: '0 0 20px rgba(0, 229, 255, 0.5)',
          animation: `${fadeInUp} 1s ease-out`,
        }}
      >
        Your Career Assessment Report
      </Typography>

      <Grid container spacing={4}>
        {/* Main Recommendation */}
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
              animation: `${fadeInUp} 1s ease-out 0.1s both`,
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <SchoolIcon sx={{ fontSize: 40, color: '#00E5FF', mr: 2 }} />
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: '#ffffff',
                    fontWeight: 600,
                  }}
                >
                  Recommended Major
                </Typography>
              </Box>
              <Typography 
                variant="h4" 
                sx={{ 
                  mb: 3,
                  color: '#00E5FF',
                  fontWeight: 700,
                }}
              >
                {reportData.recommendedMajor}
              </Typography>
              <MatchScore score={reportData.matchScore} />
              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  mb: 2,
                  fontSize: '1rem',
                }}
              >
                Based on your assessment, we've determined that {reportData.recommendedMajor} is the best match for your interests, skills, and career goals.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Alternative Majors */}
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
              animation: `${fadeInUp} 1s ease-out 0.2s both`,
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <TrendingUpIcon sx={{ fontSize: 40, color: '#00E5FF', mr: 2 }} />
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: '#ffffff',
                    fontWeight: 600,
                  }}
                >
                  Alternative Majors
                </Typography>
              </Box>
              <List>
                {reportData.alternativeMajors.map((major, index) => (
                  <ListItem 
                    key={index}
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
                      animation: `${slideInRight} 1s ease-out ${0.3 + index * 0.1}s both`,
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            color: '#ffffff',
                            fontWeight: 500,
                            fontSize: '1.1rem',
                          }}
                        >
                          {major.name}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <Box sx={{ flexGrow: 1, mr: 2 }}>
                            <LinearProgress
                              variant="determinate"
                              value={major.score}
                              sx={{ 
                                height: 6, 
                                borderRadius: 3,
                                background: 'rgba(255, 255, 255, 0.1)',
                                '& .MuiLinearProgress-bar': {
                                  background: 'linear-gradient(90deg, #00E5FF, #2979FF)',
                                }
                              }}
                            />
                          </Box>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: '#00E5FF',
                              fontWeight: 'bold',
                              fontSize: '0.9rem',
                            }}
                          >
                            {major.score}%
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Strengths */}
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
              animation: `${fadeInUp} 1s ease-out 0.3s both`,
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <StarIcon sx={{ fontSize: 40, color: '#00E5FF', mr: 2 }} />
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: '#ffffff',
                    fontWeight: 600,
                  }}
                >
                  Your Strengths
                </Typography>
              </Box>
              <List>
                {reportData.strengths.map((strength, index) => (
                  <ListItem 
                    key={index}
                    sx={{ 
                      py: 1.5,
                      animation: `${slideInRight} 1s ease-out ${0.4 + index * 0.1}s both`,
                    }}
                  >
                    <ListItemIcon>
                      <StarIcon sx={{ color: '#00E5FF', fontSize: '1.3rem' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontSize: '1rem',
                          }}
                        >
                          {strength}
                        </Typography>
                      } 
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Career Paths */}
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
              animation: `${fadeInUp} 1s ease-out 0.4s both`,
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <WorkIcon sx={{ fontSize: 40, color: '#00E5FF', mr: 2 }} />
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: '#ffffff',
                    fontWeight: 600,
                  }}
                >
                  Potential Career Paths
                </Typography>
              </Box>
              {reportData.careerPaths.map((career, index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    mb: 3,
                    p: 2,
                    borderRadius: 2,
                    background: 'rgba(255, 255, 255, 0.05)',
                    animation: `${slideInRight} 1s ease-out ${0.5 + index * 0.1}s both`,
                  }}
                >
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#00E5FF',
                      fontWeight: 600,
                      mb: 1,
                      fontSize: '1.1rem',
                    }}
                  >
                    {career.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)',
                      mb: 2,
                      fontSize: '0.9rem',
                    }}
                  >
                    {career.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                    <Chip 
                      label={`Growth: ${career.growthRate}`} 
                      size="small" 
                      sx={{ 
                        background: 'rgba(0, 229, 255, 0.2)',
                        color: '#00E5FF',
                        fontWeight: 500,
                        fontSize: '0.85rem',
                      }} 
                    />
                    <Chip 
                      label={`Avg. Salary: ${career.salary}`} 
                      size="small" 
                      sx={{ 
                        background: 'rgba(0, 229, 255, 0.2)',
                        color: '#00E5FF',
                        fontWeight: 500,
                        fontSize: '0.85rem',
                      }} 
                    />
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Recommendations */}
        <Grid item xs={12}>
          <Card 
            sx={{ 
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
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <PsychologyIcon sx={{ fontSize: 40, color: '#00E5FF', mr: 2 }} />
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: '#ffffff',
                    fontWeight: 600,
                  }}
                >
                  Recommendations
                </Typography>
              </Box>
              <Grid container spacing={2}>
                {reportData.recommendations.map((recommendation, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box 
                      sx={{ 
                        display: 'flex',
                        alignItems: 'flex-start',
                        p: 2,
                        borderRadius: 2,
                        background: 'rgba(255, 255, 255, 0.05)',
                        height: '100%',
                        animation: `${slideInRight} 1s ease-out ${0.6 + index * 0.1}s both`,
                      }}
                    >
                      <Box 
                        sx={{ 
                          bgcolor: 'rgba(0, 229, 255, 0.2)',
                          color: '#00E5FF',
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2,
                          fontWeight: 'bold',
                          flexShrink: 0,
                          fontSize: '0.9rem',
                        }}
                      >
                        {index + 1}
                      </Box>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontSize: '1rem',
                        }}
                      >
                        {recommendation}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          mt: 6, 
          gap: 2,
          animation: `${fadeInUp} 1s ease-out 0.7s both`,
        }}
      >
        <Button 
          variant="contained" 
          startIcon={<DownloadIcon />}
          sx={{ 
            background: 'rgba(0, 229, 255, 0.9)',
            px: 3,
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 600,
            '&:hover': {
              background: 'rgba(0, 229, 255, 1)',
            },
          }}
        >
          Download Report
        </Button>
        <Button 
          variant="outlined" 
          startIcon={<PrintIcon />}
          sx={{ 
            color: '#00E5FF',
            borderColor: 'rgba(0, 229, 255, 0.5)',
            px: 3,
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 600,
            '&:hover': {
              borderColor: '#00E5FF',
              background: 'rgba(0, 229, 255, 0.1)',
            },
          }}
        >
          Print Report
        </Button>
      </Box>
    </Container>
  );
}

function Report() {
  const { role } = useSelector((state) => state.auth);
  
  return (
    <BaseLayout role={role}>
      <Box sx={{ 
        minHeight: '100vh',
        background: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url('/background.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        color: 'white',
        pb: 7,
      }}>
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Typography 
            variant="h3" 
            sx={{ 
              mb: 4,
              color: '#00E5FF',
              fontWeight: 800,
              textAlign: 'center',
              textShadow: '0 0 20px rgba(0, 229, 255, 0.5)',
              animation: `${fadeInUp} 1s ease-out`,
            }}
          >
            Your Career Assessment Report
          </Typography>

          <Grid container spacing={4}>
            {/* Main Recommendation */}
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
                  animation: `${fadeInUp} 1s ease-out 0.1s both`,
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <SchoolIcon sx={{ fontSize: 40, color: '#00E5FF', mr: 2 }} />
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        color: '#ffffff',
                        fontWeight: 600,
                      }}
                    >
                      Recommended Major
                    </Typography>
                  </Box>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      mb: 3,
                      color: '#00E5FF',
                      fontWeight: 700,
                    }}
                  >
                    {mockReportData.recommendedMajor}
                  </Typography>
                  <MatchScore score={mockReportData.matchScore} />
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)',
                      mb: 2,
                      fontSize: '1rem',
                    }}
                  >
                    Based on your assessment, we've determined that {mockReportData.recommendedMajor} is the best match for your interests, skills, and career goals.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Alternative Majors */}
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
                  animation: `${fadeInUp} 1s ease-out 0.2s both`,
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <TrendingUpIcon sx={{ fontSize: 40, color: '#00E5FF', mr: 2 }} />
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        color: '#ffffff',
                        fontWeight: 600,
                      }}
                    >
                      Alternative Majors
                    </Typography>
                  </Box>
                  <List>
                    {mockReportData.alternativeMajors.map((major, index) => (
                      <ListItem 
                        key={index}
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
                          animation: `${slideInRight} 1s ease-out ${0.3 + index * 0.1}s both`,
                        }}
                      >
                        <ListItemText
                          primary={
                            <Typography 
                              variant="h6" 
                              sx={{ 
                                color: '#ffffff',
                                fontWeight: 500,
                                fontSize: '1.1rem',
                              }}
                            >
                              {major.name}
                            </Typography>
                          }
                          secondary={
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                              <Box sx={{ flexGrow: 1, mr: 2 }}>
                                <LinearProgress
                                  variant="determinate"
                                  value={major.score}
                                  sx={{ 
                                    height: 6, 
                                    borderRadius: 3,
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    '& .MuiLinearProgress-bar': {
                                      background: 'linear-gradient(90deg, #00E5FF, #2979FF)',
                                    }
                                  }}
                                />
                              </Box>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: '#00E5FF',
                                  fontWeight: 'bold',
                                  fontSize: '0.9rem',
                                }}
                              >
                                {major.score}%
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Strengths */}
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
                  animation: `${fadeInUp} 1s ease-out 0.3s both`,
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <StarIcon sx={{ fontSize: 40, color: '#00E5FF', mr: 2 }} />
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        color: '#ffffff',
                        fontWeight: 600,
                      }}
                    >
                      Your Strengths
                    </Typography>
                  </Box>
                  <List>
                    {mockReportData.strengths.map((strength, index) => (
                      <ListItem 
                        key={index}
                        sx={{ 
                          py: 1.5,
                          animation: `${slideInRight} 1s ease-out ${0.4 + index * 0.1}s both`,
                        }}
                      >
                        <ListItemIcon>
                          <StarIcon sx={{ color: '#00E5FF', fontSize: '1.3rem' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={
                            <Typography 
                              variant="body1" 
                              sx={{ 
                                color: 'rgba(255, 255, 255, 0.9)',
                                fontSize: '1rem',
                              }}
                            >
                              {strength}
                            </Typography>
                          } 
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Career Paths */}
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
                  animation: `${fadeInUp} 1s ease-out 0.4s both`,
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <WorkIcon sx={{ fontSize: 40, color: '#00E5FF', mr: 2 }} />
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        color: '#ffffff',
                        fontWeight: 600,
                      }}
                    >
                      Potential Career Paths
                    </Typography>
                  </Box>
                  {mockReportData.careerPaths.map((career, index) => (
                    <Box 
                      key={index} 
                      sx={{ 
                        mb: 3,
                        p: 2,
                        borderRadius: 2,
                        background: 'rgba(255, 255, 255, 0.05)',
                        animation: `${slideInRight} 1s ease-out ${0.5 + index * 0.1}s both`,
                      }}
                    >
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          color: '#00E5FF',
                          fontWeight: 600,
                          mb: 1,
                          fontSize: '1.1rem',
                        }}
                      >
                        {career.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: 'rgba(255, 255, 255, 0.7)',
                          mb: 2,
                          fontSize: '0.9rem',
                        }}
                      >
                        {career.description}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                        <Chip 
                          label={`Growth: ${career.growthRate}`} 
                          size="small" 
                          sx={{ 
                            background: 'rgba(0, 229, 255, 0.2)',
                            color: '#00E5FF',
                            fontWeight: 500,
                            fontSize: '0.85rem',
                          }} 
                        />
                        <Chip 
                          label={`Avg. Salary: ${career.salary}`} 
                          size="small" 
                          sx={{ 
                            background: 'rgba(0, 229, 255, 0.2)',
                            color: '#00E5FF',
                            fontWeight: 500,
                            fontSize: '0.85rem',
                          }} 
                        />
                      </Box>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>

            {/* Recommendations */}
            <Grid item xs={12}>
              <Card 
                sx={{ 
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
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <PsychologyIcon sx={{ fontSize: 40, color: '#00E5FF', mr: 2 }} />
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        color: '#ffffff',
                        fontWeight: 600,
                      }}
                    >
                      Recommendations
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    {mockReportData.recommendations.map((recommendation, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <Box 
                          sx={{ 
                            display: 'flex',
                            alignItems: 'flex-start',
                            p: 2,
                            borderRadius: 2,
                            background: 'rgba(255, 255, 255, 0.05)',
                            height: '100%',
                            animation: `${slideInRight} 1s ease-out ${0.6 + index * 0.1}s both`,
                          }}
                        >
                          <Box 
                            sx={{ 
                              bgcolor: 'rgba(0, 229, 255, 0.2)',
                              color: '#00E5FF',
                              width: 28,
                              height: 28,
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mr: 2,
                              fontWeight: 'bold',
                              flexShrink: 0,
                              fontSize: '0.9rem',
                            }}
                          >
                            {index + 1}
                          </Box>
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              color: 'rgba(255, 255, 255, 0.9)',
                              fontSize: '1rem',
                            }}
                          >
                            {recommendation}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Action Buttons */}
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mt: 6, 
              gap: 2,
              animation: `${fadeInUp} 1s ease-out 0.7s both`,
            }}
          >
            <Button 
              variant="contained" 
              startIcon={<DownloadIcon />}
              sx={{ 
                background: 'rgba(0, 229, 255, 0.9)',
                px: 3,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                '&:hover': {
                  background: 'rgba(0, 229, 255, 1)',
                },
              }}
            >
              Download Report
            </Button>
            <Button 
              variant="outlined" 
              startIcon={<PrintIcon />}
              sx={{ 
                color: '#00E5FF',
                borderColor: 'rgba(0, 229, 255, 0.5)',
                px: 3,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                '&:hover': {
                  borderColor: '#00E5FF',
                  background: 'rgba(0, 229, 255, 0.1)',
                },
              }}
            >
              Print Report
            </Button>
          </Box>
        </Container>
      </Box>
    </BaseLayout>
  );
}

export default Report; 
