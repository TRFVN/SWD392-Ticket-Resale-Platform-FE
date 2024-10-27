// src/pages/Login.jsx
import React from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import * as Yup from "yup";
import { useContext } from "react";

import TicketLogo from "../../assets/TicketHub_Logo.png";
import axios from "axios";
import { LoginForm } from "../../components/auth/login/LoginForm";
import { SocialButton } from "../../components/auth/login/SocialButton";
import { AuthContext } from "../../context/AuthContext";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
  rememberMe: Yup.boolean(),
});

const Login = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useContext(AuthContext);

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const response = await login(values.email, values.password);

      if (response && response.isSuccess) {
        if (values.rememberMe) {
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.removeItem("rememberMe");
        }

        const role = response.result.role?.toLowerCase();
        switch (role) {
          case "admin":
            navigate("/admin/dashboard");
            break;
          case "user":
            navigate("/dashboard");
            break;
          default:
            navigate("/dashboard");
        }
      }
    } catch (err) {
      setFieldError("submit", err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          },
        );
        // Handle Google login success
        console.log("User Info:", response.data);
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    },
    onError: () => console.log("Login Failed"),
    scope: "profile email",
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[400px] space-y-6 sm:space-y-8"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden 
            border border-gray-200 dark:border-gray-700 p-6 sm:p-8"
        >
          {/* Logo Section */}
          <div className="text-center mb-6 sm:mb-8">
            <motion.img
              src={TicketLogo}
              alt="Logo"
              className="h-16 sm:h-20 w-auto mx-auto mb-3 sm:mb-4"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            />
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-1 sm:mb-2">
              Sign in to your account
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Or start your 14-day free trial
            </p>
          </div>

          <LoginForm
            onSubmit={handleSubmit}
            loading={loading}
            validationSchema={validationSchema}
          />

          {/* Social Login Section */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-xs sm:text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <SocialButton
                icon={FaGoogle}
                label="Google"
                onClick={() => googleLogin()}
                iconColor="text-orange-400"
              />
              <SocialButton
                icon={FaFacebook}
                label="Facebook"
                onClick={() => {}}
                iconColor="text-blue-600"
              />
            </div>
          </div>

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Not a member?{" "}
            <Link
              to="/signup"
              className="font-medium text-orange-400 hover:text-orange-500"
            >
              Start a 14 day free trial
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
