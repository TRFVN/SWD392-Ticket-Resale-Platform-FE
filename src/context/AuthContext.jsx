import { createContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { setUser, logout } from "../store/slice/authSlice";
import authService from "../services/auth";
import { toast } from "react-toastify";
import axios from "axios";
import axiosInstance from "../config/axiosConfig";
import {
  setAnalyticsUserId,
  setAnalyticsUserProperties,
  logUserEvent,
} from "../config/firebase";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);
  const [isInitialized, setIsInitialized] = useState(false);

  // Set analytics user ID and properties when user changes
  useEffect(() => {
    if (user) {
      // Set user ID for analytics
      setAnalyticsUserId(user.id);

      // Set user properties
      setAnalyticsUserProperties({
        userRole: user.role,
        userType: user.organizationName ? "organization" : "member",
        hasAvatar: !!user.imageUrl,
      });

      // Log login event
      logUserEvent("user_login", {
        userId: user.id,
        userRole: user.role,
      });
    } else {
      // Clear user ID when logged out
      setAnalyticsUserId(null);
      logUserEvent("user_logout");
    }
  }, [user]);

  const refreshUserData = async () => {
    const accessToken = Cookies.get("accessToken");
    if (!accessToken) return null;

    try {
      const response = await authService.fetchUserData(accessToken);
      if (response.isSuccess) {
        dispatch(setUser(response.result));
        localStorage.setItem("userData", JSON.stringify(response.result));
        return response.result;
      } else {
        throw new Error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error refreshing user data:", error);
      return null;
    }
  };

  const updateUserProfile = async (userData) => {
    const accessToken = Cookies.get("accessToken");
    if (!accessToken) return { success: false, message: "Not authenticated" };

    try {
      // Prepare the update data based on what's provided in userData
      const updateData = {
        fullName: userData.displayName || user?.fullName,
        address: userData.address || user?.address,
        birthDate: userData.birthDate || user?.birthDate,
        avatarUrl: userData.photoURL || userData.avatarUrl || user?.imageUrl,
        country: userData.country || user?.country || "VN",
        gender: userData.gender || user?.gender || "Unknown",
        // Include other fields as needed
        cccd: user?.cccd || "",
        organizationName: user?.organizationName || "",
        taxId: user?.taxId || "",
      };

      const response = await axiosInstance.post(
        "/update-user-profile",
        updateData,
      );

      if (response.data && response.data.isSuccess) {
        // Refresh user data to get updated profile
        await refreshUserData();
        toast.success("Profile updated successfully");
        return { success: true };
      } else {
        throw new Error(response.data?.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
      toast.error(error.message || "Failed to update profile");
      return { success: false, message: error.message };
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = Cookies.get("accessToken");
      if (accessToken) {
        try {
          const response = await authService.fetchUserData(accessToken);
          if (response.isSuccess) {
            dispatch(setUser(response.result));
            localStorage.setItem("userData", JSON.stringify(response.result));
          } else {
            throw new Error("Failed to fetch user data");
          }
        } catch (error) {
          console.error("Error initializing auth:", error);
          dispatch(logout());
        }
      }
      setIsInitialized(true);
    };

    initializeAuth();
  }, [dispatch]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isInitialized,
        refreshUserData,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
