// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || '';

export default API_BASE_URL;

// Helper function to get full API URL
export const getApiUrl = (endpoint) => {
  if (API_BASE_URL) {
    return `${API_BASE_URL}${endpoint}`;
  }
  return endpoint; // Use relative URL for same-origin requests
};
