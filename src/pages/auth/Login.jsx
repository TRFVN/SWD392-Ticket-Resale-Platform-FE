// pages/auth/Login.jsx
import React, { useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

// Assets and components
import TicketLogo from "../../assets/TicketHub_Logo.png";
import { LoginForm } from "../../components/auth/login/LoginForm";
import { SocialButton } from "../../components/auth/login/SocialButton";
import { setGoogleLoginSuccess } from "../../store/slice/authSlice";
import { useAuth } from "../../hooks/useAuth";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 500, damping: 30 },
  },
};

const logoVariants = {
  hidden: { scale: 0 },
  visible: {
    scale: 1,
    transition: { type: "spring", stiffness: 260, damping: 20 },
  },
};

// Validation schema for login form
const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  rememberMe: Yup.boolean(),
});

// Terms section as a separate component for better organization
const TermsText = memo(() => (
  <motion.p
    variants={itemVariants}
    className="mt-6 text-center text-sm text-gray-600/90 dark:text-gray-400/90 backdrop-blur-sm"
  >
    By signing in, you agree to our{" "}
    <Link
      to="/terms"
      className="font-medium text-orange-500 hover:text-orange-400 focus:outline-none focus:underline"
    >
      Terms of Service
    </Link>{" "}
    and{" "}
    <Link
      to="/privacy"
      className="font-medium text-orange-500 hover:text-orange-400 focus:outline-none focus:underline"
    >
      Privacy Policy
    </Link>
  </motion.p>
));

// Main Login Component
const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { login, loading, googleLogin } = useAuth();

  // Selectors
  const googleLoginSuccess = useSelector(
    (state) => state.auth.googleLoginSuccess,
  );
  const isAuthenticated = useSelector((state) => !!state.auth.user);

  // Navigate based on user role
  const navigateByRole = useCallback(() => {
    const userRole = localStorage.getItem("userRole");

    switch (userRole?.toUpperCase()) {
      case "ADMIN":
        navigate("/admin");
        break;
      case "STAFF":
        navigate("/staff/tickets");
        break;
      case "MEMBER":
      default:
        navigate("/");
        break;
    }
  }, [navigate]);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Handle Google login success
  useEffect(() => {
    if (googleLoginSuccess) {
      dispatch(setGoogleLoginSuccess(false));
      navigateByRole();
    }
  }, [googleLoginSuccess, dispatch, navigateByRole]);

  // Google login handler
  const handleGoogleLogin = useCallback(async () => {
    try {
      await googleLogin();
    } catch (error) {
      if (error?.error !== "popup_closed_by_user") {
        toast.error(error.message || "Failed to login with Google");
      }
    }
  }, [googleLogin]);

  // Form submission handler
  const handleSubmit = useCallback(
    async (values, { setSubmitting, setFieldError }) => {
      try {
        const response = await login(values.email, values.password);

        if (response?.isSuccess) {
          // Handle remember me
          if (values.rememberMe) {
            localStorage.setItem("rememberMe", "true");
            localStorage.setItem("email", values.email);
          } else {
            localStorage.removeItem("rememberMe");
            localStorage.removeItem("email");
          }

          navigateByRole();
          toast.success("Welcome back!");
        }
      } catch (error) {
        setFieldError("submit", error.message);
        toast.error(error.message || "Login failed. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
    [login, navigateByRole],
  );

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center 
      bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-200 via-slate-100 to-indigo-200 
      dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 
      py-12 px-4 sm:px-6 lg:px-8"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        {/* Logo and Header Section */}
        <div className="text-center mb-8">
          <motion.div
            variants={logoVariants}
            className="flex justify-center mb-6"
          >
            <img
              src={TicketLogo}
              alt="TicketHub"
              className="h-16 w-auto drop-shadow-lg"
              loading="eager"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
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
          variants={itemVariants}
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
                  hover:scale-[1.02] transform
                  disabled:opacity-70 disabled:cursor-not-allowed
                  focus:outline-none focus:ring-2 focus:ring-orange-500/40"
                aria-label="Sign in with Google"
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
            <motion.div
              variants={itemVariants}
              className="mt-6 flex items-center justify-between text-sm"
            >
              <Link
                to="/forgot-password"
                className="font-medium text-orange-500 hover:text-orange-400 
                  transition-colors backdrop-blur-sm
                  focus:outline-none focus:underline"
              >
                Forgot password?
              </Link>
              <Link
                to="/signup"
                className="font-medium text-orange-500 hover:text-orange-400 
                  transition-colors backdrop-blur-sm
                  focus:outline-none focus:underline"
              >
                Create account
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Terms Text */}
        <TermsText />
      </motion.div>

      {/* Loading Overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 border-t-2 border-b-2 border-orange-500 rounded-full animate-spin"></div>
                <p className="text-gray-700 dark:text-gray-300">
                  Signing in...
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;
