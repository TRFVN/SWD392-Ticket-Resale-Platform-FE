import React, { useState, useCallback, memo, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaGoogle } from "react-icons/fa";
import {
  HiOutlineShieldCheck,
  HiOutlineArrowRight,
  HiMoon,
  HiSun,
} from "react-icons/hi";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import TicketLogo from "../../assets/TicketHub_Logo.png";
import { LoginForm } from "../../components/auth/login/LoginForm";
import { useAuth } from "../../hooks/useAuth";
import { toggleTheme } from "../../store/slice/themeSlice";
import GeminiChatPopup from "./GeminiChatPopUp";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5 },
  },
};

const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 400, damping: 30, delay: 0.2 },
  },
};

// ThemeToggle component
const ThemeToggle = memo(() => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      onClick={handleToggleTheme}
      className={`fixed top-4 right-4 p-2 rounded-full z-50
        ${
          isDarkMode
            ? "bg-gray-800 text-orange-400"
            : "bg-white text-orange-500"
        } 
        shadow-md hover:shadow-lg transition-all duration-300`}
      aria-label={
        isDarkMode ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"
      }
    >
      {isDarkMode ? (
        <HiSun className="w-6 h-6" />
      ) : (
        <HiMoon className="w-6 h-6" />
      )}
    </motion.button>
  );
});

ThemeToggle.displayName = "ThemeToggle";

// Custom Google Button Component
const GoogleButton = memo(({ onClick, isLoading, isDarkMode }) => (
  <motion.button
    whileHover={{
      scale: 1.01,
      backgroundColor: isDarkMode
        ? "rgba(255, 255, 255, 0.08)"
        : "rgba(0, 0, 0, 0.03)",
    }}
    whileTap={{ scale: 0.98 }}
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: 0.4 }}
    onClick={onClick}
    disabled={isLoading}
    className={`w-full flex items-center justify-center gap-3 px-5 py-3.5
      ${
        isDarkMode
          ? "bg-transparent border-gray-700/30 text-gray-300 hover:text-white hover:border-gray-500/40"
          : "bg-white border-gray-200 text-gray-700 hover:text-gray-900 hover:border-gray-300"
      }
      border rounded-xl backdrop-blur-sm transition-all duration-300
      disabled:opacity-70 disabled:cursor-not-allowed
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400/50
      shadow-sm`}
    aria-label="Đăng nhập với Google"
  >
    {isLoading ? (
      <>
        <div
          className={`w-5 h-5 border-2 ${
            isDarkMode ? "border-gray-300" : "border-gray-500"
          } border-t-transparent rounded-full animate-spin`}
        ></div>
        <span>Đang kết nối...</span>
      </>
    ) : (
      <>
        <FaGoogle className="w-5 h-5 text-[#4285F4]" />
        <span className="font-medium">Tiếp tục với Google</span>
      </>
    )}
  </motion.button>
));

GoogleButton.displayName = "GoogleButton";

// Quote component
const QuoteSection = memo(({ isDarkMode }) => (
  <motion.div
    className="hidden lg:flex flex-col items-center justify-center h-full w-full relative p-12 text-center"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1 }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/80 to-orange-600/90 rounded-3xl"></div>

    {/* Abstract pattern overlay */}
    <div className="absolute inset-0 opacity-10 mix-blend-soft-light">
      <svg width="100%" height="100%" viewBox="0 0 800 800">
        <defs>
          <pattern
            id="pattern1"
            x="0"
            y="0"
            width="100"
            height="100"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="10" cy="10" r="8" fill="white" />
          </pattern>
          <pattern
            id="pattern2"
            x="0"
            y="0"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0 0L30 30L0 60"
              stroke="white"
              strokeWidth="2"
              fill="none"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#pattern1)" />
        <rect width="100%" height="100%" fill="url(#pattern2)" />
      </svg>
    </div>

    <div className="relative z-10 flex flex-col items-center max-w-md">
      <img
        src={TicketLogo}
        alt="TicketHub Logo"
        className="w-24 mb-8 drop-shadow-lg"
      />

      <h2 className="text-4xl font-bold text-white mb-4">
        Trải Nghiệm Sự Kiện Theo Cách Mới
      </h2>

      <p className="text-white/90 text-lg mb-8">
        Cổng thông tin dành cho những trải nghiệm khó quên. An toàn, liền mạch
        và thân thiện.
      </p>

      <div className="flex space-x-2 mb-12">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-full bg-white/30 first:bg-white"
          ></div>
        ))}
      </div>

      <div className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl border border-white/20 max-w-sm">
        <p className="text-white italic text-lg mb-4">
          &ldquo;TicketHub đã thay đổi cách tôi tham gia sự kiện. Giao diện trực
          quan và trải nghiệm rất mượt mà.&rdquo;
        </p>
        <p className="text-white/80 font-medium">
          Nguyễn Thị Minh, Người yêu thích sự kiện
        </p>
      </div>
    </div>
  </motion.div>
));

QuoteSection.displayName = "QuoteSection";

