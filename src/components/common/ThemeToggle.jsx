import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { HiMoon, HiSun } from "react-icons/hi";
import { toggleTheme } from "../../store/slice/themeSlice";

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
      className={`fixed top-4 right-4 p-2 rounded-full z-50
        ${
          isDarkMode
            ? "bg-gray-800 text-orange-400 hover:bg-gray-700"
            : "bg-white text-orange-500 hover:bg-gray-100"
        } 
        shadow-md transition-colors duration-200`}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? (
        <HiSun className="w-5 h-5" />
      ) : (
        <HiMoon className="w-5 h-5" />
      )}
    </button>
  );
};

export default ThemeToggle;
