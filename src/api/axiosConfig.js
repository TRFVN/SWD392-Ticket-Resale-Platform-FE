import axios from "axios";
import Cookies from "js-cookie";
const axiosInstance = axios.create({
  baseURL:
    "https://tickethub-f6gxgnhngpbue9gs.southeastasia-01.azurewebsites.net/api",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

const publicEndpoints = [
  "/Auth/sign-in",
  // "/Auth/sign-in-google",
  "/Auth/forgot-password",
  "/Auth/send-verify-email",
];

axiosInstance.interceptors.request.use(
  (config) => {
    const isPublicEndpoint = publicEndpoints.some((endpoint) =>
      config.url.endsWith(endpoint),
    );

    if (!isPublicEndpoint) {
      const token = Cookies.get("accessToken");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
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
        const res = await axiosInstance.post("/Auth/refresh-token", {
          refreshToken,
        });

        if (res.status === 200) {
          Cookies.set("accessToken", res.result.accessToken, {
            secure: true,
            sameSite: "strict",
          });

          localStorage.setItem("refreshToken", res.result.refreshToken);

          axiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${res.result.token}`;

          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error("Error refreshing token:", refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
