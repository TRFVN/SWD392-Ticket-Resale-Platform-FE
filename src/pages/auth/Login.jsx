import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaGoogle,
  FaFacebook,
} from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import { useGoogleLogin } from "@react-oauth/google";
import TicketLogo from "../../assets/TicketHub_Logo.png";
import axios from "axios";

const InputField = ({
  icon,
  label,
  name,
  type,
  placeholder,
  errors,
  touched,
}) => (
  <motion.div
    className="mb-6"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <label
      htmlFor={name}
      className="block text-gray-700 text-sm font-medium mb-2 flex items-center"
    >
      {icon}
      <span className="ml-2">{label}</span>
    </label>
    <div className="relative">
      <Field
        name={name}
        type={type}
        placeholder={placeholder}
        className={`w-full px-4 py-2 rounded-lg bg-white text-gray-800 placeholder-gray-500
                   focus:outline-none focus:ring-2 focus:ring-orange-400
                   transition-all duration-300
                   border ${
                     errors[name] && touched[name]
                       ? "border-red-500"
                       : "border-gray-300 hover:border-gray-400"
                   }`}
      />
      {errors[name] && touched[name] && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-red-500 text-sm"
        >
          {errors[name]}
        </motion.p>
      )}
    </div>
  </motion.div>
);

const PasswordField = ({
  label,
  name,
  placeholder,
  showPassword,
  togglePasswordVisibility,
  errors,
  touched,
}) => (
  <motion.div
    className="mb-6"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <label
      htmlFor={name}
      className="block text-gray-700 text-sm font-medium mb-2 flex items-center"
    >
      <FaLock className="text-gray-600" />
      <span className="ml-2">{label}</span>
    </label>
    <div className="relative">
      <Field
        name={name}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        className={`w-full px-4 py-2 rounded-lg bg-white text-gray-800 placeholder-gray-500
                   focus:outline-none focus:ring-2 focus:ring-orange-400
                   transition-all duration-300
                   border ${
                     errors[name] && touched[name]
                       ? "border-red-500"
                       : "border-gray-300 hover:border-gray-400"
                   }`}
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
      >
        {showPassword ? <FaEyeSlash /> : <FaEye />}
      </button>
      {errors[name] && touched[name] && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-red-500 text-sm"
        >
          {errors[name]}
        </motion.p>
      )}
    </div>
  </motion.div>
);

const Login = () => {
  const navigate = useNavigate();
  const {
    login,
    error: authError,
    loading,
    clearError,
  } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
    rememberMe: Yup.boolean(),
  });

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const response = await login(values.email, values.password);
      if (response && response.result) {
        if (values.rememberMe) {
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.removeItem("rememberMe");
        }

        const role = response.result.role?.toLowerCase();
        switch (role) {
          case "admin":
            navigate("/admin/dashboard");
            break;
          case "user":
            navigate("/dashboard");
            break;
          default:
            navigate("/dashboard");
        }
      }
    } catch (err) {
      setFieldError("submit", err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log("Token Response:", tokenResponse);
      try {
        const userInfo = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          },
        );
        console.log("User Info:", userInfo.data);
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    },
    onError: () => console.log("Login Failed"),
    scope: "profile email",
  });

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
              Sign in to your account
            </h2>
            <p className="text-sm text-gray-600">
              Or start your 14-day free trial
            </p>
          </div>

          <Formik
            initialValues={{ email: "", password: "", rememberMe: false }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="mt-8 space-y-6">
                <InputField
                  icon={<FaEnvelope className="text-gray-600" />}
                  label="Email address"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  errors={errors}
                  touched={touched}
                />

                <PasswordField
                  label="Password"
                  name="password"
                  placeholder="Enter your password"
                  showPassword={showPassword}
                  togglePasswordVisibility={() =>
                    setShowPassword(!showPassword)
                  }
                  errors={errors}
                  touched={touched}
                />

                <AnimatePresence>
                  {(authError || errors.submit) && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-500 text-sm text-center bg-red-100 border border-red-400 rounded-lg p-3"
                    >
                      {authError || errors.submit}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-orange-400 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <Link
                      to="/forgot-password"
                      className="font-medium text-orange-400 hover:text-orange-500"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                </div>

                <div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting || loading}
                    className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-orange-400 hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${
                      isSubmitting || loading
                        ? "opacity-70 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {isSubmitting || loading ? (
                      <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                          <FaLock
                            className="h-5 w-5 text-orange-300 group-hover:text-orange-400"
                            aria-hidden="true"
                          />
                        </span>
                        Sign in
                      </>
                    )}
                  </motion.button>
                </div>
              </Form>
            )}
          </Formik>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <button
                  onClick={() => googleLogin()}
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  <FaGoogle className="h-5 w-5 text-orange-400" />
                  <span className="ml-2">Google</span>
                </button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <button
                  onClick={() => {
                    /* Implement Facebook login */
                  }}
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  <FaFacebook className="h-5 w-5 text-blue-600" />
                  <span className="ml-2">Facebook</span>
                </button>
              </motion.div>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-gray-600">
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
