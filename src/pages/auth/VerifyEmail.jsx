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
        let token = urlParams.get("token");

        if (!userId || !token) {
          toast.error("Invalid verification link");
          setVerificationStatus("error");
          setLoading(false);
          return;
        }

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
          toast.success("Email verified successfully!");
          setTimeout(() => navigate("/login"), 3000);
        } else {
          setVerificationStatus("error");
          toast.error("Verification failed");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setVerificationStatus("error");
        toast.error(error.response?.data?.message || "Verification failed");
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

      const response = await axiosInstance.post("/Auth/resend-verification", {
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
              Email Verification
            </h2>
            <p className="text-sm text-gray-600">
              We're verifying your email address to secure your account
            </p>
          </div>

          {/* Verification Status */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center space-y-4"
              >
                <div className="w-16 h-16 mx-auto relative">
                  <div className="absolute inset-0 border-4 border-orange-200 rounded-full animate-ping"></div>
                  <div className="absolute inset-0 border-4 border-orange-400 rounded-full animate-spin border-t-transparent"></div>
                  <Mail className="absolute inset-0 m-auto text-orange-400 w-8 h-8" />
                </div>
                <p className="text-gray-600">Verifying your email address...</p>
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
                  className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center"
                >
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </motion.div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Email Verified Successfully!
                  </h3>
                  <p className="text-sm text-gray-600">
                    Your email has been verified. Redirecting to login...
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/login")}
                  className="w-full py-2 px-4 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition-colors duration-200"
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
                  className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center"
                >
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </motion.div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Verification Failed
                  </h3>
                  <p className="text-sm text-gray-600">
                    The verification link may be expired or invalid
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleResendVerification}
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    "Resend Verification Email"
                  )}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Back to Login Link */}
          <div className="text-center mt-6">
            <Link
              to="/login"
              className="inline-flex items-center text-sm text-orange-400 hover:text-orange-500 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
