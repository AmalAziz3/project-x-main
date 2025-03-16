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
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  LockReset as LockResetIcon,
  Lock as LockIcon,
  Numbers as NumbersIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import { resetPassword, requestPasswordReset } from '../../services/authService';

const CodeInput = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-input': {
    textAlign: 'center',
    letterSpacing: '0.5em',
    fontSize: '1.5em',
    color: 'white',
  },
}));

const EXPIRY_TIME = 300; // 5 minutes in seconds

function VerifyReset() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [timeLeft, setTimeLeft] = useState(EXPIRY_TIME);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    setIsLoading(true);
    setError('');
    
    // In a real implementation, we would verify the code with the backend
    // For now, we'll just set isVerified to true to allow password reset
    setIsVerified(true);
    setIsLoading(false);
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setError('');
    
    try {
      if (!email) {
        throw new Error('Email address is missing. Please go back to the reset password page.');
      }
      
      // Call the actual API to resend the code
      await requestPasswordReset(email);
      
      setTimeLeft(EXPIRY_TIME);
      setCanResend(false);
      setVerificationCode('');
    } catch (err) {
      setError(err.message || 'Failed to resend code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);
    
    if (!minLength) return 'Password must be at least 8 characters long';
    if (!hasNumber) return 'Password must contain at least one number';
    if (!hasLetter) return 'Password must contain at least one letter';
    return '';
  };

  const handleResetPassword = async () => {
    setIsLoading(true);
    setError('');
    
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }
    
    try {
      // Call the actual API to reset the password
      await resetPassword(verificationCode, newPassword, confirmPassword);
      
      // Navigate to login with success message
      navigate('/login', { 
        state: { message: 'Password has been successfully reset. Please login with your new password.' }
      });
    } catch (err) {
      setError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
                <LockResetIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
                {isVerified ? 'Set New Password' : 'Verify Reset Code'}
              </Typography>
              {email && (
                <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Reset code has been sent to {email}
                </Typography>
              )}
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {!isVerified ? (
                <>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Code expires in: {formatTime(timeLeft)}
                    </Typography>
                  </Box>

                  <CodeInput
                    fullWidth
                    label="Verification Code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
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
                    {isLoading ? <CircularProgress size={24} /> : 'Verify Code'}
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
                    }}
                  >
                    {isResending ? 'Sending...' : 'Resend Code'}
                  </button>
                </>
              ) : (
                <>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                    Password must:
                    <br />• Be at least 8 characters long
                    <br />• Contain at least one number
                    <br />• Contain at least one letter
                  </Typography>

                  <TextField
                    fullWidth
                    type="password"
                    label="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: '#00E5FF' }} />
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

                  <TextField
                    fullWidth
                    type="password"
                    label="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: '#00E5FF' }} />
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
                    onClick={handleResetPassword}
                    disabled={!newPassword || !confirmPassword || isLoading}
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
                    {isLoading ? <CircularProgress size={24} /> : 'Reset Password'}
                  </button>
                </>
              )}

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
    </Box>
  );
}

export default VerifyReset; 
