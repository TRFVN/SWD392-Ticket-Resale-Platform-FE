// TabButton.jsx
import React from "react";

const TabButton = ({ active, icon: Icon, label, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex items-center px-6 py-3.5 
        font-medium rounded-2xl 
        transition-all duration-300 
        cursor-pointer
        hover:scale-105
        active:scale-95
        pointer-events-auto
        ${
          active
            ? "text-white bg-gradient-to-r from-orange-400 to-orange-500 shadow-lg"
            : "text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50"
        }
      `}
    >
      {Icon && (
        <Icon
          size={18}
          className={`${active ? "opacity-100" : "opacity-70"}`}
        />
      )}
      <span className="ml-3">{label}</span>
    </button>
  );
};

export default TabButton;
