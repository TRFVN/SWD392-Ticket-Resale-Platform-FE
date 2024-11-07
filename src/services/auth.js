// services/authService.js
import axiosInstance from "../config/axiosConfig";

const authService = {
  login: async (email, password) => {
    const response = await axiosInstance.post("/Auth/sign-in", {
      email,
      password,
    });
    return response.data;
  },

  signup: async (userData) => {
    const response = await axiosInstance.post("/Auth/sign-up", userData);
    return response.data;
  },

  sendVerifyEmail: async (email) => {
    const response = await axiosInstance.post("/Auth/send-verify-email", {
      email,
    });
    return response.data;
  },

  fetchUserData: async (token) => {
    const response = await axiosInstance.get("/Auth/FetchUserByToken", {
      params: { token },
    });
    return response.data;
  },

  googleLogin: async (token) => {
    const response = await axiosInstance.post("/Auth/sign-in-google", {
      token,
    });
    return response.data;
  },
};

export default authService;
