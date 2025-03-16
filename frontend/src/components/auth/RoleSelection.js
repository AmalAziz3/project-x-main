import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Container,
  Fade,
} from '@mui/material';
import {
  School as SchoolIcon,
  Psychology as PsychologyIcon,
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';

function RoleSelection() {
  const navigate = useNavigate();
  const [showCards, setShowCards] = useState([false, false, false]);

  useEffect(() => {
    // Staggered animation for cards
    const timeouts = showCards.map((_, index) => {
      return setTimeout(() => {
        setShowCards(prev => prev.map((card, i) => i === index ? true : card));
      }, 200 * (index + 1)); // Reduced from 400ms to 200ms delay
    });

    return () => timeouts.forEach(timeout => clearTimeout(timeout));
  }, []);

  const handleRoleSelect = (role) => {
    localStorage.setItem('selectedRole', role);
    navigate('/login');
  };

  const roleCards = [
    {
      role: 'admin',
      icon: AdminIcon,
      title: 'Admin',
      color: '#FF5722'
    },
    {
      role: 'expert',
      icon: PsychologyIcon,
      title: 'Expert',
      color: '#00E5FF'
    },
    {
      role: 'student',
      icon: SchoolIcon,
      title: 'Student',
      color: '#4CAF50'
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url("/Background.jpg")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      <Container maxWidth="xl">
        <Fade in={true} timeout={400}>
          <Typography 
            variant="h3" 
            align="center" 
            gutterBottom 
            sx={{
              fontWeight: 'bold',
              color: '#ffffff',
              mb: 8
            }}
          >
            Select Your Role
          </Typography>
        </Fade>
        <Box sx={{ 
          display: 'flex',
          justifyContent: 'center',
          gap: { xs: 2, md: 4 },
          px: { xs: 2, md: 0 },
          flexWrap: { xs: 'wrap', md: 'nowrap' }
        }}>
          {roleCards.map((item, index) => {
            const Icon = item.icon;
            return (
              <Fade 
                key={item.role}
                in={true} 
                timeout={400}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <Card 
                  sx={{ 
                    width: { xs: '100%', sm: 280 },
                    height: { xs: 260, sm: 320 },
                    cursor: 'pointer',
                    bgcolor: 'rgba(0, 0, 0, 0.2)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: `0 8px 32px ${item.color}33`,
                      bgcolor: 'rgba(0, 0, 0, 0.3)',
                      border: `1px solid ${item.color}66`,
                    },
                    transition: 'all 0.3s ease-in-out',
                    m: { xs: 1, md: 0 }
                  }}
                  onClick={() => handleRoleSelect(item.role)}
                >
                  <CardContent sx={{ 
                    textAlign: 'center',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    p: { xs: 2, sm: 3 }
                  }}>
                    <Icon sx={{ 
                      fontSize: { xs: 60, sm: 100 }, 
                      color: item.color,
                      mb: { xs: 2, sm: 4 },
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.1)',
                      }
                    }} />
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        fontWeight: 'bold',
                        color: '#fff',
                        fontSize: { xs: '1.5rem', sm: '2rem' }
                      }}
                    >
                      {item.title}
                    </Typography>
                  </CardContent>
                </Card>
              </Fade>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
}

export default RoleSelection; 
