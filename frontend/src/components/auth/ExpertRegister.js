import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
  CircularProgress
} from '@mui/material';

function ExpertRegister() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    specialization: '',
    qualification: ''
  });

  useEffect(() => {
    // Here you would validate the token and get the email
    // For testing, we'll simulate an API call
    setTimeout(() => {
      // Simulating token validation
      if (token && token.startsWith('expert-')) {
        setLoading(false);
        // In real implementation, you would get this from your backend
        setFormData(prev => ({
          ...prev,
          email: 'test@example.com' // This would come from your backend
        }));
      } else {
        setError('Invalid or expired invitation token');
        setLoading(false);
      }
    }, 1000);
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Here you would make an API call to register the expert
    console.log('Registering expert with data:', formData);
    
    // Simulate successful registration
    alert('Registration successful! You can now login.');
    navigate('/login');
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Complete Your Expert Registration
        </Typography>
        <Typography variant="body1" align="center" color="textSecondary" paragraph>
          Please fill in your details to complete your registration
        </Typography>
        
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                margin="normal"
                label="Email"
                name="email"
                value={formData.email}
                disabled
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                margin="normal"
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                margin="normal"
                label="Specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                margin="normal"
                label="Qualification"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                margin="normal"
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                margin="normal"
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                sx={{ mb: 3 }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
              >
                Complete Registration
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

export default ExpertRegister; 
