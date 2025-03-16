import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
  Psychology as PsychologyIcon,
} from '@mui/icons-material';

// Add keyframes for neon animation
const neonKeyframes = `
@keyframes neon {
  from {
    text-shadow: 0 0 5px #00E5FF, 0 0 10px #00E5FF;
  }
  to {
    text-shadow: 0 0 2px #00E5FF, 0 0 8px #00E5FF;
  }
}`;

function Home() {
  const navigate = useNavigate();
  const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  React.useEffect(() => {
    // Add keyframes to document
    const style = document.createElement('style');
    style.innerHTML = neonKeyframes;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const features = [
    {
      icon: <SchoolIcon sx={{ fontSize: 40, color: '#1a237e' }} />,
      title: 'Career Guidance',
      description: 'Get personalized recommendations for your academic journey',
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: 40, color: '#1a237e' }} />,
      title: 'Major Analysis',
      description: 'Explore different majors and their career prospects',
    },
    {
      icon: <PsychologyIcon sx={{ fontSize: 40, color: '#1a237e' }} />,
      title: 'Expert Support',
      description: 'Connect with academic advisors and career experts',
    },
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url('/Background.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      position: 'relative',
      pt: { xs: 4, md: 8 },
      pb: { xs: 6, md: 12 },
    }}>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <Grid container spacing={4} alignItems="center" sx={{ mb: { xs: 6, md: 10 } }}>
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography variant="h2" sx={{ 
                mb: 2,
                fontSize: { xs: '2rem', md: '3rem' },
                fontWeight: 700,
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: { xs: 'center', md: 'flex-start' },
                gap: { xs: 1, md: 2 },
                lineHeight: 1.2,
              }}>
                <Box 
                  component="span" 
                  sx={{ 
                    color: '#00E5FF',
                    textShadow: '0 0 4px rgba(0, 229, 255, 0.4), 0 0 15px rgba(0, 229, 255, 0.3)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  FuturePath
                </Box>
                <Box 
                  component="span" 
                  sx={{ 
                    color: '#ffffff',
                    whiteSpace: 'nowrap',
                  }}
                >
                  to Academic Success
                </Box>
              </Typography>
              <Typography variant="h5" sx={{ 
                color: '#ffffff',
                mb: 4,
                opacity: 0.9,
                lineHeight: 1.5,
                maxWidth: '600px'
              }}>
                Discover your ideal major and shape your future career path
              </Typography>
              <Box sx={{ 
                display: 'flex',
                gap: 2,
                justifyContent: { xs: 'center', md: 'flex-start' }
              }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{
                    bgcolor: '#ffffff',
                    color: '#000000',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.8)',
                    },
                    px: 4,
                  }}
                >
                  Get Started
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/role-selection')}
                  sx={{
                    color: '#ffffff',
                    borderColor: '#ffffff',
                    '&:hover': {
                      borderColor: '#ffffff',
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                    },
                    px: 4,
                  }}
                >
                  Sign In
                </Button>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} sx={{ textAlign: 'right', pr: { md: 4 } }}>
            <Box
              component="img"
              src="/logo.jpg"
              alt="Career Guidance Logo"
              sx={{
                width: { xs: '60%', md: '80%' },
                maxWidth: 300,
                height: 'auto',
                filter: 'drop-shadow(0px 4px 8px rgba(0, 229, 255, 0.3))',
              }}
            />
          </Grid>
        </Grid>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{
                height: '100%',
                bgcolor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 8px 32px rgba(0, 229, 255, 0.2)',
                },
              }}>
                <CardContent sx={{ textAlign: 'center', p: 4 }}>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" sx={{ mb: 2, color: '#000000' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(0, 0, 0, 0.7)' }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default Home;
