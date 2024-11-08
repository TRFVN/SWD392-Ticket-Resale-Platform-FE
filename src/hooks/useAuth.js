// hooks/useAuth.js
import { useContext } from "react";
import { useDispatch } from "react-redux";
import { AuthContext } from "../context/AuthContext";
import { useGoogleLogin } from "@react-oauth/google";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import {
  setUser,
  setTokens,
  setLoading,
  setError,
  setGoogleLoginSuccess,
  logout,
  setRole,
} from "../store/slice/authSlice";
import authService from "../services/auth";
import { de } from "date-fns/locale";

const findRoleFromToken = (decodedToken) => {
  // Tìm key chứa từ "role" (không phân biệt hoa thường)
  const roleKey = Object.keys(decodedToken).find((key) =>
    key.toLowerCase().includes("role"),
  );

  return roleKey ? decodedToken[roleKey] : null;
};

const handleTokenAndDecode = (accessToken) => {
  try {
    const decodedToken = jwtDecode(accessToken);
    console.log("Decoded Token:", decodedToken);

    // Tìm role động
    const role = findRoleFromToken(decodedToken);
    console.log("Found Role:", role);

    // Lưu cả decoded token và role
    localStorage.setItem("decodedToken", JSON.stringify(decodedToken));
    localStorage.setItem("userRole", role);

    return { decodedToken, role };
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  const dispatch = useDispatch();

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const handleFetchUserData = async (token) => {
    dispatch(setLoading(true));
    try {
      const response = await authService.fetchUserData(token);

      if (response.isSuccess) {
        dispatch(setUser(response.result));
        localStorage.setItem("userData", JSON.stringify(response.result));
        return response.result;
      }
      throw new Error("Failed to fetch user data");
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const login = async (email, password) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const response = await authService.login(email, password);

      if (response.isSuccess) {
        const { accessToken, refreshToken } = response.result;

        Cookies.set("accessToken", accessToken, {
          secure: true,
          sameSite: "strict",
        });
        // Decode token và lưu thông tin
        handleTokenAndDecode(accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        dispatch(setTokens({ accessToken, refreshToken }));
        await handleFetchUserData(accessToken);
        return response;
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
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      dispatch(setLoading(true));
      try {
        const response = await authService.googleLogin(
          tokenResponse.access_token,
        );

        if (response.isSuccess) {
          const { accessToken, refreshToken } = response.result;

          // Set cookies cho accessToken
          Cookies.set("accessToken", accessToken, {
            secure: true,
            sameSite: "strict",
          });

          // Decode token và lưu thông tin giống như login thông thường
          const decodedInfo = handleTokenAndDecode(accessToken);
          if (decodedInfo) {
            const { role } = decodedInfo;
            dispatch(setRole(role)); // Nếu bạn cần dispatch role vào redux
          }

          // Lưu refreshToken
          localStorage.setItem("refreshToken", refreshToken);

          // Set tokens vào redux
          dispatch(setTokens({ accessToken, refreshToken }));

          // Fetch user data
          await handleFetchUserData(accessToken);

          // Set google login success
          dispatch(setGoogleLoginSuccess(true));

          return response;
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

  const signup = async (userData) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const response = await authService.signup(userData);

      if (response.isSuccess) {
        try {
          await authService.sendVerifyEmail(userData.email);
          toast.success(
            "Sign up successful. Verification email sent. Please check your inbox.",
          );
        } catch (error) {
          toast.warning(
            "Sign up successful, but there was an issue sending the verification email.",
          );
        }
        return response;
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
    Cookies.remove("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userData");
    dispatch(logout());
  };

  return {
    ...context,
    login,
    googleLogin,
    signup,
    logout: handleLogout,
  };
};
