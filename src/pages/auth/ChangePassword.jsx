import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaLock, FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";

const ChangePassword = ({ onClose, onSubmit }) => {
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [error, setError] = useState("");

  const handleChange = (field) => (e) => {
    setPasswords({ ...passwords, [field]: e.target.value });
    setError("");
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      setError("New passwords don't match");
      return;
    }
    onSubmit({
      currentPassword: passwords.current,
      newPassword: passwords.new,
    });
  };

  const PasswordInput = ({ field, label, placeholder }) => (
    <div className="mb-4">
      <label className="block text-gray-200 text-sm font-medium mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type={showPasswords[field] ? "text" : "password"}
          value={passwords[field]}
          onChange={handleChange(field)}
          placeholder={placeholder}
          className="w-full px-4 py-2 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent backdrop-blur-sm transition duration-300"
        />
        <button
          type="button"
          onClick={() => togglePasswordVisibility(field)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition duration-200"
        >
          {showPasswords[field] ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-white/10 backdrop-blur-md"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Change Password</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition duration-200"
            >
              <FaTimes />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <PasswordInput
              field="current"
              label="Current Password"
              placeholder="Enter current password"
            />
            <PasswordInput
              field="new"
              label="New Password"
              placeholder="Enter new password"
            />
            <PasswordInput
              field="confirm"
              label="Confirm New Password"
              placeholder="Confirm new password"
            />
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm"
              >
                {error}
              </motion.p>
            )}
            <div className="flex justify-end space-x-3 mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600 transition duration-300"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-400 to-orange-500 text-white hover:from-orange-500 hover:to-orange-600 transition duration-300"
              >
                Change Password
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ChangePassword;
