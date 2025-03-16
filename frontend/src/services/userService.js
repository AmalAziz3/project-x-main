import axios from 'axios';
import { API_URL, getAuthHeader, handleApiError } from '../utils/authUtils';

// Get user profile
export const getUserProfile = async () => {
  try {
    console.log('Fetching user profile');
    const response = await axios.get(`${API_URL}/users/profile/`, getAuthHeader());
    console.log('User profile response:', response.data);
    
    const user = response.data;
    return {
      ...user,
      is_admin: user.role === 'admin',
      is_expert: user.role === 'expert',
      is_student: user.role === 'student'
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw handleApiError(error, 'fetching user profile');
  }
};

// Update user profile
export const updateUserProfile = async (userData) => {
  try {
    console.log('updateUserProfile called with data:', userData);
    
    // Make a copy of the data to avoid modifying the original
    const dataToSend = { ...userData };
    
    console.log('Sending data to API:', dataToSend);
    console.log('API URL:', `${API_URL}/users/profile/`);
    console.log('Headers:', getAuthHeader());
    
    const response = await axios.put(`${API_URL}/users/profile/`, dataToSend, getAuthHeader());
    console.log('Update profile raw response:', response);
    console.log('Update profile response data:', response.data);
    
    const user = response.data;
    return {
      ...user,
      is_admin: user.role === 'admin',
      is_expert: user.role === 'expert',
      is_student: user.role === 'student'
    };
  } catch (error) {
    console.error('Error updating user profile:', error);
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
    }
    throw handleApiError(error, 'updating user profile');
  }
};

// Validate expert invitation token
export const validateExpertToken = async (token) => {
  try {
    console.log('Validating expert token:', token);
    const response = await axios.get(`${API_URL}/users/expert/validate-token/${token}/`);
    console.log('Token validation response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error validating expert token:', error);
    throw handleApiError(error, 'validating expert token');
  }
};

// Create expert invitation
export const createExpertInvitation = async (email) => {
  try {
    console.log('Creating expert invitation for:', email);
    const response = await axios.post(
      `${API_URL}/users/expert/invite/`,
      { email },
      getAuthHeader()
    );
    console.log('Expert invitation response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating expert invitation:', error);
    throw handleApiError(error, 'creating expert invitation');
  }
};

// Get all expert invitations (admin only)
export const getExpertInvitations = async () => {
  try {
    console.log('Fetching expert invitations');
    const response = await axios.get(`${API_URL}/users/expert/invite/`, getAuthHeader());
    console.log('Expert invitations response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching expert invitations:', error);
    throw handleApiError(error, 'fetching expert invitations');
  }
}; 
