import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { FaLock, FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";
import axios from "axios";
import axiosInstance from "../../config/axiosConfig";

const PasswordField = ({
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
      className="block text-sm font-medium mb-2 flex items-center dark:text-gray-200 text-gray-700"
    >
      <FaLock className="dark:text-gray-400 text-gray-600" />
      <span className="ml-2">{label}</span>
    </label>
    <div className="relative">
      <Field
        name={name}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        className={`w-full px-4 py-2 rounded-lg 
                   dark:bg-dark-secondary dark:text-gray-200 dark:placeholder-gray-400 dark:border-gray-600
                   bg-white text-gray-800 placeholder-gray-500
                   focus:outline-none focus:ring-2 focus:ring-orange-400
                   transition-all duration-300
                   border ${
                     errors[name] && touched[name]
                       ? "border-red-500"
                       : "dark:border-gray-600 border-gray-300 hover:border-gray-400 dark:hover:border-gray-500"
                   }`}
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 dark:text-gray-400 dark:hover:text-gray-200 text-gray-500 hover:text-gray-700 transition-colors duration-200"
      >
        {showPassword ? <FaEyeSlash /> : <FaEye />}
      </button>
      {errors[name] && touched[name] && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-red-500 dark:text-red-400 text-sm"
        >
          {errors[name]}
        </motion.p>
      )}
    </div>
  </motion.div>
);

const ChangePassword = ({ onClose }) => {
  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmNewPassword: false,
  });
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" });

  const validationSchema = Yup.object().shape({
    oldPassword: Yup.string()
      .required("Current password is required")
      .min(6, "Password must be at least 6 characters"),
    newPassword: Yup.string()
      .required("New password is required")
      .min(6, "Password must be at least 6 characters")
      .notOneOf(
        [Yup.ref("oldPassword")],
        "New password must be different from current password",
      ),
    confirmNewPassword: Yup.string()
      .required("Please confirm your new password")
      .oneOf([Yup.ref("newPassword")], "Passwords must match"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await axiosInstance.post("Auth/change-password", {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
        confirmNewPassword: values.confirmNewPassword,
      });

      setSubmitStatus({
        type: "success",
        message: "Password successfully changed",
      });
      resetForm();
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message:
          error.response?.data?.message ||
          "Failed to change password. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm z-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="dark:bg-dark-primary bg-white rounded-lg shadow-xl p-8 w-full max-w-md relative dark:shadow-2xl"
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 dark:text-gray-400 dark:hover:text-gray-200 text-gray-400 hover:text-gray-600 transition duration-200"
          >
            <FaTimes className="w-5 h-5" />
          </button>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold dark:text-gray-200 text-gray-800 mb-2">
              Change Password
            </h2>
            <p className="text-sm dark:text-gray-400 text-gray-600">
              Please enter your current password and choose a new one
            </p>
          </div>

          <Formik
            initialValues={{
              oldPassword: "",
              newPassword: "",
              confirmNewPassword: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="space-y-6">
                <PasswordField
                  label="Current Password"
                  name="oldPassword"
                  placeholder="Enter your current password"
                  showPassword={showPasswords.oldPassword}
                  togglePasswordVisibility={() =>
                    setShowPasswords({
                      ...showPasswords,
                      oldPassword: !showPasswords.oldPassword,
                    })
                  }
                  errors={errors}
                  touched={touched}
                />

                <PasswordField
                  label="New Password"
                  name="newPassword"
                  placeholder="Enter your new password"
                  showPassword={showPasswords.newPassword}
                  togglePasswordVisibility={() =>
                    setShowPasswords({
                      ...showPasswords,
                      newPassword: !showPasswords.newPassword,
                    })
                  }
                  errors={errors}
                  touched={touched}
                />

                <PasswordField
                  label="Confirm New Password"
                  name="confirmNewPassword"
                  placeholder="Confirm your new password"
                  showPassword={showPasswords.confirmNewPassword}
                  togglePasswordVisibility={() =>
                    setShowPasswords({
                      ...showPasswords,
                      confirmNewPassword: !showPasswords.confirmNewPassword,
                    })
                  }
                  errors={errors}
                  touched={touched}
                />

                <AnimatePresence>
                  {submitStatus.message && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`text-sm text-center p-3 rounded-lg ${
                        submitStatus.type === "success"
                          ? "dark:bg-green-900/50 dark:text-green-300 bg-green-100 text-green-700 dark:border-green-700 border border-green-400"
                          : "dark:bg-red-900/50 dark:text-red-300 bg-red-100 text-red-500 dark:border-red-700 border border-red-400"
                      }`}
                    >
                      {submitStatus.message}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex justify-end space-x-3 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg border dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 border-gray-300 text-gray-700 hover:bg-gray-50 transition duration-200"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-4 py-2 rounded-lg text-white bg-orange-400 hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${
                      isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      "Change Password"
                    )}
                  </motion.button>
                </div>
              </Form>
            )}
          </Formik>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ChangePassword;
