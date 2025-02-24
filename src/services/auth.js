import axiosInstance from "../config/axiosConfig";

const authService = {
  login: async (email, password) => {
    const response = await axiosInstance.post("/sign-in", {
      email,
      password,
    });
    return response.data;
  },

  signupCustomer: async (userData) => {
    const response = await axiosInstance.post("/sign-up-customer", userData);
    return response.data;
  },

  signupOrganization: async (userData) => {
    const response = await axiosInstance.post(
      "/sign-up-organization",
      userData,
    );
    return response.data;
  },

  sendVerifyEmail: async (email) => {
    const response = await axiosInstance.post("/send-verify-email", {
      email,
    });
    return response.data;
  },

  fetchUserData: async (token) => {
    const response = await axiosInstance.get("/user", {
      params: { token },
    });
    return response.data;
  },

  googleLogin: async (token) => {
    const response = await axiosInstance.post("/sign-in-google", {
      token,
    });
    return response.data;
  },
};

export default authService;
