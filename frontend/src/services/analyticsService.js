import axios from 'axios';
import { API_URL, getAuthHeader, handleApiError } from '../utils/authUtils';

/**
 * Get questionnaire completion statistics
 * @returns {Promise<Object>} Statistics about questionnaire completion
 */
export const getCompletionStats = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/analytics/completion-stats/`, 
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetching completion statistics');
  }
};

/**
 * Get questionnaire response trends over time
 * @param {string} period - Time period for trend data (day, week, month)
 * @returns {Promise<Array>} Trend data with dates and counts
 */
export const getResponseTrends = async (period = 'week') => {
  try {
    const response = await axios.get(
      `${API_URL}/analytics/response-trends/?period=${period}`, 
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetching response trends');
  }
};

/**
 * Get major distribution of questionnaire results
 * @returns {Promise<Array>} Distribution data with labels, counts, and percentages
 */
export const getMajorDistribution = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/analytics/major-distribution/`, 
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetching major distribution');
  }
};

/**
 * Get overall system statistics
 * @returns {Promise<Object>} System statistics including counts of students, experts, etc.
 */
export const getSystemStats = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/analytics/system-stats/`, 
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetching system statistics');
  }
}; 
