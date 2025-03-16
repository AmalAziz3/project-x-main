import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import {
  Typography,
  TextField,
  Alert,
  Box,
  Container,
  Card,
  CardContent,
  Avatar,
  InputAdornment,
  Link,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  VerifiedUser as VerifiedUserIcon,
  Numbers as NumbersIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { API_URL, handleApiError } from '../../utils/authUtils';

const CodeInput = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-input': {
    textAlign: 'center',
    letterSpacing: '0.5em',
    fontSize: '1.5em',
    color: 'white',
  },
}));

const EXPIRY_TIME = 300; // 5 minutes in seconds

function VerifyRegistration() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  const devCode = location.state?.devCode || '';
  
  const [verificationCode, setVerificationCode] = useState(devCode || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timeLeft, setTimeLeft] = useState(EXPIRY_TIME);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    if (!email) {
      navigate('/register');
    }
    
    // If we have a dev code, show a message
    if (devCode) {
      setSuccess(`Development verification code pre-filled: ${devCode}`);
    }
  }, [email, navigate, devCode]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit verification code');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.post(`${API_URL}/users/verification/code/confirm/`, {
        email,
        code: verificationCode
      });
      
      setSuccess(response.data.detail || 'Email verified successfully!');
      setSnackbarMessage('Email verified successfully! You can now log in.');
      setSnackbarOpen(true);
      
      // Navigate to login after a short delay with URL parameter instead of state
      setTimeout(() => {
        navigate('/login?verificationSuccess=true');
      }, 2000);
    } catch (error) {
      const errorMessage = handleApiError(error, 'verifying code').message;
      setError(errorMessage);
      setSnackbarMessage(errorMessage);
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setError('');
    
    try {
      if (!email) {
        throw new Error('Email address is missing. Please go back to the registration page.');
      }
      
      const response = await axios.post(`${API_URL}/users/verification/code/`, { email });
      
      setSuccess(response.data.detail || 'Verification code has been resent to your email.');
      setSnackbarMessage('Verification code has been resent to your email.');
      setSnackbarOpen(true);
      setTimeLeft(EXPIRY_TIME);
      setCanResend(false);
      setVerificationCode('');
    } catch (error) {
      const errorMessage = handleApiError(error, 'resending code').message;
      setError(errorMessage);
      setSnackbarMessage(errorMessage);
      setSnackbarOpen(true);
    } finally {
      setIsResending(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      width: '100%',
      background: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url('/Background.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      py: 4,
      display: 'flex',
      alignItems: 'center',
    }}>
      <Container maxWidth="sm">
        <Card sx={{ 
          bgcolor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: '#00E5FF',
                  margin: '0 auto 16px',
                }}
              >
                <VerifiedUserIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
                Verify Your Email
              </Typography>
              {email && (
                <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Verification code has been sent to {email}
                </Typography>
              )}
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                {success}
              </Alert>
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Code expires in: {formatTime(timeLeft)}
                </Typography>
              </Box>

              <CodeInput
                fullWidth
                label="Verification Code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                placeholder="000000"
                inputProps={{ maxLength: 6 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <NumbersIcon sx={{ color: '#00E5FF' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.23)',
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
                }}
              />

              <button
                onClick={handleVerifyCode}
                disabled={verificationCode.length !== 6 || isLoading}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#00E5FF',
                  color: '#000',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Verify Code'}
              </button>

              <button
                onClick={handleResendCode}
                disabled={!canResend || isResending}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: 'transparent',
                  color: '#00E5FF',
                  border: '1px solid #00E5FF',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  opacity: canResend ? 1 : 0.5,
                }}
              >
                {isResending ? <CircularProgress size={24} sx={{ color: '#00E5FF' }} /> : 'Resend Code'}
              </button>

              <Box sx={{ textAlign: 'center' }}>
                <Link
                  component={RouterLink}
                  to="/login"
                  sx={{
                    color: '#00E5FF',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Back to Login
                </Link>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={error ? "error" : "success"}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default VerifyRegistration; 
