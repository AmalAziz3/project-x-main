import axios from 'axios';
import { API_URL, handleApiError, getAuthHeader } from '../utils/authUtils';

/**
 * Get all lectures
 * @returns {Promise<Array>} Array of lecture objects
 */
export const getAllLectures = async () => {
  try {
    const response = await axios.get(`${API_URL}/lectures/`, getAuthHeader());
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'fetching lectures');
  }
};

/**
 * Get a specific lecture by ID
 * @param {string|number} id - The lecture ID
 * @returns {Promise<Object>} Lecture object
 */
export const getLectureById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/lectures/${id}/`, getAuthHeader());
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'fetching lecture details');
  }
};

/**
 * Create a new lecture
 * @param {Object} lectureData - The lecture data
 * @returns {Promise<Object>} Created lecture object
 */
export const createLecture = async (lectureData) => {
  try {
    const response = await axios.post(`${API_URL}/lectures/`, lectureData, getAuthHeader());
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'creating lecture');
  }
};

/**
 * Update an existing lecture
 * @param {string|number} id - The lecture ID
 * @param {Object} lectureData - The updated lecture data
 * @returns {Promise<Object>} Updated lecture object
 */
export const updateLecture = async (id, lectureData) => {
  try {
    const response = await axios.put(`${API_URL}/lectures/${id}/`, lectureData, getAuthHeader());
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'updating lecture');
  }
};

/**
 * Delete a lecture
 * @param {string|number} id - The lecture ID
 * @returns {Promise<Object>} Response data
 */
export const deleteLecture = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/lectures/${id}/`, getAuthHeader());
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'deleting lecture');
  }
};

/**
 * Register for a lecture
 * @param {string|number} lectureId - The lecture ID
 * @returns {Promise<Object>} Response data
 */
export const registerForLecture = async (lectureId) => {
  try {
    const response = await axios.post(`${API_URL}/lectures/${lectureId}/register/`, {}, getAuthHeader());
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'registering for lecture');
  }
};

/**
 * Unregister from a lecture
 * @param {string|number} lectureId - The lecture ID
 * @returns {Promise<Object>} Response data
 */
export const unregisterFromLecture = async (lectureId) => {
  try {
    const response = await axios.post(`${API_URL}/lectures/${lectureId}/unregister/`, {}, getAuthHeader());
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'unregistering from lecture');
  }
}; 
