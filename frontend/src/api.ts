import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3521',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
