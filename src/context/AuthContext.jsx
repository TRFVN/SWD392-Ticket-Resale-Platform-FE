import { createContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../api/axiosConfig";
import Cookies from "js-cookie";
import {
  setUser,
  setTokens,
  setLoading,
  setError,
  logout,
} from "../store/slice/authSlice";
import { toast } from "react-toastify";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);
  const [isInitialized, setIsInitialized] = useState(false);

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
      setIsInitialized(true);
    };

    initializeAuth();
  }, []);

  const fetchUserData = async (token) => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.get("/Auth/FetchUserByToken", {
        params: { token },
      });

      if (response.data && response.data.isSuccess) {
        dispatch(setUser(response.data.result));
        localStorage.setItem("userData", JSON.stringify(response.data.result));
      } else {
        throw new Error(response.data.message || "Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw error;
    } finally {
      dispatch(setLoading(false));
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

        return response.data;
      } else {
        throw new Error(response.data.message || "Login failed");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An error occurred during login";
      dispatch(setError(errorMessage));
      throw new Error(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleSignup = async (userData) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const response = await axiosInstance.post("/Auth/sign-up", userData);

      if (response.data && response.data.isSuccess) {
        try {
          await axiosInstance.post("/Auth/send-verify-email", {
            email: userData.email,
          });
          toast.success(
            "Sign up successful. Verification email sent. Please check your inbox.",
          );
        } catch (verifyError) {
          console.error("Error sending verification email:", verifyError);
          toast.warning(
            "Sign up successful, but there was an issue sending the verification email. Please try to verify your email later.",
          );
        }

        return response.data;
      } else {
        throw new Error(response.data.message || "Signup failed");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An error occurred during signup";
      dispatch(setError(errorMessage));
      toast.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userData");
    Cookies.remove("accessToken");
    dispatch(logout());
  };

  const refreshUserData = async () => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      await fetchUserData(accessToken);
    }
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
        isInitialized,
        refreshUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
