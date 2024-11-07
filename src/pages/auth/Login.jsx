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

  // Xử lý Google login success
  useEffect(() => {
    if (googleLoginSuccess) {
      toast.success("Successfully logged in with Google!", {
        onClose: () => {
          dispatch(setGoogleLoginSuccess(false));
          navigate("/");
        },
      });
    }
  }, [googleLoginSuccess, navigate, dispatch]);

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:py-12">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[400px] space-y-6 sm:space-y-8"
      >
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden 
            border border-gray-200 dark:border-gray-700 p-6 sm:p-8
            backdrop-filter backdrop-blur-lg bg-opacity-95"
        >
          <motion.div
            variants={itemVariants}
            className="text-center mb-6 sm:mb-8"
          >
            <motion.img
              src={TicketLogo}
              alt="Logo"
              className="h-16 sm:h-20 w-auto mx-auto mb-3 sm:mb-4"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            />
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent mb-1 sm:mb-2">
              Welcome Back
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Sign in to continue to TicketHub
            </p>
          </motion.div>

          <LoginForm
            onSubmit={handleSubmit}
            loading={loading}
            validationSchema={validationSchema}
            initialValues={{
              email: localStorage.getItem("email") || "", // Auto-fill email if remembered
              password: "",
              rememberMe: !!localStorage.getItem("rememberMe"),
            }}
          />

          <motion.div variants={itemVariants} className="mt-6">
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

            <div className="mt-6">
              <SocialButton
                icon={FaGoogle}
                label="Continue with Google"
                onClick={handleGoogleLogin}
                iconColor="text-blue-500"
                disabled={loading}
                className="hover:scale-105 transform transition-all duration-200"
              />
            </div>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="mt-6 text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400"
          >
            Not a member?{" "}
            <Link
              to="/signup"
              className="font-medium text-orange-400 hover:text-orange-500 
                transition-colors duration-200"
            >
              Start your journey
            </Link>
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
