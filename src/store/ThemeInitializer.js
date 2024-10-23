import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initializeTheme, setTheme } from "./slice/themeSlice";

const ThemeInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  // Tạo handleSystemThemeChange với useCallback để tránh tạo lại function
  const handleSystemThemeChange = useCallback(
    (e) => {
      const hasUserPreference = localStorage.getItem("theme") !== null;
      if (!hasUserPreference) {
        dispatch(setTheme(e.matches));
      }
    },
    [dispatch],
  );

  useEffect(() => {
    // Initialize theme based on redux state
    dispatch(initializeTheme());

    // Apply theme class
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Set up system theme change listener
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    // Modern way to add event listener for theme change
    try {
      mediaQuery.addEventListener("change", handleSystemThemeChange);
    } catch (e1) {
      try {
        // Fallback for older browsers
        mediaQuery.addListener(handleSystemThemeChange);
      } catch (e2) {
        console.error("Browser doesn't support system theme detection");
      }
    }

    // Cleanup
    return () => {
      try {
        mediaQuery.removeEventListener("change", handleSystemThemeChange);
      } catch (e1) {
        try {
          // Fallback cleanup for older browsers
          mediaQuery.removeListener(handleSystemThemeChange);
        } catch (e2) {
          console.error("Browser doesn't support system theme detection");
        }
      }
    };
  }, [dispatch, isDarkMode, handleSystemThemeChange]);

  // Effect to handle theme changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return children;
};

export default ThemeInitializer;
