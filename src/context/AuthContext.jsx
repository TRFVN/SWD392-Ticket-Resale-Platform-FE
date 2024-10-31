// context/AuthContext.jsx
import { createContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { setUser, logout } from "../store/slice/authSlice";
import authService from "../services/auth";

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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
