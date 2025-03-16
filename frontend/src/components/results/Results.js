import React from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  LinearProgress,
  keyframes,
} from '@mui/material';
import {
  School as SchoolIcon,
  Print as PrintIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
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

function ResultsContent() {
  const navigate = useNavigate();
  const { answers, questions } = useSelector((state) => state.questionnaire);
  const { role } = useSelector((state) => state.auth);

  // Calculate completion percentage
  const completedQuestions = Object.keys(answers).length;
  // const completionPercentage = (completedQuestions / questions.length) * 100;

  // Mock result data (replace with actual logic later)
  const result = {
    recommendedMajor: 'Computer Science',
    matchScore: 85,
    explanation: 'Based on your responses, you show a strong aptitude for logical thinking and problem-solving, combined with an interest in technology. Computer Science would be an excellent fit for your skills and interests.',
    alternativeMajors: [
      { name: 'Software Engineering', score: 80 },
      { name: 'Information Technology', score: 75 },
      { name: 'Data Science', score: 70 },
    ],
  };

  const handleRetake = () => {
    navigate('/questionnaire');
  };

  return (
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
          Your Career Assessment Results
        </Typography>

        <Grid container spacing={4}>
          {/* Main Recommendation */}
          <Grid item xs={12} md={8}>
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
                  {result.recommendedMajor}
                </Typography>

                <Box sx={{ mb: 4 }}>
                  <Typography 
                    variant="h6" 
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
                        value={result.matchScore}
                        sx={{ 
                          height: 10, 
                          borderRadius: 5,
                          background: 'rgba(255, 255, 255, 0.1)',
                          '& .MuiLinearProgress-bar': {
                            background: 'linear-gradient(90deg, #00E5FF, #2979FF)',
                          }
                        }}
                      />
                    </Box>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: '#00E5FF',
                        fontWeight: 'bold',
                      }}
                    >
                      {result.matchScore}%
                    </Typography>
                  </Box>
                </Box>

                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)',
                    mb: 4,
                    fontSize: '1rem',
                    lineHeight: 1.6,
                  }}
                >
                  {result.explanation}
                </Typography>

                <Box sx={{ mb: 4 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#ffffff',
                      fontWeight: 600,
                      mb: 2,
                    }}
                  >
                    Alternative Majors to Consider:
                  </Typography>
                  <Grid container spacing={2}>
                    {result.alternativeMajors.map((major, index) => (
                      <Grid item xs={12} key={index}>
                        <Box 
                          sx={{ 
                            p: 2,
                            borderRadius: 2,
                            background: 'rgba(255, 255, 255, 0.05)',
                            animation: `${slideInRight} 1s ease-out ${0.3 + index * 0.1}s both`,
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                            <Typography 
                              variant="h6" 
                              sx={{ 
                                color: '#00E5FF',
                                fontWeight: 600,
                                fontSize: '1.1rem',
                              }}
                            >
                              {major.name}
                            </Typography>
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
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Actions Card */}
          <Grid item xs={12} md={4}>
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
                    Actions
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<PrintIcon />}
                    onClick={() => window.print()}
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
                    Print Results
                  </Button>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<SaveIcon />}
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
                    Save Results
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={handleRetake}
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
                    Take Again
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

function Results() {
  const { role } = useSelector((state) => state.auth);
  
  return (
    <BaseLayout role={role}>
      <ResultsContent />
    </BaseLayout>
  );
}

export default Results; 
