import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  TextField, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  IconButton,
  keyframes,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  Build,
  Close,
  Send,
  Email
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

function Communication() {
  const [openSupportDialog, setOpenSupportDialog] = useState(false);
  const [supportSubject, setSupportSubject] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const experts = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@example.com",
      expertise: "Architecture",
      avatar: "/sarah.jpg"
    },
    {
      id: 2,
      name: "Prof. Michael Chen",
      email: "michael.chen@example.com",
      expertise: "Business",
      avatar: "/micheal.jpg"
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      email: "emily.rodriguez@example.com",
      expertise: "Medical",
      avatar: "/emily.jpg"
    }
  ];

  const handleCloseSupportDialog = () => {
    setOpenSupportDialog(false);
    setSupportSubject('');
    setSupportMessage('');
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleSendSupportRequest = () => {
    // Here you would typically send the support request to the backend
    console.log('Sending support request');
    console.log('Subject:', supportSubject);
    console.log('Message:', supportMessage);
    setSnackbarMessage('Technical support request sent successfully');
    setSnackbarOpen(true);
    handleCloseSupportDialog();
  };

  return (
    <BaseLayout role="student">
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
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Typography 
            variant="h1" 
            sx={{ 
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: '800',
              mb: 2,
              fontFamily: "'Poppins', sans-serif",
              background: 'linear-gradient(90deg, #00E5FF, #2979FF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 20px rgba(0, 229, 255, 0.5)',
              animation: `${fadeInUp} 1s ease-out`,
            }}
          >
            Communication Center
          </Typography>

          {/* Technical Support Section */}
          <Box sx={{ mb: 8 }}>
            <Typography 
              variant="h4" 
              sx={{ 
                mb: 4,
                color: '#fff',
                fontWeight: '600',
                animation: `${fadeInUp} 1s ease-out 0.2s both`,
              }}
            >
              Technical Support
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} sx={{ mx: 'auto' }}>
                <Card 
                  sx={{ 
                    height: '100%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    transition: 'all 0.3s ease-in-out',
                    animation: `${fadeInUp} 1s ease-out 0.3s both`,
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: '0 8px 32px rgba(0, 229, 255, 0.2)',
                      background: 'rgba(255, 255, 255, 0.15)',
                    }
                  }}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Build sx={{ fontSize: 48, color: '#00E5FF', mb: 2 }} />
                    <Typography variant="h6" sx={{ color: '#fff', mb: 1 }}>
                      Technical Support
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                      Submit a technical support request and we'll assist you
                    </Typography>
                    <Button 
                      variant="contained" 
                      startIcon={<Build />}
                      onClick={() => setOpenSupportDialog(true)}
                      sx={{
                        background: 'rgba(0, 229, 255, 0.9)',
                        '&:hover': {
                          background: 'rgba(0, 229, 255, 1)',
                        }
                      }}
                    >
                      Contact Us
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

          {/* Expert Contact Section */}
          <Box>
            <Typography 
              variant="h4" 
              sx={{ 
                mb: 4,
                color: '#fff',
                fontWeight: '600',
                animation: `${fadeInUp} 1s ease-out 0.6s both`,
              }}
            >
              Our Experts
            </Typography>
            <Grid container spacing={3}>
              {experts.map((expert, index) => (
                <Grid item xs={12} md={4} key={expert.id}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      transition: 'all 0.3s ease-in-out',
                      animation: `${fadeInUp} 1s ease-out ${0.7 + index * 0.1}s both`,
                      '&:hover': {
                        transform: 'translateY(-10px)',
                        boxShadow: '0 8px 32px rgba(0, 229, 255, 0.2)',
                        background: 'rgba(255, 255, 255, 0.15)',
                      }
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box
                          component="img"
                          src={expert.avatar}
                          alt={expert.name}
                          sx={{
                            width: 60,
                            height: 60,
                            borderRadius: '50%',
                            mr: 2,
                            objectFit: 'cover',
                          }}
                        />
                        <Box>
                          <Typography variant="h6" sx={{ color: '#fff' }}>
                            {expert.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#00E5FF' }}>
                            {expert.expertise}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        color: 'rgba(255, 255, 255, 0.7)',
                        mb: 2 
                      }}>
                        <Email sx={{ fontSize: 20, mr: 1, color: '#00E5FF' }} />
                        <Typography variant="body2">
                          {expert.email}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>

        {/* Success Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity="success" 
            variant="filled"
            sx={{ 
              width: '100%',
              backgroundColor: 'rgba(0, 229, 255, 0.9)',
              color: '#fff',
              '& .MuiAlert-icon': {
                color: '#fff'
              }
            }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>

        {/* Technical Support Dialog */}
        <Dialog 
          open={openSupportDialog} 
          onClose={handleCloseSupportDialog}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }
          }}
        >
          <DialogTitle sx={{ color: '#fff' }}>
            Technical Support Request
            <IconButton
              onClick={handleCloseSupportDialog}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: 'rgba(255, 255, 255, 0.7)',
                '&:hover': {
                  color: '#fff',
                }
              }}
            >
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Subject"
              type="text"
              fullWidth
              value={supportSubject}
              onChange={(e) => setSupportSubject(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#00E5FF',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&.Mui-focused': {
                    color: '#00E5FF',
                  },
                },
              }}
            />
            <TextField
              margin="dense"
              label="Description"
              type="text"
              fullWidth
              multiline
              rows={4}
              value={supportMessage}
              onChange={(e) => setSupportMessage(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#00E5FF',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&.Mui-focused': {
                    color: '#00E5FF',
                  },
                },
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseSupportDialog} sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Cancel
            </Button>
            <Button 
              onClick={handleSendSupportRequest}
              startIcon={<Send />}
              sx={{
                background: 'rgba(0, 229, 255, 0.9)',
                '&:hover': {
                  background: 'rgba(0, 229, 255, 1)',
                }
              }}
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </BaseLayout>
  );
}

export default Communication; 
