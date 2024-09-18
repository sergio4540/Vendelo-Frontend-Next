// utils/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:3000/', // Cambia esto por la URL de tu API
  auth: {
    username: 'admin', // Cambia según tu configuración
    password: 'secret', // Cambia según tu configuración
  },
});

export default axiosInstance;
