import { createContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../config/axiosConfig";
import Cookies from "js-cookie";
import {
  setUser,
  setTokens,
  setLoading,
  setError,
  logout,
  // Thêm action mới nếu cần
  // setSignupSuccess,
} from "../store/slice/authSlice";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = Cookies.get("accessToken");
      if (accessToken) {
        try {
          await fetchUserData(accessToken);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          handleLogout();
        }
      }
    };

    initializeAuth();
  }, [dispatch]);

  const fetchUserData = async (token) => {
    try {
      const response = await axiosInstance.get("/Auth/FetchUserByToken", {
        params: { token },
      });

      if (response.data && response.data.isSuccess) {
        dispatch(setUser(response.data.result));
      } else {
        throw new Error(response.data.message || "Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw error;
    }
  };

  const handleLogin = async (email, password) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const response = await axiosInstance.post("/Auth/sign-in", {
        email,
        password,
      });

      if (response.data && response.data.isSuccess) {
        const { accessToken, refreshToken } = response.data.result;

        Cookies.set("accessToken", accessToken, {
          secure: true,
          sameSite: "strict",
        });
        localStorage.setItem("refreshToken", refreshToken);

        dispatch(setTokens({ accessToken, refreshToken }));
        await fetchUserData(accessToken);

        dispatch(setLoading(false));
        return response.data;
      } else {
        throw new Error(response.data.message || "Login failed");
      }
    } catch (error) {
      dispatch(setLoading(false));
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An error occurred during login";
      dispatch(setError(errorMessage));
      throw new Error(errorMessage);
    }
  };

  const sendVerificationEmail = async (email) => {
    try {
      const response = await axiosInstance.post("/Auth/send-verify-email", {
        email,
      });
      if (response.data && response.data.isSuccess) {
        console.log("Verification email sent successfully");
      } else {
        console.error("Failed to send verification email");
      }
    } catch (error) {
      console.error("Error sending verification email:", error);
    }
  };

  const handleSignup = async (userData) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const response = await axiosInstance.post("/Auth/sign-up", userData);

      if (response.data && response.data.isSuccess) {
        dispatch(setLoading(false));
        // Nếu bạn muốn lưu trữ thông tin về việc đăng ký thành công
        // dispatch(setSignupSuccess(true));

        // Tự động gửi email xác minh
        await sendVerificationEmail(userData.email);

        return response.data;
      } else {
        throw new Error(response.data.message || "Signup failed");
      }
    } catch (error) {
      dispatch(setLoading(false));
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An error occurred during signup";
      dispatch(setError(errorMessage));
      throw new Error(errorMessage);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("refreshToken");
    Cookies.remove("accessToken");
    dispatch(logout());
  };

  const clearError = () => {
    dispatch(setError(null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login: handleLogin,
        signup: handleSignup,
        logout: handleLogout,
        loading,
        error,
        clearError,
        sendVerificationEmail, // Thêm hàm này vào context nếu bạn muốn sử dụng nó ở nơi khác
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
