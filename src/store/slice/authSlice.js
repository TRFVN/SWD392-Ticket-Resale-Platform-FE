import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  user: null,
  accessToken: Cookies.get("accessToken") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    setTokens: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      Cookies.set("accessToken", action.payload.accessToken, {
        secure: true,
        sameSite: "strict",
      });
      localStorage.setItem("refreshToken", action.payload.refreshToken);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    logout: (state) => {
      Cookies.remove("accessToken");
      localStorage.removeItem("refreshToken");
      return { ...initialState, accessToken: null, refreshToken: null };
    },
  },
});

export const { setUser, setTokens, setLoading, setError, logout } =
  authSlice.actions;

export default authSlice.reducer;
