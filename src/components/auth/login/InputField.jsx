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
}) => (
  <motion.div
    className="mb-4 sm:mb-6"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <label
      htmlFor={name}
      className="block text-gray-700 dark:text-gray-200 text-sm font-medium mb-1.5 flex items-center"
    >
      {icon}
      <span className="ml-2">{label}</span>
    </label>
    <div className="relative">
      <Field
        name={name}
        type={type}
        placeholder={placeholder}
        className="w-full px-3 sm:px-4 py-2.5 rounded-lg bg-white dark:bg-gray-800 
          text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50
          transition-all duration-300 text-sm sm:text-base
          border border-gray-300 dark:border-gray-600 hover:border-gray-400
          disabled:opacity-50 disabled:cursor-not-allowed"
      />
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
