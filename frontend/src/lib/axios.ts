import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001', // Update this if your backend runs on a different port (e.g. 3001)
});

export default api;
