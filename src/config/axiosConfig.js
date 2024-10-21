import axios from "axios";
import Cookies from "js-cookie";

const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";
const BASE_URL =
  "https://tickethub-f6gxgnhngpbue9gs.southeastasia-01.azurewebsites.net/api";

const axiosInstance = axios.create({
  baseURL: `${CORS_PROXY}${BASE_URL}`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise((resolve, reject) => {
        const refreshToken = localStorage.getItem("refreshToken");
        axiosInstance
          .post("/Auth/refresh-token", { refreshToken })
          .then((res) => {
            if (res.data?.result?.accessToken) {
              const newAccessToken = res.data.result.accessToken;
              Cookies.set("accessToken", newAccessToken, {
                secure: true,
                sameSite: "strict",
              });
              axiosInstance.defaults.headers.common["Authorization"] =
                "Bearer " + newAccessToken;
              originalRequest.headers["Authorization"] =
                "Bearer " + newAccessToken;
              processQueue(null, newAccessToken);
              resolve(axiosInstance(originalRequest));
            } else {
              processQueue(new Error("Failed to refresh token"), null);
              reject(error);
            }
          })
          .catch((refreshError) => {
            processQueue(refreshError, null);
            reject(refreshError);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
