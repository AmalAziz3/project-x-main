import React from 'react';
import { Box, Container, Typography, Grid, keyframes } from '@mui/material';
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

const glowPulse = keyframes`
  0% {
    text-shadow: 0 0 10px rgba(0, 229, 255, 0.3);
  }
  50% {
    text-shadow: 0 0 20px rgba(0, 229, 255, 0.6);
  }
  100% {
    text-shadow: 0 0 10px rgba(0, 229, 255, 0.3);
  }
`;

function DashboardStudent() {
  return (
    <BaseLayout role="student">
      <Box
        sx={{
          '@keyframes shine': {
            '0%': {
              filter: 'drop-shadow(0 0 15px rgba(0, 229, 255, 0.5))',
            },
            '50%': {
              filter: 'drop-shadow(0 0 25px rgba(0, 229, 255, 0.7))',
            },
            '100%': {
              filter: 'drop-shadow(0 0 15px rgba(0, 229, 255, 0.5))',
            },
          },
          minHeight: '100vh',
          width: '100vw',
          margin: 0,
          padding: 0,
          overflow: 'hidden',
          position: 'absolute',
          top: 0,
          left: 0,
          background: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url('/background.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          display: 'flex',
          alignItems: 'center',
          color: 'white',
        }}
      >
        <Container 
          maxWidth={false}
          sx={{ 
            m: 0,
            p: 4,
            width: '100%',
          }}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography 
                variant="h1" 
                sx={{ 
                  fontSize: { xs: '3rem', md: '4rem' },
                  fontWeight: '800',
                  mb: 4,
                  fontFamily: "'Poppins', sans-serif",
                  background: 'linear-gradient(90deg, #00E5FF, #2979FF)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 0 20px rgba(0, 229, 255, 0.5)',
                  animation: `${fadeInUp} 1s ease-out`,
                }}
              >
                FuturePath
              </Typography>
              <Typography 
                variant="h2" 
                sx={{ 
                  fontSize: { xs: '1.8rem', md: '2.2rem' },
                  fontWeight: '500',
                  mb: 3,
                  lineHeight: 1.3,
                  color: 'white',
                  animation: `${fadeInUp} 1s ease-out 0.3s both`,
                }}
              >
                Your Gateway to Discovering Your Perfect University Major
              </Typography>
              <Typography 
                sx={{ 
                  fontSize: '1.1rem',
                  mb: 4,
                  lineHeight: 1.8,
                  color: 'rgba(255, 255, 255, 0.9)',
                }}
              >
                Discover the path to your future with clarity and confidence! Our platform helps you make informed decisions about your academic journey.
              </Typography>
              <Typography 
                sx={{ 
                  fontSize: '1.2rem',
                  fontStyle: 'italic',
                  color: '#00E5FF',
                  textShadow: '0 0 10px rgba(0, 229, 255, 0.3)',
                  animation: `${fadeInUp} 1s ease-out 0.9s both, ${glowPulse} 3s ease-in-out infinite`,
                }}
              >
                Your journey to success starts here
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  animation: `${fadeInUp} 1s ease-out 1.2s both`,
                  '& img': {
                    maxWidth: '50%',
                    height: 'auto',
                    borderRadius: '50%',
                    filter: 'drop-shadow(0 0 20px rgba(0, 229, 255, 0.6))',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      filter: 'drop-shadow(0 0 30px rgba(0, 229, 255, 0.8))',
                      transform: 'scale(1.05)',
                    }
                  }
                }}
              >
                <img src="/logo.jpg" alt="Career Guidance Logo" />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </BaseLayout>
  );
}

export default DashboardStudent; 
