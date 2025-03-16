import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Container,
  Typography,
} from '@mui/material';
import BaseLayout from '../Layout/BaseLayout';

function ExpertHome() {
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  
  useEffect(() => {
    console.log('ExpertHome mounted');
    console.log('Auth state:', auth);
  }, [auth]);

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
        color: '#fff',
        pt: 4,
      }}>
        {/* Main Content */}
        <Container maxWidth="lg" sx={{ pt: 5, pb: 10 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            minHeight: '80vh',
          }}>
            {/* Left side text content */}
            <Box sx={{ maxWidth: '60%' }}>
              <Typography 
                variant="h1" 
                component="h1" 
                sx={{ 
                  color: '#00E5FF', 
                  fontWeight: 'bold',
                  fontSize: { xs: '3rem', md: '4.5rem' },
                  mb: 1,
                  textShadow: '0 0 20px rgba(0, 229, 255, 0.5)',
                  textAlign: 'left',
                }}
              >
                FuturePath
              </Typography>
              <Typography 
                variant="h5" 
                component="h2" 
                sx={{ 
                  color: 'white',
                  fontWeight: 'normal',
                  maxWidth: '800px',
                  lineHeight: 1.4,
                  textAlign: 'left',
                  mb: 3,
                }}
              >
                Your Gateway to Helping Students Discover the Most Suitable University Major
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#00E5FF',
                  fontStyle: 'italic',
                  textAlign: 'left',
                  mb: 6,
                }}
              >
                Ready to inspire minds?
              </Typography>
            </Box>
            
            {/* Right side logo */}
            <Box 
              component="img" 
              src="/logo.jpg" 
              alt="FuturePath Logo" 
              sx={{ 
                width: { xs: 180, md: 300 },
                height: { xs: 180, md: 300 },
                objectFit: 'cover',
                display: { xs: 'none', md: 'block' },
              }} 
            />
          </Box>
        </Container>
      </Box>
    </BaseLayout>
  );
}

export default ExpertHome; 
