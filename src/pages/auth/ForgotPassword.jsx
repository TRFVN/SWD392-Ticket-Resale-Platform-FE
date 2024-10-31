import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { FaEnvelope, FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import TicketLogo from "../../assets/TicketHub_Logo.png";

const ForgotPassword = () => {
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" });

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await axios.post(
        "https://tickethub-f6gxgnhngpbue9gs.southeastasia-01.azurewebsites.net/api/Auth/forgot-password",
        { email: values.email },
      );

      setSubmitStatus({
        type: "success",
        message: "Password reset instructions have been sent to your email",
      });
      resetForm();
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message:
          error.response?.data?.message ||
          "Failed to send reset instructions. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full space-y-8"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 p-8"
        >
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <motion.img
              src={TicketLogo}
              alt="Logo"
              className="h-20 w-auto mx-auto mb-4"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            />
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Reset Password
            </h2>
            <p className="text-sm text-gray-600">
              Enter your email address and we&apos;ll send you instructions to
              reset your password
            </p>
          </div>

          {/* Form */}
          <Formik
            initialValues={{ email: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="mt-8 space-y-6">
                <div className="mb-6">
                  <label
                    htmlFor="email"
                    className="block text-gray-700 text-sm font-medium mb-2 flex items-center"
                  >
                    <FaEnvelope className="text-gray-600" />
                    <span className="ml-2">Email addresss</span>
                  </label>
                  <div className="relative">
                    <Field
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      className={`w-full px-4 py-2 rounded-lg bg-white text-gray-800 placeholder-gray-500
                               focus:outline-none focus:ring-2 focus:ring-orange-400
                               transition-all duration-300
                               border ${
                                 errors.email && touched.email
                                   ? "border-red-500"
                                   : "border-gray-300 hover:border-gray-400"
                               }`}
                    />
                    {errors.email && touched.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-1 text-red-500 text-sm"
                      >
                        {errors.email}
                      </motion.p>
                    )}
                  </div>
                </div>

                {/* Status Message */}
                <AnimatePresence>
                  {submitStatus.message && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`text-sm text-center p-3 rounded-lg ${
                        submitStatus.type === "success"
                          ? "bg-green-100 text-green-700 border border-green-400"
                          : "bg-red-100 text-red-500 border border-red-400"
                      }`}
                    >
                      {submitStatus.message}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-orange-400 hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    "Send Reset Instructions"
                  )}
                </motion.button>

                {/* Back to Login Link */}
                <div className="text-center mt-4">
                  <Link
                    to="/login"
                    className="inline-flex items-center text-sm text-orange-400 hover:text-orange-500 transition-colors duration-200"
                  >
                    <FaArrowLeft className="mr-2" />
                    Back to Login right now
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
