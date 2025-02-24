import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Mail, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "../../config/axiosConfig";
import TicketLogo from "../../assets/TicketHub_Logo.png";

const VerifyEmail = () => {
  const [loading, setLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get("userId");
        const token = urlParams.get("token"); // Lấy token từ URL thay vì localStorage

        if (!userId || !token) {
          toast.error("Invalid verification link");
          setVerificationStatus("error");
          setLoading(false);
          return;
        }

        const response = await axiosInstance.post(
          "/email/verification/verify",
          {
            userId: userId,
            token: token, // Sử dụng token từ URL
          },
          {
            headers: {
              accept: "*/*",
              "Content-Type": "application/json",
            },
          },
        );

        if (response.data?.isSuccess) {
          setVerificationStatus("success");
          toast.success("Email verified successfully!");
          setTimeout(() => (window.location.href = "/login"), 3000);
        } else {
          throw new Error(response.data?.message || "Verification failed");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setVerificationStatus("error");
        toast.error(error.message || "Verification failed");
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [navigate]);

  const handleResendVerification = async () => {
    try {
      setLoading(true);
      const urlParams = new URLSearchParams(window.location.search);
      const userId = urlParams.get("userId");

      if (!userId) {
        toast.error("User ID not found");
        return;
      }

      const response = await axiosInstance.post("email/verification/verify", {
        userId,
      });

      if (response.data?.isSuccess) {
        toast.success("Verification email has been resent!");
      } else {
        throw new Error("Failed to resend verification email");
      }
    } catch (error) {
      toast.error("Failed to resend verification email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center 
      bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] 
      from-orange-200 via-slate-100 to-indigo-200 
      dark:from-gray-900 dark:via-gray-900 dark:to-gray-800"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-6"
      >
        {/* Glass Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/30 dark:bg-gray-800/30
            backdrop-blur-xl backdrop-saturate-150
            border border-white/30 dark:border-gray-700/30
            shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]
            rounded-2xl overflow-hidden"
        >
          <div className="p-8">
            {/* Logo and Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="relative w-24 h-24 mx-auto mb-4"
              >
                <img
                  src={TicketLogo}
                  alt="Logo"
                  className="w-full h-full object-contain"
                />
              </motion.div>
              <h2
                className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 
                bg-clip-text text-transparent mb-2"
              >
                Email Verification
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Please wait while we verify your email address
              </p>
            </div>

            {/* Status Indicators */}
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center space-y-6"
                >
                  <div className="relative w-20 h-20 mx-auto">
                    {/* Animated rings */}
                    <div
                      className="absolute inset-0 rounded-full border-4 border-orange-200 
                      dark:border-orange-900 animate-ping"
                    />
                    <div
                      className="absolute inset-0 rounded-full border-4 border-orange-500 
                      border-t-transparent animate-spin"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Mail className="w-8 h-8 text-orange-500" />
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 animate-pulse">
                    Verifying your email...
                  </p>
                </motion.div>
              ) : verificationStatus === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center space-y-6"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 mx-auto bg-green-100/50 dark:bg-green-900/50 
                      backdrop-blur-sm rounded-full flex items-center justify-center"
                  >
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </motion.div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                      Verification Successful!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      You'll be redirected to login shortly...
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => (window.location.href = "/login")}
                    className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-orange-600 
                      text-white rounded-xl hover:from-orange-600 hover:to-orange-700 
                      transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Continue to Login
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center space-y-6"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 mx-auto bg-red-100/50 dark:bg-red-900/50 
                      backdrop-blur-sm rounded-full flex items-center justify-center"
                  >
                    <AlertCircle className="w-10 h-10 text-red-500" />
                  </motion.div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                      Verification Failed
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      The link may be expired or invalid
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleResendVerification}
                    disabled={loading}
                    className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-orange-600 
                      text-white rounded-xl hover:from-orange-600 hover:to-orange-700 
                      transition-all duration-300 shadow-lg hover:shadow-xl
                      disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div
                        className="w-6 h-6 border-2 border-white border-t-transparent 
                        rounded-full animate-spin mx-auto"
                      />
                    ) : (
                      "Resend Verification Email"
                    )}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Back Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 text-center"
            >
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 
                  hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Login</span>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
