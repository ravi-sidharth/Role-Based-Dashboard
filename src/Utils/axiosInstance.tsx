import axios from "axios";
const axiosInstance = axios.create({
    baseURL: 'https://role-based-dashboard-0vpx.onrender.com/api/',
  });

export default axiosInstance