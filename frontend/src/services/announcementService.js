import axios from 'axios';
import { API_URL, getAuthHeader, handleApiError } from '../utils/authUtils';

// Get all announcements
export const getAnnouncements = async () => {
  try {
    const response = await axios.get(`${API_URL}/notifications/`, getAuthHeader());
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetching announcements');
  }
};

// Create a new announcement
export const createAnnouncement = async (announcementData) => {
  try {
    const response = await axios.post(
      `${API_URL}/notifications/`, 
      announcementData, 
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    handleApiError(error, 'creating announcement');
  }
};

// Update an announcement
export const updateAnnouncement = async (id, announcementData) => {
  try {
    const response = await axios.put(
      `${API_URL}/notifications/${id}/`, 
      announcementData, 
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    handleApiError(error, 'updating announcement');
  }
};

// Delete an announcement
export const deleteAnnouncement = async (id) => {
  try {
    const response = await axios.delete(
      `${API_URL}/notifications/${id}/`, 
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    handleApiError(error, 'deleting announcement');
  }
}; 
