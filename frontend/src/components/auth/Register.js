import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  FormHelperText,
  CircularProgress,
  styled,
  Avatar,
  Alert,
  Snackbar,
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  ArrowBack, 
  ArrowForward, 
  Person as PersonIcon,
  Email as EmailIcon,
  Assessment as AssessmentIcon,
  School as SchoolIcon,
  Lock as LockIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { registerUserThunk } from '../../store/authSlice';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from 'axios';
import { API_URL } from '../../utils/authUtils';

// Commented out unused imports
// import AuthContainer from '../../styles/AuthContainer';
// import AuthCard from '../../styles/AuthCard';
// import AuthCardContent from '../../styles/AuthCardContent';
// import FormContainer from '../../styles/FormContainer';
// import StyledButton from '../../styles/StyledButton';
// import LinkContainer from '../../styles/LinkContainer';

// Create a custom container for the Register page that prevents scrolling but keeps the background
/* Commented out unused styled component
const RegisterContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  overflow: 'hidden', // Prevent scrolling
  position: 'fixed', // Fix the container in place
}));
*/

// Create a scrollable card content
/* Commented out unused styled component
const ScrollableCardContent = styled(CardContent)(({ theme }) => ({
  maxHeight: '70vh',
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: theme.palette.background.paper,
  },
  '&::-webkit-scrollbar-thumb': {
    background: theme.palette.primary.main,
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: theme.palette.primary.dark,
  },
}));
*/

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const searchParams = useSearchParams()[0];
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { verificationMessage } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    dateOfBirth: '',
    gat: '',
    saath: '',
    highSchoolGpa: '',
    role: 'student'
  });

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      // Here you would typically decode the token to get the email
      // For now, we'll assume the token is the email itself
      setFormData(prev => ({
        ...prev,
        email: tokenFromUrl // In reality, you'd decode the token to get the email
      }));
    }
  }, [searchParams]);

  const validateForm = () => {
    const errors = {};
    
    // Validate required fields
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!formData.gender) errors.gender = 'Gender is required';
    if (!formData.password) errors.password = 'Password is required';
    if (!formData.confirmPassword) errors.confirmPassword = 'Please confirm your password';
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Validate gender (must be 'male' or 'female')
    if (formData.gender && !['male', 'female'].includes(formData.gender.toLowerCase())) {
      errors.gender = 'Gender must be either Male or Female';
    }
    
    // Validate password strength
    if (formData.password) {
      if (formData.password.length < 8) {
        errors.password = 'Password must be at least 8 characters long';
      } else if (!/\d/.test(formData.password)) {
        errors.password = 'Password must contain at least one number';
      } else if (!/[a-zA-Z]/.test(formData.password)) {
        errors.password = 'Password must contain at least one letter';
      }
    }
    
    // Validate password match
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    // Validate numeric fields if provided
    if (formData.gat && (isNaN(formData.gat) || formData.gat < 0 || formData.gat > 100)) {
      errors.gat = 'GAT score must be between 0 and 100';
    }
    
    if (formData.highSchoolGpa && (isNaN(formData.highSchoolGpa) || formData.highSchoolGpa < 0 || formData.highSchoolGpa > 100)) {
      errors.highSchoolGpa = 'GPA must be between 0 and 100';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Prevent email change if token is present
    if (name === 'email' && token) {
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear validation error when field is edited
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setFormSubmitted(true);
    
    // Validate form
    if (!validateForm()) {
      setSnackbarMessage('Please fix the errors in the form');
      setSnackbarOpen(true);
      return;
    }
    
    setLoading(true);

    try {
      // Prepare registration data
      const registrationData = {
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
        gender: formData.gender.toLowerCase(),
        role: 'student',
        ...(formData.gat && { gat_score: formData.gat }),
        ...(formData.saath && { saath_score: formData.saath }),
        ...(formData.highSchoolGpa && { high_school_gpa: formData.highSchoolGpa }),
        ...(formData.dateOfBirth && { date_of_birth: formData.dateOfBirth })
      };
      
      console.log('Sending registration data:', registrationData);
      
      // If token is present, include it
      if (token) {
        registrationData.token = token;
      }
      
      // Dispatch the registration action
      const resultAction = await dispatch(registerUserThunk(registrationData));
      console.log('Registration result action:', resultAction);
      
      if (registerUserThunk.fulfilled.match(resultAction)) {
        // Registration successful
        console.log('Registration successful, payload:', resultAction.payload);
        
        // Check if dev verification code is available
        const devCode = resultAction.payload.dev_verification_code;
        if (devCode) {
          setSuccess(`Registration successful! Your verification code is: ${devCode}`);
          setSnackbarMessage(`Registration successful! Your verification code is: ${devCode}`);
        } else {
          setSuccess('Registration successful! Please verify your email.');
          setSnackbarMessage('Registration successful! Please verify your email.');
        }
        
        setSnackbarOpen(true);
        
        // Navigate to verification page immediately
        navigate('/verify-registration', { 
          state: { 
            email: formData.email,
            devCode: devCode // Pass the verification code to the verification page
          }
        });
      } else if (registerUserThunk.rejected.match(resultAction)) {
        // Registration failed, show error
        console.error('Registration rejected, payload:', resultAction.payload);
        const errorMessage = resultAction.payload || 'Registration failed. Please try again.';
        
        // Check for specific error messages
        if (errorMessage.includes('email') && errorMessage.includes('exists')) {
          // Email already exists error
          setError('This email address is already registered. Please use a different email or try logging in.');
          setValidationErrors(prev => ({
            ...prev,
            email: 'Email already registered'
          }));
          setSnackbarMessage('Email address already registered. Please use a different email.');
        } else {
          // Other errors
          setError(errorMessage);
          setSnackbarMessage('Registration failed. Please check the form and try again.');
        }
        setSnackbarOpen(true);
      }
    } catch (err) {
      console.error('Unexpected error during registration:', err);
      setError('Registration failed. Please try again.');
      setSnackbarMessage('An unexpected error occurred. Please try again.');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
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
                <PersonIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
                Create Account
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Join us to start your journey
              </Typography>
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

            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  error={!!validationErrors.firstName}
                  helperText={validationErrors.firstName}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: validationErrors.firstName ? 'error.main' : '#00E5FF' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': {
                        borderColor: validationErrors.firstName ? 'error.main' : 'rgba(255, 255, 255, 0.23)',
                      },
                      '&:hover fieldset': {
                        borderColor: validationErrors.firstName ? 'error.main' : '#00E5FF',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: validationErrors.firstName ? 'error.main' : '#00E5FF',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: validationErrors.firstName ? 'error.main' : 'rgba(255, 255, 255, 0.7)',
                    },
                    '& .MuiFormHelperText-root': {
                      color: 'error.main',
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  error={!!validationErrors.lastName}
                  helperText={validationErrors.lastName}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: validationErrors.lastName ? 'error.main' : '#00E5FF' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': {
                        borderColor: validationErrors.lastName ? 'error.main' : 'rgba(255, 255, 255, 0.23)',
                      },
                      '&:hover fieldset': {
                        borderColor: validationErrors.lastName ? 'error.main' : '#00E5FF',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: validationErrors.lastName ? 'error.main' : '#00E5FF',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: validationErrors.lastName ? 'error.main' : 'rgba(255, 255, 255, 0.7)',
                    },
                    '& .MuiFormHelperText-root': {
                      color: 'error.main',
                    },
                  }}
                />
              </Box>

              <FormControl fullWidth error={!!validationErrors.gender}>
                <InputLabel sx={{ color: validationErrors.gender ? 'error.main' : 'rgba(255, 255, 255, 0.7)' }}>Gender</InputLabel>
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  sx={{
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: validationErrors.gender ? 'error.main' : 'rgba(255, 255, 255, 0.23)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: validationErrors.gender ? 'error.main' : '#00E5FF',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: validationErrors.gender ? 'error.main' : '#00E5FF',
                    },
                    '& .MuiSvgIcon-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    },
                  }}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                </Select>
                {validationErrors.gender && (
                  <FormHelperText sx={{ color: 'error.main' }}>{validationErrors.gender}</FormHelperText>
                )}
              </FormControl>

              {/* Date of Birth Field */}
              <TextField
                fullWidth
                label="Date of Birth (Optional)"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
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
                  '& input[type="date"]::-webkit-calendar-picker-indicator': {
                    filter: 'invert(1)',
                  },
                }}
              />

              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={!!token}
                error={!!validationErrors.email}
                helperText={validationErrors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: validationErrors.email ? 'error.main' : '#00E5FF' }} />
                    </InputAdornment>
                  ),
                  readOnly: !!token,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': {
                      borderColor: validationErrors.email ? 'error.main' : 'rgba(255, 255, 255, 0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: token ? 'rgba(255, 255, 255, 0.23)' : validationErrors.email ? 'error.main' : '#00E5FF',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: token ? 'rgba(255, 255, 255, 0.23)' : validationErrors.email ? 'error.main' : '#00E5FF',
                    },
                    '&.Mui-disabled': {
                      color: 'rgba(255, 255, 255, 0.5)',
                      '-webkit-text-fill-color': 'rgba(255, 255, 255, 0.5)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: validationErrors.email ? 'error.main' : 'rgba(255, 255, 255, 0.7)',
                  },
                  '& .MuiFormHelperText-root': {
                    color: 'error.main',
                  },
                }}
              />

              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  label="General Aptitude Test (GAT)"
                  name="gat"
                  type="number"
                  value={formData.gat}
                  onChange={handleChange}
                  error={!!validationErrors.gat}
                  helperText={validationErrors.gat}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AssessmentIcon sx={{ color: validationErrors.gat ? 'error.main' : '#00E5FF' }} />
                      </InputAdornment>
                    ),
                    endAdornment: <InputAdornment position="end" sx={{ color: 'white' }}>%</InputAdornment>,
                  }}
                  inputProps={{ 
                    min: 0, 
                    max: 100,
                    step: 0.01
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': {
                        borderColor: validationErrors.gat ? 'error.main' : 'rgba(255, 255, 255, 0.23)',
                      },
                      '&:hover fieldset': {
                        borderColor: validationErrors.gat ? 'error.main' : '#00E5FF',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: validationErrors.gat ? 'error.main' : '#00E5FF',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: validationErrors.gat ? 'error.main' : 'rgba(255, 255, 255, 0.7)',
                    },
                    '& .MuiFormHelperText-root': {
                      color: 'error.main',
                    },
                  }}
                />
                
                <TextField
                  fullWidth
                  label="Scholastic Achievement Test (SAATH)"
                  name="saath"
                  value={formData.saath}
                  onChange={handleChange}
                  error={!!validationErrors.saath}
                  helperText={validationErrors.saath}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AssessmentIcon sx={{ color: validationErrors.saath ? 'error.main' : '#00E5FF' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': {
                        borderColor: validationErrors.saath ? 'error.main' : 'rgba(255, 255, 255, 0.23)',
                      },
                      '&:hover fieldset': {
                        borderColor: validationErrors.saath ? 'error.main' : '#00E5FF',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: validationErrors.saath ? 'error.main' : '#00E5FF',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: validationErrors.saath ? 'error.main' : 'rgba(255, 255, 255, 0.7)',
                    },
                    '& .MuiFormHelperText-root': {
                      color: 'error.main',
                    },
                  }}
                />
              </Box>

              <TextField
                fullWidth
                label="High School GPA"
                name="highSchoolGpa"
                type="number"
                value={formData.highSchoolGpa}
                onChange={handleChange}
                error={!!validationErrors.highSchoolGpa}
                helperText={validationErrors.highSchoolGpa}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SchoolIcon sx={{ color: validationErrors.highSchoolGpa ? 'error.main' : '#00E5FF' }} />
                    </InputAdornment>
                  ),
                  endAdornment: <InputAdornment position="end" sx={{ color: 'white' }}>%</InputAdornment>,
                }}
                inputProps={{ 
                  min: 0, 
                  max: 100,
                  step: 0.01
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': {
                      borderColor: validationErrors.highSchoolGpa ? 'error.main' : 'rgba(255, 255, 255, 0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: validationErrors.highSchoolGpa ? 'error.main' : '#00E5FF',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: validationErrors.highSchoolGpa ? 'error.main' : '#00E5FF',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: validationErrors.highSchoolGpa ? 'error.main' : 'rgba(255, 255, 255, 0.7)',
                  },
                  '& .MuiFormHelperText-root': {
                    color: 'error.main',
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
                error={!!validationErrors.password}
                helperText={validationErrors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: validationErrors.password ? 'error.main' : '#00E5FF' }} />
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
                      borderColor: validationErrors.password ? 'error.main' : 'rgba(255, 255, 255, 0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: validationErrors.password ? 'error.main' : '#00E5FF',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: validationErrors.password ? 'error.main' : '#00E5FF',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: validationErrors.password ? 'error.main' : 'rgba(255, 255, 255, 0.7)',
                  },
                  '& .MuiFormHelperText-root': {
                    color: 'error.main',
                  },
                }}
              />

              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                error={!!validationErrors.confirmPassword}
                helperText={validationErrors.confirmPassword}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: validationErrors.confirmPassword ? 'error.main' : '#00E5FF' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                        sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': {
                      borderColor: validationErrors.confirmPassword ? 'error.main' : 'rgba(255, 255, 255, 0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: validationErrors.confirmPassword ? 'error.main' : '#00E5FF',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: validationErrors.confirmPassword ? 'error.main' : '#00E5FF',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: validationErrors.confirmPassword ? 'error.main' : 'rgba(255, 255, 255, 0.7)',
                  },
                  '& .MuiFormHelperText-root': {
                    color: 'error.main',
                  },
                }}
              />

              <Box sx={{ mt: 1 }}>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Password must be at least 8 characters long and contain at least one letter and one number.
                </Typography>
              </Box>

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
                  marginTop: '16px',
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Create Account'
                )}
              </button>

              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    style={{
                      color: '#00E5FF',
                      textDecoration: 'none',
                    }}
                  >
                    Sign In
                  </Link>
                </Typography>
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

export default Register; 
