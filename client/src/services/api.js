import axios from 'axios';

const isDevelopment = window.location.hostname === 'localhost'; // or use a check for your local IP

const API = axios.create({
  baseURL: isDevelopment
    ? 'http://localhost:5000/api' // Use localhost for local development
    : 'http://172.20.10.6:5000/api', // Use your network IP for other devices
});

export default API;
