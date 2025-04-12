import React from "react";
import { motion } from "framer-motion";
import { Field } from "formik";

export const InputField = ({
  icon,
  label,
  name,
  type,
  placeholder,
  errors,
  touched,
  isDarkMode = true,
}) => (
  <motion.div
    className="mb-5"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: 0.1 }}
  >
    <label
      htmlFor={name}
      className={`block text-sm font-medium mb-2 flex items-center
        ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
    >
      {icon && <span className="text-orange-400 mr-2">{icon}</span>}
      {label}
    </label>
    <div className="relative">
      <Field
        name={name}
        type={type}
        id={name}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-xl 
          focus:outline-none focus:ring-1 focus:ring-orange-400/70 focus:border-transparent
          transition-all duration-200 text-sm
          disabled:opacity-60 disabled:cursor-not-allowed
          ${
            isDarkMode
              ? "bg-gray-800/50 backdrop-blur-sm text-white placeholder-gray-500 border-gray-700/50 hover:border-gray-600"
              : "bg-white text-gray-800 placeholder-gray-400 border-gray-200 hover:border-gray-300 shadow-sm"
          } 
          border`}
      />
      {errors[name] && touched[name] && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className={`mt-1.5 text-xs flex items-center
            ${isDarkMode ? "text-orange-400" : "text-red-500"}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5 mr-1.5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {errors[name]}
        </motion.p>
      )}
    </div>
  </motion.div>
);
