import axios from "axios";
import Cookies from "js-cookie";
import store from "../store/store";
import { setTokens, logout } from "../store/slice/authSlice";

const BASE_URL =
  "https://tickethub-f6gxgnhngpbue9gs.southeastasia-01.azurewebsites.net/api";

// Constants
const TOKEN_CONFIG = {
  COOKIE_OPTIONS: {
    secure: true,
    sameSite: "strict",
    expires: 1, // 1 day
  },
  HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: TOKEN_CONFIG.HEADERS,
});

// Token refresh state management
let isRefreshing = false;
let failedQueue = [];

// Helper function to check if token exists and is valid
const isTokenValid = (token) => {
  if (!token) return false;
  try {
    const tokenData = JSON.parse(atob(token.split(".")[1]));
    return tokenData.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

// Process queued requests
const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

// Update tokens in storage and headers
const updateTokens = (accessToken, refreshToken) => {
  // Update cookies and localStorage
  Cookies.set("accessToken", accessToken, TOKEN_CONFIG.COOKIE_OPTIONS);
  if (refreshToken) {
    localStorage.setItem("refreshToken", refreshToken);
  }

  // Update axios default headers
  axiosInstance.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;

  // Update redux store
  store.dispatch(
    setTokens({
      accessToken,
      refreshToken: refreshToken || store.getState().auth.refreshToken,
    }),
  );

  return accessToken;
};

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("accessToken");

    // Only add token if it exists and is valid
    if (token && isTokenValid(token)) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 and we haven't retried the request yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If we're already refreshing, queue this request
      if (isRefreshing) {
        try {
          const token = await new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
          originalRequest.headers["Authorization"] = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        } catch (err) {
          return Promise.reject(err);
        }
      }

      // Start refresh process
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const { data } = await axiosInstance.post("/Auth/refresh-token", {
          refreshToken,
        });

        if (!data?.result?.accessToken) {
          throw new Error("Failed to refresh token");
        }

        // Update tokens with new values
        const newAccessToken = updateTokens(
          data.result.accessToken,
          data.result.refreshToken,
        );

        // Update the original request authorization header
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        // Process queued requests
        processQueue(null, newAccessToken);

        // Retry original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Handle refresh failure
        processQueue(refreshError, null);
        store.dispatch(logout());

        // Clear tokens
        Cookies.remove("accessToken", TOKEN_CONFIG.COOKIE_OPTIONS);
        localStorage.removeItem("refreshToken");

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

// Export configured instance
export default axiosInstance;
