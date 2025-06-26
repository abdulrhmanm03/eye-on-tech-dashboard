import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

// Request interceptor - add token to headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle token expiration
api.interceptors.response.use(
  (response) => {
    // Return successful responses as-is
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized responses
    if (error.response?.status === 401) {
      // Clear the expired token
      localStorage.removeItem("token");

      // Optional: Show a message to the user
      // You can customize this based on your notification system
      console.warn("Session expired. Redirecting to login...");

      // Optional: Save current location to redirect back after login
      const currentPath = window.location.pathname + window.location.search;
      if (currentPath !== "/login") {
        localStorage.setItem("redirectPath", currentPath);
      }

      // Redirect to login page
      window.location.href = "/login";
    }

    // For other errors, reject the promise so they can be handled normally
    return Promise.reject(error);
  },
);

export default api;
