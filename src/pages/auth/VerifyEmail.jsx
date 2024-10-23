import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaEnvelope,
  FaArrowLeft,
  FaEnvelopeOpen,
} from "react-icons/fa";
import axiosInstance from "../../config/axiosConfig";
import { toast } from "react-toastify";
import TicketLogo from "../../assets/TicketHub_Logo.png";

// Animations variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      when: "beforeChildren",
      staggerChildren: 0.2,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

const VerifyEmail = () => {
  const [loading, setLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const navigate = useNavigate();

  // Email verification effect
  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get("userId");
        let token = urlParams.get("token");

        if (!userId || !token) {
          toast.error("Invalid verification link", {
            icon: "🔒",
            theme: "colored",
          });
          setVerificationStatus("error");
          setLoading(false);
          return;
        }

        // Token processing
        if (token.includes("verifyemail?token=")) {
          token = decodeURIComponent(token)
            .replace(/^.*?verifyemail\?token=/, "")
            .replace(/&userId=.*$/, "");
        }

        const response = await axiosInstance.post(
          `/Auth/verify-email?userId=${encodeURIComponent(
            userId,
          )}&token=${encodeURIComponent(token)}`,
        );

        if (response.data?.isSuccess) {
          setVerificationStatus("success");
          toast.success("Email verified successfully! 🎉", {
            icon: "✨",
            theme: "colored",
          });
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        } else {
          setVerificationStatus("error");
          toast.error("Verification failed", {
            icon: "❌",
            theme: "colored",
          });
        }
      } catch (error) {
        console.error("Verification error:", error);
        setVerificationStatus("error");
        toast.error(error.response?.data?.message || "Verification failed", {
          icon: "⚠️",
          theme: "colored",
        });
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [navigate]);

  // Resend verification handler
  const handleResendVerification = async () => {
    try {
      setLoading(true);
      const urlParams = new URLSearchParams(window.location.search);
      const userId = urlParams.get("userId");

      if (!userId) {
        toast.error("User ID not found", {
          icon: "🔍",
          theme: "colored",
        });
        return;
      }

      const response = await axiosInstance.post("/Auth/resend-verification", {
        userId,
      });

      if (response.data?.isSuccess) {
        toast.success("Verification email has been resent! 📧", {
          icon: "📨",
          theme: "colored",
        });
      } else {
        throw new Error("Failed to resend verification email");
      }
    } catch (error) {
      toast.error("Failed to resend verification email", {
        icon: "📪",
        theme: "colored",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5"></div>
      <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-100/20 to-purple-100/20 rounded-full blur-3xl animate-slow-spin"></div>
      <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-indigo-100/20 to-pink-100/20 rounded-full blur-3xl animate-slow-spin-reverse"></div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/10 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s linear infinite`,
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key="container"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="w-full max-w-xl mx-4 relative z-10"
        >
          <motion.div
            className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden border border-white/20"
            whileHover={{ boxShadow: "0 30px 60px -12px rgba(0, 0, 0, 0.25)" }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative p-8 sm:p-12">
              {/* Decorative Elements */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-br-full blur-2xl"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-indigo-500/10 to-pink-500/10 rounded-tl-full blur-2xl"></div>

              {/* Content Container */}
              <div className="relative">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-8">
                  <Link
                    to="/login"
                    className="group flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <motion.div
                      whileHover={{ x: -4 }}
                      className="p-2 rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors"
                    >
                      <FaArrowLeft size={16} />
                    </motion.div>
                    <span className="font-medium">Back to Login</span>
                  </Link>

                  <motion.div
                    whileHover={{ rotate: 10 }}
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg"
                  >
                    <FaEnvelope className="text-white text-xl" />
                  </motion.div>
                </div>

                {/* Logo and Title Section */}
                <motion.div
                  variants={itemVariants}
                  className="text-center mb-12"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="inline-block p-3 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 mb-6"
                  >
                    <motion.img
                      src={TicketLogo}
                      alt="TicketHub Logo"
                      className="h-20 w-auto"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                      }}
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-2"
                  >
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                      Email Verification
                    </h1>
                    <p className="text-gray-500">
                      Securing your account access
                    </p>
                  </motion.div>
                </motion.div>

                {/* Status Content */}
                <motion.div variants={itemVariants} className="relative">
                  <AnimatePresence mode="wait">
                    {loading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50"
                      >
                        <div className="relative w-24 h-24 mx-auto mb-6">
                          {/* Multiple layered spinning animations */}
                          <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-ping opacity-20"></div>
                          <div className="absolute inset-0 border-4 border-blue-300 rounded-full animate-spin"></div>
                          <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
                          <FaEnvelopeOpen className="absolute inset-0 m-auto text-blue-500 text-3xl animate-bounce" />
                        </div>
                        <p className="text-blue-600 font-medium animate-pulse">
                          Verifying your email address...
                        </p>
                      </motion.div>
                    ) : verificationStatus === "success" ? (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="text-center p-8 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                          }}
                          className="mb-6"
                        >
                          <div className="relative inline-block">
                            <div className="absolute inset-0 bg-green-200 rounded-full animate-ping opacity-25"></div>
                            <FaCheckCircle className="text-green-500 text-6xl relative z-10" />
                          </div>
                        </motion.div>
                        <h2 className="text-2xl font-bold text-green-800 mb-3">
                          Email Verified Successfully!
                        </h2>
                        <p className="text-green-600 mb-8">
                          Your email has been verified. Redirecting you to
                          login...
                        </p>
                        <motion.div
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Link
                            to="/login"
                            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl
                                   font-semibold shadow-lg transition-all duration-300 hover:shadow-2xl hover:from-green-600 hover:to-emerald-700"
                          >
                            Continue to Login
                          </Link>
                        </motion.div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="error"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="text-center p-8 rounded-2xl bg-gradient-to-br from-red-50 to-orange-50"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                          }}
                          className="mb-6"
                        >
                          <div className="relative inline-block">
                            <div className="absolute inset-0 bg-red-200 rounded-full animate-ping opacity-25"></div>
                            <FaExclamationCircle className="text-red-500 text-6xl relative z-10" />
                          </div>
                        </motion.div>
                        <h2 className="text-2xl font-bold text-red-800 mb-3">
                          Verification Failed
                        </h2>
                        <p className="text-red-600 mb-8">
                          We couldn't verify your email. The link may be invalid
                          or expired.
                        </p>
                        <motion.div
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <button
                            onClick={handleResendVerification}
                            disabled={loading}
                            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl
                                   font-semibold shadow-lg transition-all duration-300 hover:shadow-2xl hover:from-red-600 hover:to-orange-600
                                   disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {loading ? (
                              <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                                <span>Sending...</span>
                              </>
                            ) : (
                              <>
                                <FaEnvelope className="mr-2" />
                                <span>Resend Verification Email</span>
                              </>
                            )}
                          </button>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Footer Note */}
                <motion.p
                  variants={itemVariants}
                  className="text-center text-gray-500 text-sm mt-8"
                >
                  Having troubles?{" "}
                  <Link
                    to="/contact"
                    className="text-blue-500 hover:text-blue-600"
                  >
                    Contact Support
                  </Link>
                </motion.p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default VerifyEmail;
