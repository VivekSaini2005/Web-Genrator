import axios from "axios";

axios.defaults.withCredentials = true;

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
    const token = localStorage.getItem("token");

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
  async (error) => {
    // Global error handling
    if (!error.response) {
      console.error("Network Exception - The backend might be offline.");
      return Promise.reject(new Error("Network error occurred. Please try again later."));
    }

    const { status, data } = error.response;
    const originalRequest = error.config || {};
    const requestUrl = originalRequest.url || "";

    const clearAuthState = () => {
      localStorage.removeItem("token");
    };

    const redirectToLogin = () => {
      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    };

    if (status === 401) {
      if (requestUrl.includes("/auth/refresh")) {
        clearAuthState();
        redirectToLogin();
        return Promise.reject(new Error(data?.error || data?.message || "Session expired. Please log in again."));
      }

      const authError = data?.error;

      if (authError !== "TOKEN_EXPIRED") {
        clearAuthState();
        redirectToLogin();
        return Promise.reject(new Error(authError || data?.message || "Unauthorized. Please log in again."));
      }

      if (!originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshResponse = await axios.post(
            `${apiClient.defaults.baseURL}/auth/refresh`,
            {},
            { withCredentials: true }
          );

          const newAccessToken = refreshResponse.data?.accessToken;

          if (!newAccessToken) {
            throw new Error("Refresh response did not include an access token.");
          }

          localStorage.setItem("token", newAccessToken);
          apiClient.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          return apiClient(originalRequest);
        } catch (refreshError) {
          clearAuthState();
          redirectToLogin();
          return Promise.reject(refreshError);
        }
      }

      clearAuthState();
      redirectToLogin();
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
