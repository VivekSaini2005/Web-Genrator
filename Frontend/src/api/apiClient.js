import axios from "axios";

// 1. Setup Axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://web-genrator.onrender.com/api',
  timeout: 300000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Add request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Attach JWT token from localStorage to Authorization header
    const token = localStorage.getItem("token"); // or "accessToken" depending on auth flow

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 3. Handle errors globally
apiClient.interceptors.response.use(
  (response) => response, // Pass through successful responses
  (error) => {
    // Global error handling
    if (!error.response) {
      console.error("Network Exception - The backend might be offline.");
      return Promise.reject(new Error("Network error occurred. Please try again later."));
    }

    const { status, data } = error.response;

    if (status === 401) {
      console.warn("Unauthorized! Clearing token from storage...");
      localStorage.removeItem("token");
      localStorage.removeItem("accessToken"); // clearing both just in case
      // Optional: window.location.href = '/login';
    } else if (status >= 500) {
      console.error(`Server Error (${status}):`, data);
    } else {
      console.error(`Client Error (${status}):`, data);
    }

    const errorMessage = data?.error || data?.message || "An unexpected error occurred.";
    return Promise.reject(new Error(errorMessage));
  }
);

export default apiClient;
