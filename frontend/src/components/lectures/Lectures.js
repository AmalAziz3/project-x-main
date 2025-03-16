import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CardActionArea,
  Container,
} from '@mui/material';
import {
  Event as EventIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import BaseLayout from '../Layout/BaseLayout';

function Lectures() {
  const navigate = useNavigate();

  return (
    <BaseLayout role="expert">
      <Box sx={{ 
        minHeight: '100vh',
        background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/background.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        pb: 7,
      }}>
        <Container maxWidth="lg" sx={{ pt: 4 }}>
          <Typography variant="h3" sx={{ 
            color: '#00E5FF',
            mb: 4,
            textAlign: 'center',
            fontWeight: 600,
            textShadow: '0 0 20px rgba(0, 229, 255, 0.5)',
          }}>
            Lectures
          </Typography>
          
          <Box sx={{ flexGrow: 1, mt: 4 }}>
            <Grid container spacing={4} justifyContent="center">
              {/* View Existing Lectures Card */}
              <Grid item xs={12} sm={6} md={5}>
                <Card sx={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0 0 20px rgba(0, 229, 255, 0.3)',
                  },
                }}>
                  <CardActionArea onClick={() => navigate('/view-lectures')} sx={{ p: 2 }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <SchoolIcon sx={{ fontSize: 60, color: '#00E5FF', mb: 2 }} />
                      <Typography variant="h5" sx={{ color: '#ffffff', mb: 2 }}>
                        View Lectures
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Browse and manage your existing lectures
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>

              {/* Schedule New Lecture Card */}
              <Grid item xs={12} sm={6} md={5}>
                <Card sx={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0 0 20px rgba(0, 229, 255, 0.3)',
                  },
                }}>
                  <CardActionArea onClick={() => navigate('/schedule-lecture')} sx={{ p: 2 }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <EventIcon sx={{ fontSize: 60, color: '#00E5FF', mb: 2 }} />
                      <Typography variant="h5" sx={{ color: '#ffffff', mb: 2 }}>
                        Schedule Lecture
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Create and schedule new lectures
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </BaseLayout>
  );
}

export default Lectures; 
