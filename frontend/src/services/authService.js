import axios from 'axios';
import { API_URL, handleApiError } from '../utils/authUtils';

// Login user
export const loginUser = async (credentials) => {
  try {
    console.log('AuthService: Attempting to login with credentials:', {
      email: credentials.email,
      password: '******', // Don't log actual password
      role: credentials.role
    });
    
    // Log the API URL being used
    console.log('AuthService: API URL:', `${API_URL}/users/login/`);
    
    const response = await axios.post(`${API_URL}/users/login/`, {
      email: credentials.email,
      password: credentials.password
    });
    
    console.log('AuthService: Login response:', response);
    console.log('AuthService: Login response data:', response.data);
    
    // Store tokens in localStorage
    if (response.data.access) {
      console.log('AuthService: Storing access token in localStorage');
      localStorage.setItem('token', response.data.access);
    } else {
      console.warn('AuthService: No access token in response');
    }
    
    if (response.data.refresh) {
      console.log('AuthService: Storing refresh token in localStorage');
      localStorage.setItem('refreshToken', response.data.refresh);
    } else {
      console.warn('AuthService: No refresh token in response');
    }
    
    // Ensure role properties are set
    const user = response.data.user || {};
    console.log('AuthService: User data from response:', user);
    
    const enhancedUser = {
      ...user,
      is_admin: user.role === 'admin',
      is_expert: user.role === 'expert',
      is_student: user.role === 'student'
    };
    
    console.log('AuthService: Enhanced user data:', enhancedUser);
    
    return {
      user: enhancedUser,
      role: user.role
    };
  } catch (error) {
    console.error('AuthService: Login error:', error);
    console.error('AuthService: Error response:', error.response);
    throw new Error(handleApiError(error));
  }
};

// Register user
export const registerUser = async (userData) => {
  try {
    console.log('Registering user with data:', {
      ...userData,
      password: '******' // Don't log actual password
    });
    
    // Log the API URL being used
    console.log('AuthService: API URL for registration:', `${API_URL}/users/register/`);
    
    const response = await axios.post(`${API_URL}/users/register/`, userData);
    
    console.log('Registration response:', response.data);
    
    // Store tokens in localStorage
    if (response.data.access) {
      localStorage.setItem('token', response.data.access);
    }
    if (response.data.refresh) {
      localStorage.setItem('refreshToken', response.data.refresh);
    }
    
    // Get user profile after registration
    const userProfile = await getUserProfile();
    
    // Return user data along with any verification message and code
    return {
      user: userProfile,
      role: userProfile.role,
      message: response.data.message || null,
      dev_verification_code: response.data.dev_verification_code || null
    };
  } catch (error) {
    console.error('Registration error:', error);
    console.error('Registration error response:', error.response?.data || 'No response data');
    
    // If we have validation errors, log them specifically
    if (error.response?.data) {
      Object.entries(error.response.data).forEach(([field, errors]) => {
        console.error(`Validation error for ${field}:`, errors);
      });
    }
    
    throw new Error(handleApiError(error));
  }
};

// Logout user
export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('authState');
};

// Request password reset
export const requestPasswordReset = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/users/password/reset/`, { email });
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Reset password with token
export const resetPassword = async (token, password, confirm_password) => {
  try {
    const response = await axios.post(`${API_URL}/users/password/reset/confirm/`, { 
      token, 
      password,
      confirm_password
    });
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Get user profile
export const getUserProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await axios.get(`${API_URL}/users/profile/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    const user = response.data;
    return {
      ...user,
      is_admin: user.role === 'admin',
      is_expert: user.role === 'expert',
      is_student: user.role === 'student'
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw new Error(handleApiError(error));
  }
}; 
