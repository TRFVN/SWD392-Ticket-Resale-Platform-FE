import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useGoogleLogin } from "@react-oauth/google";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaFacebook,
  FaGoogle,
} from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth"; // Assuming useAuth is defined in a hooks directory
import { FaX } from "react-icons/fa6";
import { PiFacebookLogoThin } from "react-icons/pi";

const loginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { login, loginWithGoogle, loginAsInstructorWithGoogle } = useAuth(); // Using the login functions from useAuth

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await login(values.email, values.password);
      navigate("/dashboard"); // Assuming there's a dashboard route
    } catch (error) {
      toast.error("Login failed. Please try again.");
      setSubmitting(false);
    }
  };

  const handleGoogleLoginSuccess = async (codeResponse, role) => {
    try {
      await loginWithGoogle(codeResponse, role);
      navigate("/dashboard"); // Assuming there's a dashboard route
    } catch (error) {
      toast.error("Google login failed. Please try again.");
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: (codeResponse) =>
      handleGoogleLoginSuccess(codeResponse, "STUDENT"),
    onError: () => {
      toast.error("Google login failed. Please try again.");
    },
  });

  const instructorGoogleLogin = useGoogleLogin({
    onSuccess: (codeResponse) =>
      handleGoogleLoginSuccess(codeResponse, "INSTRUCTOR"),
    onError: () => {
      toast.error("Google login failed. Please try again.");
    },
  });

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="m-auto w-full max-w-md p-8 bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700"
      >
        <h1 className="text-3xl font-bold mb-6 text-white text-center">
          Login
        </h1>
        <AnimatePresence mode="wait">
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={loginSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="space-y-4">
                <div className="relative">
                  <FaEnvelope
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Field
                    name="email"
                    type="email"
                    placeholder="Email"
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
                {touched.email && errors.email && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.email}
                  </div>
                )}

                <div className="relative">
                  <FaLock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Field
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="w-full pl-10 pr-10 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {showPassword ? (
                      <FaEyeSlash size={18} />
                    ) : (
                      <FaEye size={18} />
                    )}
                  </button>
                </div>
                {touched.password && errors.password && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.password}
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className={`w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all duration-300 ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </motion.button>
              </Form>
            )}
          </Formik>
        </AnimatePresence>

        <div className="mt-6 space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-800 text-gray-400">
                Or continue with
              </span>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => googleLogin()}
              className="flex items-center justify-center px-4 py-2 border border-gray-600 rounded-lg shadow-sm text-sm font-medium text-white bg-gray-700 hover:bg-gray-600"
            >
              <FaGoogle className="w-5 h-5 mr-2" />
              Google
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => PiFacebookLogoThin()}
              className="flex items-center justify-center px-4 py-2 border border-gray-600 rounded-lg shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-400"
            >
              <FaFacebook className="w-5 h-5 mr-2" />
              Facebook
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => xLogin()}
              className="flex items-center justify-center px-4 py-2 border border-gray-600 rounded-lg shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-400"
            >
              <FaX className="w-5 h-5 mr-2" />X
            </motion.button>
          </div>
        </div>

        <p className="text-center text-sm text-gray-400 mt-6">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
          >
            Sign up
          </button>
        </p>
      </motion.div>
      <ToastContainer theme="dark" />
    </div>
  );
}
