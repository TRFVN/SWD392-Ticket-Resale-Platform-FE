// pages/auth/Login.jsx
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import * as Yup from "yup";
import { toast } from "react-toastify";
import TicketLogo from "../../assets/TicketHub_Logo.png";
import { LoginForm } from "../../components/auth/login/LoginForm";
import { SocialButton } from "../../components/auth/login/SocialButton";
import { useDispatch, useSelector } from "react-redux";
import { setGoogleLoginSuccess } from "../../store/slice/authSlice";
import { useAuth } from "../../hooks/useAuth"; // Thay đổi cách import auth

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"), // Thêm validate password
  rememberMe: Yup.boolean(),
});

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const navigateByRole = () => {
    const userRole = localStorage.getItem("userRole");
    console.log("Role from localStorage:", userRole);

    switch (userRole?.toUpperCase()) {
      case "ADMIN":
        navigate("/admin");
        break;
      case "STAFF":
        navigate("/staff/tickets");
        break;
      case "MEMBER":
        navigate("/");
        break;
      default:
        navigate("/");
        break;
    }
  };

  const { login, loading, googleLogin } = useAuth();
  const googleLoginSuccess = useSelector(
    (state) => state.auth.googleLoginSuccess,
  );
  const isAuthenticated = useSelector((state) => !!state.auth.user);

  // Redirect nếu đã login
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (googleLoginSuccess) {
      dispatch(setGoogleLoginSuccess(false));
      navigateByRole();
    }
  }, [googleLoginSuccess, dispatch]);

  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
    } catch (error) {
      if (error?.error !== "popup_closed_by_user") {
        toast.error(error.message || "Failed to login with Google");
      }
    }
  };

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const response = await login(values.email, values.password);
      if (response?.isSuccess) {
        // Handle remember me
        if (values.rememberMe) {
          localStorage.setItem("rememberMe", "true");
          localStorage.setItem("email", values.email); // Lưu email nếu remember me
        } else {
          localStorage.removeItem("rememberMe");
          localStorage.removeItem("email");
        }
        navigateByRole();
        toast.success("Welcome back!");
      }
    } catch (error) {
      setFieldError("submit", error.message);
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center 
      bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-200 via-slate-100 to-indigo-200 
      dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 
      py-12 px-4 sm:px-6 lg:px-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo and Header Section */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="flex justify-center mb-6"
          >
            <img src={TicketLogo} alt="TicketHub" className="h-16 w-auto" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              Welcome Back!
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Sign in to your account to continue
            </p>
          </motion.div>
        </div>

        {/* Main Card with Glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/30 dark:bg-gray-800/30
            backdrop-blur-xl backdrop-saturate-150
            border border-white/30 dark:border-gray-700/30
            shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]
            rounded-2xl overflow-hidden"
        >
          {/* Inner Content with Additional Glass Effect */}
          <div className="p-8 backdrop-blur-sm">
            {/* Social Login */}
            <div className="mb-6">
              <SocialButton
                icon={FaGoogle}
                label="Continue with Google"
                onClick={handleGoogleLogin}
                iconColor="text-blue-500"
                disabled={loading}
                className="w-full py-2.5 bg-white/50 dark:bg-gray-800/50 
                  backdrop-blur-md transition-all duration-300
                  hover:bg-white/70 dark:hover:bg-gray-700/70
                  hover:scale-[1.02] transform"
              />
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300/50 dark:border-gray-600/50" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span
                  className="px-2 bg-white/30 dark:bg-gray-800/30 
                  backdrop-blur-md text-gray-600 dark:text-gray-400"
                >
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Login Form */}
            <div className="space-y-4 backdrop-blur-sm">
              <LoginForm
                onSubmit={handleSubmit}
                loading={loading}
                validationSchema={validationSchema}
                initialValues={{
                  email: localStorage.getItem("email") || "",
                  password: "",
                  rememberMe: !!localStorage.getItem("rememberMe"),
                }}
              />
            </div>

            {/* Footer Links */}
            <div className="mt-6 flex items-center justify-between text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-orange-500 hover:text-orange-400 
                  transition-colors backdrop-blur-sm"
              >
                Forgot password?
              </Link>
              <Link
                to="/signup"
                className="font-medium text-orange-500 hover:text-orange-400 
                  transition-colors backdrop-blur-sm"
              >
                Create account
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Terms Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center text-sm text-gray-600/90 dark:text-gray-400/90 
            backdrop-blur-sm"
        >
          By signing in, you agree to our{" "}
          <Link
            to="/terms"
            className="font-medium text-orange-500 hover:text-orange-400"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            to="/privacy"
            className="font-medium text-orange-500 hover:text-orange-400"
          >
            Privacy Policy
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Login;
