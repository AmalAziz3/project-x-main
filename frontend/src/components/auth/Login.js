import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import {
  TextField,
  Typography,
  Link,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  Box,
  Container,
  Card,
  CardContent,
  Avatar,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { loginUserThunk } from '../../store/authSlice';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const authState = useSelector(state => state.auth);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    // Check for success message in URL params
    const params = new URLSearchParams(location.search);
    const verificationSuccess = params.get('verificationSuccess');
    
    if (verificationSuccess === 'true') {
      setSuccessMessage('Account verified successfully! You can now log in.');
    }
    
    const role = localStorage.getItem('selectedRole');
    console.log('Initial role from localStorage:', role);
    if (!role) {
      console.log('No role found, redirecting to role selection');
      navigate('/role-selection');
    } else {
      console.log('Setting selected role:', role);
      setSelectedRole(role);
    }
  }, [navigate, location]);

  useEffect(() => {
    console.log('Auth state changed:', authState);
    if (authState.error) {
      setError(authState.error);
      setDebugInfo(`Auth error: ${authState.error}`);
    }
  }, [authState]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setDebugInfo('Login attempt started...');

    try {
      const selectedRole = localStorage.getItem('selectedRole');
      console.log('Login - selectedRole:', selectedRole);
      setDebugInfo(prev => `${prev}\nSelected role: ${selectedRole}`);
      
      if (!selectedRole) {
        const errorMsg = 'No role selected';
        console.error(errorMsg);
        setDebugInfo(prev => `${prev}\nError: ${errorMsg}`);
        throw new Error(errorMsg);
      }

      // Use the loginUserThunk to make the actual API call
      console.log('Dispatching loginUserThunk with:', {
        email: formData.email,
        password: '******', // Don't log actual password
        role: selectedRole
      });
      setDebugInfo(prev => `${prev}\nDispatching login with email: ${formData.email}, role: ${selectedRole}`);
      
      const resultAction = await dispatch(loginUserThunk({
        email: formData.email,
        password: formData.password,
        role: selectedRole
      }));
      
      console.log('Login result action:', resultAction);
      setDebugInfo(prev => `${prev}\nLogin result: ${JSON.stringify(resultAction.type)}`);
      
      // Check if the login was successful
      if (loginUserThunk.fulfilled.match(resultAction)) {
        console.log('Login successful, payload:', resultAction.payload);
        setDebugInfo(prev => `${prev}\nLogin successful!`);
        
        // Ensure we have the user data from the response
        const userData = resultAction.payload;
        console.log('User data from login:', userData);
        
        // Store tokens in localStorage if not already done by the thunk
        if (userData && userData.access) {
          localStorage.setItem('token', userData.access);
        }
        if (userData && userData.refresh) {
          localStorage.setItem('refreshToken', userData.refresh);
        }
        
        // Get the role from the response or use the selected role
        const userRole = userData?.user?.role || selectedRole;
        
        // Different navigation based on role
        if (userRole === 'expert') {
          console.log('Navigating to expert home');
          setDebugInfo(prev => `${prev}\nNavigating to: /home/expert`);
          // Use window.location for a full page refresh to ensure Redux state is applied
          window.location.href = '/home/expert';
        } else if (userRole === 'admin') {
          console.log('Navigating to admin home');
          setDebugInfo(prev => `${prev}\nNavigating to: /home/admin`);
          window.location.href = '/home/admin';
        } else if (userRole === 'student') {
          console.log('Navigating to student home');
          setDebugInfo(prev => `${prev}\nNavigating to: /home/student`);
          window.location.href = '/home/student';
        } else {
          // Default fallback
          console.log(`Navigating to ${userRole} home`);
          setDebugInfo(prev => `${prev}\nNavigating to: /home/${userRole}`);
          window.location.href = `/home/${userRole}`;
        }
        return; // Exit early after navigation
      } else if (loginUserThunk.rejected.match(resultAction)) {
        // Handle login failure
        const errorMsg = resultAction.payload || 'Login failed. Please try again.';
        console.error('Login rejected:', errorMsg);
        setDebugInfo(prev => `${prev}\nLogin rejected: ${errorMsg}`);
        throw new Error(errorMsg);
      } else {
        console.log('Unexpected result action type:', resultAction.type);
        setDebugInfo(prev => `${prev}\nUnexpected result: ${resultAction.type}`);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please try again.');
      setDebugInfo(prev => `${prev}\nError caught: ${err.message}`);
    } finally {
      setLoading(false);
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
                <PersonIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
                Welcome Back
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Sign in to continue
              </Typography>
            </Box>

            {successMessage && (
              <Alert severity="success" sx={{ mb: 3 }}>
                {successMessage}
              </Alert>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: '#00E5FF' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      backgroundColor: 'transparent',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.23)',
                      },
                      '&:hover fieldset': {
                        borderColor: '#00E5FF',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#00E5FF',
                      },
                      '& input': {
                        backgroundColor: 'transparent !important',
                      },
                      '& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus': {
                        WebkitBoxShadow: '0 0 0 1000px rgba(0, 0, 0, 0.8) inset !important',
                        WebkitTextFillColor: 'white !important',
                        caretColor: 'white !important',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: '#00E5FF' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
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
                
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ mb: 2, textAlign: 'center' }}>
                    <Link
                      component={RouterLink}
                      to="/forgot-password"
                      sx={{
                        color: '#00E5FF',
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      Forgot Password?
                    </Link>
                  </Box>
                  
                  <Box>
                    <button
                      type="submit"
                      disabled={loading}
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
                        marginBottom: '10px'
                      }}
                    >
                      {loading ? (
                        <CircularProgress size={24} />
                      ) : (
                        'Login'
                      )}
                    </button>
                  </Box>

                  <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Don't have an account?{' '}
                      <Link
                        component={RouterLink}
                        to="/register"
                        sx={{
                          color: '#00E5FF',
                          textDecoration: 'none',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        Sign Up
                      </Link>
                    </Typography>
                  </Box>
                  
                  {/* Debug information */}
                  {debugInfo && (
                    <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(0, 0, 0, 0.5)', borderRadius: 1 }}>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', whiteSpace: 'pre-line' }}>
                        Debug Info:
                        {debugInfo}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default Login; 
