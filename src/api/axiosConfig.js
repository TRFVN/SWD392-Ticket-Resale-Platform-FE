import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://localhost:7103/api",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");

      try {
        const res = await axiosInstance.post("/authentication/refresh-token", {
          refreshToken,
        });
        if (res.status === 200) {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("refreshToken", res.data.refreshToken);
          axiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${res.data.token}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error("Error refreshing token:", refreshError);
        // Handle logout or redirect to login page
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
