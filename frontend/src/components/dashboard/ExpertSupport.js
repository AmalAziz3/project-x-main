import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Home as HomeIcon,
  Support as SupportIcon,
  Send as SendIcon,
  School as SchoolIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
import BaseLayout from '../Layout/BaseLayout';

function ExpertSupport() {
  console.log('ExpertSupport component rendered');
  // const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subject: '',
    category: '',
    message: '',
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Here you would typically send the data to an API
    console.log('Form submitted:', formData);
    
    // Show success message
    setSnackbarOpen(true);
    
    // Reset form
    setFormData({
      subject: '',
      category: '',
      message: '',
    });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

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
        color: 'white',
        pt: 4,
      }}>
        {/* Main Content */}
        <Container maxWidth="md" sx={{ pt: 5, pb: 10 }}>
          <Box sx={{ mb: 6 }}>
            <Typography 
              variant="h3" 
              component="h1" 
              sx={{ 
                color: '#00E5FF', 
                fontWeight: 'bold',
                textAlign: 'center',
                mb: 2,
                textShadow: '0 0 20px rgba(0, 229, 255, 0.5)',
              }}
            >
              Technical Support
            </Typography>
            <Typography 
              variant="h6" 
              component="p" 
              sx={{ 
                color: 'white',
                textAlign: 'center',
                maxWidth: '800px',
                mx: 'auto',
              }}
            >
              Need help? Contact our technical support team
            </Typography>
          </Box>

          <Paper 
            elevation={0}
            sx={{ 
              p: 4, 
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(10px)',
              borderRadius: 2,
              border: '1px solid rgba(0, 229, 255, 0.3)',
            }}
          >
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(0, 229, 255, 0.3)',
                        },
                        '&:hover fieldset': {
                          borderColor: '#00E5FF',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#00E5FF',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.7)',
                      },
                      '& .MuiInputBase-input': {
                        color: 'white',
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl 
                    fullWidth
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(0, 229, 255, 0.3)',
                        },
                        '&:hover fieldset': {
                          borderColor: '#00E5FF',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#00E5FF',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.7)',
                      },
                      '& .MuiInputBase-input': {
                        color: 'white',
                      },
                      '& .MuiSvgIcon-root': {
                        color: 'rgba(255, 255, 255, 0.7)',
                      },
                    }}
                  >
                    <InputLabel>Category</InputLabel>
                    <Select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      label="Category"
                    >
                      <MenuItem value="technical">Technical Issue</MenuItem>
                      <MenuItem value="account">Account Problem</MenuItem>
                      <MenuItem value="feature">Feature Request</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    multiline
                    rows={6}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(0, 229, 255, 0.3)',
                        },
                        '&:hover fieldset': {
                          borderColor: '#00E5FF',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#00E5FF',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.7)',
                      },
                      '& .MuiInputBase-input': {
                        color: 'white',
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sx={{ textAlign: 'center', mt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    endIcon={<SendIcon />}
                    sx={{ 
                      bgcolor: '#00E5FF',
                      '&:hover': {
                        bgcolor: 'rgba(0, 229, 255, 0.8)',
                      },
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                    }}
                  >
                    Send Message
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Container>

        {/* Snackbar for success message */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleSnackbarClose} 
            severity="success"
            sx={{ width: '100%' }}
          >
            Your message has been sent to technical support. We will get back to you shortly.
          </Alert>
        </Snackbar>
      </Box>
    </BaseLayout>
  );
}

export default ExpertSupport; 
