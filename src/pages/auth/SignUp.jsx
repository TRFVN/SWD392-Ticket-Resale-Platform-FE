import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaUser,
  FaPhone,
  FaGlobe,
  FaMapMarkerAlt,
  FaIdCard,
  FaBirthdayCake,
  FaChevronRight,
} from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";

const InputField = ({ icon, label, name, type, placeholder }) => (
  <motion.div
    className="mb-6"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <label className="block text-white text-sm font-medium mb-2 flex items-center opacity-80">
      {icon}
      <span className="ml-2">{label}</span>
    </label>
    <div className="relative group">
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        className="w-full px-5 py-3 rounded-xl bg-white/10 text-white placeholder-gray-400 
                 focus:outline-none focus:ring-2 focus:ring-[#af1f24] focus:bg-white/15
                 transition-all duration-300 backdrop-blur-sm
                 border border-white/10 hover:border-white/20"
      />
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl -z-10" />
    </div>
  </motion.div>
);

const PasswordField = ({
  label,
  name,
  placeholder,
  showPassword,
  togglePasswordVisibility,
}) => (
  <motion.div
    className="mb-6"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <label className="block text-white text-sm font-medium mb-2 flex items-center opacity-80">
      <FaLock className="text-white" />
      <span className="ml-2">{label}</span>
    </label>
    <div className="relative group">
      <input
        name={name}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        className="w-full px-5 py-3 rounded-xl bg-white/10 text-white placeholder-gray-400 
                 focus:outline-none focus:ring-2 focus:ring-[#af1f24] focus:bg-white/15
                 transition-all duration-300 backdrop-blur-sm
                 border border-white/10 hover:border-white/20"
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors duration-200"
      >
        {showPassword ? <FaEyeSlash /> : <FaEye />}
      </button>
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl -z-10" />
    </div>
  </motion.div>
);
const Signup = () => {
  const { signup, error: authError, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.target);
    const userData = {
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
      fullName: formData.get("fullName"),
      cccd: formData.get("cccd"),
      phoneNumber: formData.get("phoneNumber"),
      birthDate: formData.get("birthDate"),
      country: formData.get("country"),
      address: formData.get("address"),
    };

    try {
      if (userData.password !== userData.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      await signup(userData);

      navigate("/login", {
        state: {
          message:
            "Registration successful! Please check your email to verify your account before logging in.",
        },
      });
    } catch (err) {
      setError(err.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5"></div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl mx-4 relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="backdrop-blur-xl bg-black/30 rounded-3xl shadow-2xl overflow-hidden border border-white/10"
        >
          <div className="p-8 lg:p-12">
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
                Create Your Account
              </h1>
              <p className="text-gray-400">
                Join our community and start your journey
              </p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-2">
              {/* Hiển thị lỗi nếu có */}
              {(error || authError) && (
                <div className="p-3 mb-4 text-sm text-red-500 bg-red-100/10 rounded-lg">
                  {error || authError}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  icon={<FaEnvelope className="text-white" />}
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                />

                <InputField
                  icon={<FaUser className="text-white" />}
                  label="Full Name"
                  name="fullName"
                  type="text"
                  placeholder="Enter your full name"
                />

                <PasswordField
                  label="Password"
                  name="password"
                  placeholder="Enter your password"
                  showPassword={showPassword}
                  togglePasswordVisibility={() =>
                    setShowPassword(!showPassword)
                  }
                />

                <PasswordField
                  label="Confirm Password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  showPassword={showConfirmPassword}
                  togglePasswordVisibility={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                />

                <InputField
                  icon={<FaIdCard className="text-white" />}
                  label="CCCD"
                  name="cccd"
                  type="text"
                  placeholder="Enter your CCCD"
                />

                <InputField
                  icon={<FaPhone className="text-white" />}
                  label="Phone Number"
                  name="phoneNumber"
                  type="tel"
                  placeholder="Enter your phone number"
                />

                <InputField
                  icon={<FaBirthdayCake className="text-white" />}
                  label="Birth Date"
                  name="birthDate"
                  type="date"
                  placeholder="Select your birth date"
                />

                <InputField
                  icon={<FaGlobe className="text-white" />}
                  label="Country"
                  name="country"
                  type="text"
                  placeholder="Enter your country"
                />
              </div>

              <InputField
                icon={<FaMapMarkerAlt className="text-white" />}
                label="Address"
                name="address"
                type="text"
                placeholder="Enter your address"
              />

              <motion.div className="mt-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className={`w-full px-6 py-4 bg-gradient-to-r from-[#af1f24] to-[#d4363c] 
                       text-white rounded-xl flex items-center justify-center space-x-2 
                       group transition-all duration-200 text-sm font-semibold
                       ${
                         loading
                           ? "opacity-70 cursor-not-allowed"
                           : "hover:from-[#9a1b1f] hover:to-[#bf2f34]"
                       }`}
                >
                  <span>
                    {loading ? "Creating Account..." : "Create Account"}
                  </span>
                  {!loading && (
                    <FaChevronRight className="transition-transform duration-200 group-hover:translate-x-1" />
                  )}
                </motion.button>
              </motion.div>
            </form>

            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Link
                to="/login"
                className="text-gray-400 hover:text-white transition-colors duration-200 text-sm flex items-center justify-center group"
              >
                Already have an account?
                <span className="ml-2 text-[#af1f24] group-hover:text-[#d4363c] font-medium">
                  Sign in
                </span>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Signup;
