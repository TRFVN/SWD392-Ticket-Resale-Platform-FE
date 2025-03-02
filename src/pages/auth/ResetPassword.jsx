import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import axiosInstance from "../../config/axiosConfig";
import {
  Eye,
  EyeOff,
  Lock,
  ArrowRight,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const ResetPassword = () => {
  // State
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [validationErrors, setValidationErrors] = useState({
    password: "",
    confirmPassword: "",
  });

  // Hooks
  const navigate = useNavigate();
  const location = useLocation();
  const isDarkMode = useSelector((state) => state.theme?.isDarkMode || false);

  // Parse query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailParam = params.get("email");
    const tokenParam = params.get("token");

    if (emailParam && tokenParam) {
      setEmail(emailParam);
      setToken(tokenParam);
    } else {
      setError(
        "Invalid or missing reset parameters. Please request a new password reset link.",
      );
    }
  }, [location]);

  // Validate password
  const validatePassword = (value) => {
    if (!value) return "Password is required";
    if (value.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(value))
      return "Password must contain at least one uppercase letter";
    if (!/[a-z]/.test(value))
      return "Password must contain at least one lowercase letter";
    if (!/[0-9]/.test(value))
      return "Password must contain at least one number";
    if (!/[^A-Za-z0-9]/.test(value))
      return "Password must contain at least one special character";
    return "";
  };

  // Validate confirm password
  const validateConfirmPassword = (value) => {
    if (!value) return "Please confirm your password";
    if (value !== password) return "Passwords do not match";
    return "";
  };

  // Handle input change
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setValidationErrors((prev) => ({
      ...prev,
      password: validatePassword(value),
    }));
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setValidationErrors((prev) => ({
      ...prev,
      confirmPassword: validateConfirmPassword(value),
    }));
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    const passwordError = validatePassword(password);
    const confirmPasswordError = validateConfirmPassword(confirmPassword);

    setValidationErrors({
      password: passwordError,
      confirmPassword: confirmPasswordError,
    });

    // Return if there are validation errors
    if (passwordError || confirmPasswordError) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axiosInstance.post("password/reset", {
        email,
        token,
        newPassword: password,
        confirmPassword: confirmPassword,
      });

      if (response.data && response.data.isSuccess) {
        setSuccess(true);
        toast.success("Your password has been reset successfully!");
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        throw new Error(response.data?.message || "Failed to reset password");
      }
    } catch (err) {
      setError(
        err.message ||
          "Failed to reset password. Please try again or request a new reset link.",
      );
      toast.error(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    if (!password) return { level: 0, text: "", color: "" };

    const hasLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    const strength = [
      hasLength,
      hasUpper,
      hasLower,
      hasNumber,
      hasSpecial,
    ].filter(Boolean).length;

    if (strength <= 2) return { level: 1, text: "Weak", color: "bg-red-500" };
    if (strength === 3)
      return { level: 2, text: "Fair", color: "bg-yellow-500" };
    if (strength === 4) return { level: 3, text: "Good", color: "bg-blue-500" };
    return { level: 4, text: "Strong", color: "bg-green-500" };
  };

  // If reset is successful, show success screen
  if (success) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDarkMode ? "bg-black" : "bg-gray-50"
        }`}
      >
        <div
          className={`w-full max-w-md p-8 rounded-xl shadow-lg ${
            isDarkMode
              ? "bg-gray-800/50 border-gray-700"
              : "bg-white/50 border-gray-200"
          } backdrop-blur border`}
        >
          <div className="flex flex-col items-center justify-center text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <h1
              className={`text-2xl font-bold mb-2 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Password Reset Successful
            </h1>
            <p
              className={`mb-6 ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Your password has been reset successfully. You will be redirected
              to the login page shortly.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg transition-colors font-medium"
            >
              Go to Login <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const passwordStrength = getPasswordStrength();

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        isDarkMode ? "bg-black" : "bg-gray-50"
      }`}
    >
      <div
        className={`w-full max-w-md p-8 rounded-xl shadow-lg ${
          isDarkMode
            ? "bg-gray-800/50 border-gray-700"
            : "bg-white/50 border-gray-200"
        } backdrop-blur border`}
      >
        <h1
          className={`text-2xl font-bold mb-6 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Reset Your Password
        </h1>

        {error && (
          <div
            className={`p-4 mb-6 rounded-lg ${
              isDarkMode
                ? "bg-red-500/10 text-red-400"
                : "bg-red-100 text-red-800"
            } flex items-start gap-3`}
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email display */}
          <div>
            <p
              className={`text-sm font-medium mb-1 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Resetting password for:
            </p>
            <p
              className={`${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              } font-medium`}
            >
              {email}
            </p>
          </div>

          {/* New Password Field */}
          <div>
            <label
              className={`block text-sm font-medium mb-1 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              New Password
            </label>
            <div className="relative">
              <div
                className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                className={`w-full pl-10 pr-10 py-3 rounded-lg border ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors`}
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className={`absolute inset-y-0 right-0 flex items-center pr-3 ${
                  isDarkMode
                    ? "text-gray-400 hover:text-gray-300"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {validationErrors.password && (
              <p className="mt-1 text-sm text-red-500">
                {validationErrors.password}
              </p>
            )}

            {/* Password strength meter */}
            {password && (
              <div className="mt-2">
                <div className="flex justify-between items-center mb-1">
                  <span
                    className={`text-xs ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Password strength:
                  </span>
                  <span
                    className={`text-xs font-medium ${
                      passwordStrength.level <= 1
                        ? "text-red-500"
                        : passwordStrength.level === 2
                        ? "text-yellow-500"
                        : passwordStrength.level === 3
                        ? "text-blue-500"
                        : "text-green-500"
                    }`}
                  >
                    {passwordStrength.text}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${passwordStrength.color}`}
                    style={{ width: `${(passwordStrength.level / 4) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label
              className={`block text-sm font-medium mb-1 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Confirm Password
            </label>
            <div className="relative">
              <div
                className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                className={`w-full pl-10 pr-10 py-3 rounded-lg border ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors`}
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className={`absolute inset-y-0 right-0 flex items-center pr-3 ${
                  isDarkMode
                    ? "text-gray-400 hover:text-gray-300"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {validationErrors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">
                {validationErrors.confirmPassword}
              </p>
            )}
          </div>

          {/* Password requirements */}
          <div
            className={`text-xs ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            <p className="mb-1 font-medium">Password must contain:</p>
            <ul className="space-y-1 list-disc pl-5">
              <li className={password.length >= 8 ? "text-green-500" : ""}>
                At least 8 characters
              </li>
              <li className={/[A-Z]/.test(password) ? "text-green-500" : ""}>
                At least one uppercase letter
              </li>
              <li className={/[a-z]/.test(password) ? "text-green-500" : ""}>
                At least one lowercase letter
              </li>
              <li className={/[0-9]/.test(password) ? "text-green-500" : ""}>
                At least one number
              </li>
              <li
                className={
                  /[^A-Za-z0-9]/.test(password) ? "text-green-500" : ""
                }
              >
                At least one special character
              </li>
            </ul>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={
              loading ||
              !!validationErrors.password ||
              !!validationErrors.confirmPassword
            }
            className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 
              disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg 
              transition-colors font-medium"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              "Reset Password"
            )}
          </button>

          {/* Back to Login */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className={`text-sm ${
                isDarkMode
                  ? "text-orange-400 hover:text-orange-300"
                  : "text-orange-600 hover:text-orange-700"
              }`}
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