// Main Login Component
const Login = () => {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const isGoogleLoginLoading = useSelector((state) => state.auth.loading);
  const isGoogleLoginSuccess = useSelector(
    (state) => state.auth.googleLoginSuccess,
  );
  const userRole = useSelector((state) => state.auth.role);
  const message = location.state?.message || "";
  const from = location.state?.from?.pathname || "/";

  const navigateBasedOnRole = useCallback(() => {
    if (userRole === "MANAGER") {
      navigate("/manager");
    } else {
      navigate(from);
    }
  }, [userRole, navigate, from]);

  // Check for successful Google login and redirect
  useEffect(() => {
    if (isGoogleLoginSuccess) {
      toast.success("Đăng nhập thành công!");
      navigateBasedOnRole();
    }
  }, [isGoogleLoginSuccess, navigateBasedOnRole]);

  // Display message from redirect (e.g., after registration)
  useEffect(() => {
    if (message) {
      toast.info(message);
    }
  }, [message]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (values) => {
      setError("");
      setIsSubmitting(true);

      try {
        const response = await login(values.email, values.password);
        toast.success("Đăng nhập thành công!");

        // Get the role from local storage after login
        const decodedTokenStr = localStorage.getItem("decodedToken");
        if (decodedTokenStr) {
          const decodedToken = JSON.parse(decodedTokenStr);
          const roleKey = Object.keys(decodedToken).find((key) =>
            key.toLowerCase().includes("role"),
          );
          const userRole = roleKey ? decodedToken[roleKey] : null;

          // Navigate based on role
          if (userRole === "MANAGER") {
            navigate("/manager");
          } else {
            navigate(from);
          }
        } else {
          navigate(from);
        }
      } catch (error) {
        setError(error.message || "Đăng nhập thất bại. Vui lòng thử lại.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [login, navigate, from],
  );

  // Handle Google login button click
  const handleGoogleLogin = useCallback(
    (e) => {
      e.preventDefault();
      googleLogin();
    },
    [googleLogin],
  );

  return (
    <div
      className={`min-h-screen flex flex-col lg:flex-row transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Theme Toggle Button */}
      <ThemeToggle />
      <GeminiChatPopup isDarkMode={isDarkMode} />

      {/* Left Section - Image/Quote */}
      <div className="hidden lg:flex lg:w-1/2 p-8">
        <QuoteSection isDarkMode={isDarkMode} />
      </div>

      {/* Right Section - Login Form */}
      <div
        className={`w-full lg:w-1/2 flex items-center justify-center p-6 ${
          isDarkMode
            ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black"
            : "bg-gradient-to-br from-white via-gray-50 to-gray-100"
        }`}
      >
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-10">
            <img src={TicketLogo} alt="TicketHub Logo" className="h-12" />
          </div>

          <motion.div variants={slideUp} className="mb-8">
            <h1
              className={`text-3xl font-bold mb-2 ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Chào mừng trở lại
            </h1>
            <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Đăng nhập để tiếp tục sử dụng TicketHub
            </p>
          </motion.div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                transition={{ duration: 0.3 }}
                className={`mb-6 rounded-lg p-4 text-sm border-l-4 border-red-500 flex items-start ${
                  isDarkMode
                    ? "bg-red-500/10 text-red-400"
                    : "bg-red-50 text-red-600"
                }`}
              >
                <HiOutlineShieldCheck className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login Form */}
          <motion.div variants={slideUp}>
            <LoginForm
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              isDarkMode={isDarkMode}
            />
          </motion.div>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div
              className={`flex-grow border-t ${
                isDarkMode ? "border-gray-800" : "border-gray-300"
              }`}
            ></div>
            <span
              className={`mx-4 text-xs font-medium uppercase tracking-wider ${
                isDarkMode ? "text-gray-500" : "text-gray-500"
              }`}
            >
              hoặc
            </span>
            <div
              className={`flex-grow border-t ${
                isDarkMode ? "border-gray-800" : "border-gray-300"
              }`}
            ></div>
          </div>

          {/* Google Sign In */}
          <div>
            <GoogleButton
              onClick={handleGoogleLogin}
              isLoading={isGoogleLoginLoading}
              isDarkMode={isDarkMode}
            />
          </div>

          {/* Sign Up Link */}
          <motion.div
            className="text-center mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
              Chưa có tài khoản?{" "}
              <Link
                to="/signup"
                className={`font-medium transition-colors ${
                  isDarkMode
                    ? "text-orange-400 hover:text-orange-300"
                    : "text-orange-500 hover:text-orange-600"
                }`}
              >
                Đăng ký{" "}
                <HiOutlineArrowRight className="inline-block ml-0.5 w-3.5 h-3.5" />
              </Link>
            </p>

            <p
              className={`text-xs mt-4 ${
                isDarkMode ? "text-gray-600" : "text-gray-500"
              }`}
            >
              Bằng việc đăng nhập, bạn đồng ý với{" "}
              <Link
                to="/terms"
                className={`underline ${
                  isDarkMode ? "hover:text-gray-500" : "hover:text-gray-700"
                }`}
              >
                Điều khoản sử dụng
              </Link>{" "}
              &{" "}
              <Link
                to="/privacy"
                className={`underline ${
                  isDarkMode ? "hover:text-gray-500" : "hover:text-gray-700"
                }`}
              >
                Chính sách bảo mật
              </Link>{" "}
              của chúng tôi.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
