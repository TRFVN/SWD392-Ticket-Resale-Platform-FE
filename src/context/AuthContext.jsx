// AuthContext.jsx
import { createContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../config/axiosConfig";
import Cookies from "js-cookie";
import {
  setUser,
  setTokens,
  setLoading,
  setError,
  setGoogleLoginSuccess,
  logout,
} from "../store/slice/authSlice";
import { toast } from "react-toastify";
import { useGoogleLogin } from "@react-oauth/google";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);
  const [isInitialized, setIsInitialized] = useState(false);

  const fetchUserData = async (token) => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.get("/Auth/FetchUserByToken", {
        params: { token },
      });

      if (response.data?.isSuccess) {
        dispatch(setUser(response.data.result));
        localStorage.setItem("userData", JSON.stringify(response.data.result));
        return response.data.result;
      }
      throw new Error("Failed to fetch user data");
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = Cookies.get("accessToken");
      if (accessToken) {
        try {
          await fetchUserData(accessToken);
        } catch (error) {
          handleLogout();
        }
      }
      setIsInitialized(true);
    };

    initializeAuth();
  }, []);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      dispatch(setLoading(true));
      try {
        const response = await axiosInstance.post("/Auth/sign-in-google", {
          token: tokenResponse.access_token,
        });

        if (response.data?.isSuccess) {
          const { accessToken, refreshToken } = response.data.result;

          Cookies.set("accessToken", accessToken, {
            secure: true,
            sameSite: "strict",
          });
          localStorage.setItem("refreshToken", refreshToken);
          dispatch(setTokens({ accessToken, refreshToken }));
          await fetchUserData(accessToken);
          dispatch(setGoogleLoginSuccess(true)); // Set success flag
          return response.data;
        }
        throw new Error("Google login failed");
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Google login failed";
        dispatch(setError(errorMessage));
        throw error;
      } finally {
        dispatch(setLoading(false));
      }
    },
    flow: "implicit",
    scope: "profile email openid",
  });

  const handleLogin = async (email, password) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const response = await axiosInstance.post("/Auth/sign-in", {
        email,
        password,
      });

      if (response.data?.isSuccess) {
        const { accessToken, refreshToken } = response.data.result;

        Cookies.set("accessToken", accessToken, {
          secure: true,
          sameSite: "strict",
        });
        localStorage.setItem("refreshToken", refreshToken);
        dispatch(setTokens({ accessToken, refreshToken }));
        await fetchUserData(accessToken);
        return response.data;
      }
      throw new Error("Login failed");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An error occurred during login";
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

      if (response.data?.isSuccess) {
        try {
          await axiosInstance.post("/Auth/send-verify-email", {
            email: userData.email,
          });
          toast.success(
            "Sign up successful. Verification email sent. Please check your inbox.",
          );
        } catch (error) {
          toast.warning(
            "Sign up successful, but there was an issue sending the verification email.",
          );
        }
        return response.data;
      }
      throw new Error("Signup failed");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An error occurred during signup";
      dispatch(setError(errorMessage));
      toast.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleLogout = () => {
    dispatch(logout());
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
        googleLogin: handleGoogleLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
