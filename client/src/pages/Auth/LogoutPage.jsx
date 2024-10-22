// axiosInstance.js
import axios from 'axios';
import { logout } from '../../Redux/Auth/authSlice'; // Import action logout từ authSlice
import store from '../../Redux/store'; // Import store của Redux

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000',
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 403) {
      // Xóa toàn bộ localStorage
      localStorage.clear();

      // Dispatch action logout để cập nhật state
      store.dispatch(logout());

      // Optional: Redirect to login page or show a message
      window.location.href = '/login'; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;