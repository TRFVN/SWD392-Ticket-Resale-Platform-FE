// Login.jsx
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import * as Yup from "yup";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import TicketLogo from "../../assets/TicketHub_Logo.png";
import { LoginForm } from "../../components/auth/login/LoginForm";
import { SocialButton } from "../../components/auth/login/SocialButton";
import { useDispatch, useSelector } from "react-redux";
import { setGoogleLoginSuccess } from "../../store/slice/authSlice";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
  rememberMe: Yup.boolean(),
});

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { login, loading, googleLogin } = useContext(AuthContext);
  const googleLoginSuccess = useSelector(
    (state) => state.auth.googleLoginSuccess,
  );

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
      console.error("Google login error:", error);
      if (error?.error !== "popup_closed_by_user") {
        toast.error(error.message || "Failed to login with Google");
      }
    }
  };

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const response = await login(values.email, values.password);
      if (response?.isSuccess) {
        if (values.rememberMe) {
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.removeItem("rememberMe");
        }
        toast.success("Successfully logged in!", {
          onClose: () => navigate("/"),
        });
      }
    } catch (error) {
      setFieldError("submit", error.message);
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[400px] space-y-6 sm:space-y-8"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden 
            border border-gray-200 dark:border-gray-700 p-6 sm:p-8"
        >
          <div className="text-center mb-6 sm:mb-8">
            <motion.img
              src={TicketLogo}
              alt="Logo"
              className="h-16 sm:h-20 w-auto mx-auto mb-3 sm:mb-4"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            />
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-1 sm:mb-2">
              Sign in to your account
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Or start your 14-day free trial
            </p>
          </div>

          <LoginForm
            onSubmit={handleSubmit}
            loading={loading}
            validationSchema={validationSchema}
          />

          <div className="mt-6">
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
              />
            </div>
          </div>

          <p className="mt-6 text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Not a member?{" "}
            <Link
              to="/signup"
              className="font-medium text-orange-400 hover:text-orange-500"
            >
              Start a 14 day free trial
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
