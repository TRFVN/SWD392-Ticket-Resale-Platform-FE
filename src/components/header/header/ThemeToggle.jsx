import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Sun, Moon } from "lucide-react";
import { toggleTheme } from "../../../store/slice/themeSlice";

/**
 * Simple modern theme toggle button component
 */
const ThemeToggle = () => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  const handleToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <button
      onClick={handleToggle}
      className="relative h-8 w-8 rounded-full bg-primary/10 dark:bg-gray-800 flex items-center 
        justify-center hover:bg-primary/20 dark:hover:bg-gray-700 transition-colors duration-200 shadow-sm"
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? (
        <Moon className="w-4 h-4 text-gray-200" />
      ) : (
        <Sun className="w-4 h-4 text-primary" />
      )}
    </button>
  );
};

export default ThemeToggle;
