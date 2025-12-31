// frontend/src/config/api.js
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  FRONTEND_URL: 'http://localhost:5173'
};

export const API_BASE_URL = API_CONFIG.BASE_URL;
export default API_CONFIG;
