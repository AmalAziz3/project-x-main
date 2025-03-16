import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
} from '@mui/material';
import {
  Event as EventIcon,
  School as SchoolIcon,
  Announcement as AnnouncementIcon,
} from '@mui/icons-material';
import BaseLayout from '../Layout/BaseLayout';

function Announcements() {
  const navigate = useNavigate();

  return (
    <BaseLayout role="expert">
      <Box sx={{ 
        minHeight: '100vh',
        background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/Background.jpg')`,
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
            Announcements
          </Typography>
          
          <Box sx={{ flexGrow: 1, mt: 4 }}>
            <Grid container spacing={4} justifyContent="center">
              {/* Create Announcement Card */}
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
                  <CardActionArea onClick={() => navigate('/post-announcement')} sx={{ p: 2 }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <AnnouncementIcon sx={{ fontSize: 60, color: '#00E5FF', mb: 2 }} />
                      <Typography variant="h5" sx={{ color: '#ffffff', mb: 2 }}>
                        Create Announcement
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Create a new announcement for your lectures
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>

              {/* View Announcements Card */}
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
                  <CardActionArea onClick={() => navigate('/notifications')} sx={{ p: 2 }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <EventIcon sx={{ fontSize: 60, color: '#00E5FF', mb: 2 }} />
                      <Typography variant="h5" sx={{ color: '#ffffff', mb: 2 }}>
                        View Announcements
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        View and manage your announcements
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

export default Announcements; 
