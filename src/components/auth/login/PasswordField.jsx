import React from "react";
import { motion } from "framer-motion";
import { Field } from "formik";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

export const PasswordField = ({
  label,
  name,
  placeholder,
  showPassword,
  togglePasswordVisibility,
  errors,
  touched,
}) => (
  <motion.div
    className="mb-6"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <label
      htmlFor={name}
      className="block text-gray-700 dark:text-gray-200 text-sm font-medium mb-2 flex items-center"
    >
      <FaLock className="text-gray-600 dark:text-gray-400" />
      <span className="ml-2">{label}</span>
    </label>
    <div className="relative">
      <Field
        name={name}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-lg bg-white dark:bg-gray-800
                   text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400
                   focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50
                   transition-all duration-300
                   border border-gray-300 dark:border-gray-600 hover:border-gray-400"
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 
                   hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200
                   focus:outline-none focus:text-orange-400"
      >
        {showPassword ? <FaEyeSlash /> : <FaEye />}
      </button>
      {errors[name] && touched[name] && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-red-500 text-xs sm:text-sm"
        >
          {errors[name]}
        </motion.p>
      )}
    </div>
  </motion.div>
);
