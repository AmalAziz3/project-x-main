/**
 * Validates if a token exists in localStorage and returns it
 * @returns {string} The authentication token
 * @throws {Error} If no token is found
 */
export const validateToken = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('AuthUtils: No authentication token found');
    throw new Error('You are not logged in. Please log in to continue.');
  }
  return token;
};

/**
 * Returns headers object with authorization token
 * @returns {Object} Headers object with Authorization
 * @throws {Error} If no token is found
 */
export const getAuthHeader = () => {
  const token = validateToken();
  console.log('AuthUtils: Using token for auth header:', token.substring(0, 10) + '...');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

/**
 * Standard error handler for API requests
 * @param {Error} error - The error object from axios
 * @param {string} operation - Description of the operation that failed
 * @throws {Error} A formatted error with appropriate message
 */
export const handleApiError = (error) => {
  if (!error.response) {
    return 'Network error. Please check your connection and try again.';
  }

  const { status, data } = error.response;

  // Handle different status codes
  switch (status) {
    case 400: // Bad Request - usually validation errors
      // Check if the response has a detail field (DRF format)
      if (data.detail) {
        return data.detail;
      }
      
      // Check for email-specific errors
      if (data.email) {
        if (Array.isArray(data.email)) {
          return `Email error: ${data.email.join(', ')}`;
        }
        return `Email error: ${data.email}`;
      }
      
      // Check for field-specific validation errors
      const validationErrors = [];
      for (const [field, errors] of Object.entries(data)) {
        if (Array.isArray(errors)) {
          // Format field name for readability (e.g., first_name -> First name)
          const formattedField = field
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          
          validationErrors.push(`${formattedField}: ${errors.join(', ')}`);
        } else if (typeof errors === 'string') {
          const formattedField = field
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          
          validationErrors.push(`${formattedField}: ${errors}`);
        }
      }
      
      return validationErrors.length > 0
        ? validationErrors.join('; ')
        : 'Invalid data provided. Please check your input and try again.';
      
    case 401: // Unauthorized
      return 'Authentication failed. Please log in again.';
      
    case 403: // Forbidden
      return 'You do not have permission to perform this action.';
      
    case 404: // Not Found
      return 'The requested resource was not found.';
      
    case 500: // Server Error
    case 502: // Bad Gateway
    case 503: // Service Unavailable
      return 'Server error. Please try again later.';
      
    default:
      return `Error: ${status} - ${data.detail || 'Something went wrong. Please try again.'}`;
  }
};

// Base API URL for all requests
export const API_URL = '/api'; 
