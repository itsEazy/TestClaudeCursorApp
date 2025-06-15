// API Configuration
// Toggle between 'kubernetes' and 'metro' for development
const DEV_MODE = 'kubernetes'; // or 'metro'

const API_BASE_URL = __DEV__ 
  ? (DEV_MODE === 'kubernetes' ? 'http://localhost:8080' : 'http://localhost:8080')
  : 'https://your-production-api.com'; // Production API

export { API_BASE_URL };