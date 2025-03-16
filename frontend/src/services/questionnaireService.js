import axios from 'axios';
import { API_URL, getAuthHeader, handleApiError } from '../utils/authUtils';

// Get all questions with their choices
export const getQuestions = async () => {
  try {
    const response = await axios.get(`${API_URL}/questionnaire/questions/`, getAuthHeader());
    console.log('Questions fetched successfully:', response.data.length);
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetching questions');
  }
};

// Submit questionnaire responses
export const submitQuestionnaire = async (responses) => {
  try {
    const response = await axios.post(
      `${API_URL}/questionnaire/submit/`, 
      { responses },
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    handleApiError(error, 'submitting questionnaire');
  }
};

// Get user's questionnaire results
export const getUserResults = async () => {
  try {
    const response = await axios.get(`${API_URL}/questionnaire/results/`, getAuthHeader());
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetching results');
  }
};

// Get specific result details
export const getResultDetails = async (resultId) => {
  try {
    const response = await axios.get(`${API_URL}/questionnaire/results/${resultId}/`, getAuthHeader());
    return response.data;
  } catch (error) {
    handleApiError(error, 'fetching result details');
  }
}; 
