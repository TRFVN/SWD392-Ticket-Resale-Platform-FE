import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

const VerifyEmail = () => {
  const [loading, setLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState(null);

  useEffect(() => {
    const verifyEmail = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const userId = urlParams.get("userId");
      const token = urlParams.get("token");

      if (!userId || !token) {
        setVerificationStatus("error");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/verify-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, token }),
        });

        if (response.ok) {
          setVerificationStatus("success");
        } else {
          setVerificationStatus("error");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setVerificationStatus("error");
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5"></div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg mx-4 relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="backdrop-blur-xl bg-black/30 rounded-3xl shadow-2xl overflow-hidden border border-white/10 p-8 lg:p-12"
        >
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="text-center mb-12"
          >
            <motion.img
              src="/logo.png"
              alt="Logo"
              className="h-16 w-auto mx-auto mb-6"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            />
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
              Email Verification
            </h1>
            <p className="text-gray-400">Verifying your email address</p>
          </motion.div>

          <div className="flex flex-col items-center justify-center space-y-4">
            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-white text-xl"
              >
                <div className="w-16 h-16 border-4 border-t-[#af1f24] border-white/20 rounded-full animate-spin"></div>
                <p className="mt-4">Verifying your email...</p>
              </motion.div>
            ) : verificationStatus === "success" ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <FaCheckCircle className="text-green-500 text-6xl mb-4 mx-auto" />
                <h2 className="text-2xl font-semibold text-white mb-2">
                  Email Verified!
                </h2>
                <p className="text-gray-300">
                  Your email has been successfully verified.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-6 px-6 py-3 bg-gradient-to-r from-[#af1f24] to-[#d4363c] text-white rounded-xl
                             hover:from-[#9a1b1f] hover:to-[#bf2f34]
                             focus:outline-none focus:ring-2 focus:ring-[#af1f24] focus:ring-offset-2 
                             transition-all duration-200 text-sm font-semibold"
                >
                  Go to Dashboard
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <FaExclamationCircle className="text-red-500 text-6xl mb-4 mx-auto" />
                <h2 className="text-2xl font-semibold text-white mb-2">
                  Verification Failed
                </h2>
                <p className="text-gray-300">
                  We couldn't verify your email. The link may be invalid or
                  expired.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-6 px-6 py-3 bg-gradient-to-r from-[#af1f24] to-[#d4363c] text-white rounded-xl
                             hover:from-[#9a1b1f] hover:to-[#bf2f34]
                             focus:outline-none focus:ring-2 focus:ring-[#af1f24] focus:ring-offset-2 
                             transition-all duration-200 text-sm font-semibold"
                >
                  Resend Verification Email
                </motion.button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
