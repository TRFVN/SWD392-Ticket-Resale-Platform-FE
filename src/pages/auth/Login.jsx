import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaChevronRight,
  FaGoogle,
  FaFacebook,
} from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import { AuthContext } from "../../context/AuthContext";

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
      className="block text-white text-sm font-medium mb-2 flex items-center opacity-80"
    >
      {icon}
      <span className="ml-2">{label}</span>
    </label>
    <div className="relative group">
      <Field
        name={name}
        type={type}
        placeholder={placeholder}
        className={`w-full px-5 py-3 rounded-xl bg-white/10 text-white placeholder-gray-400 
                   focus:outline-none focus:ring-2 focus:ring-[#af1f24] focus:bg-white/15
                   transition-all duration-300 backdrop-blur-sm
                   border ${
                     errors[name] && touched[name]
                       ? "border-red-500"
                       : "border-white/10 hover:border-white/20"
                   }`}
      />
      {errors[name] && touched[name] && (
        <p className="mt-1 text-red-500 text-sm">{errors[name]}</p>
      )}
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
      className="block text-white text-sm font-medium mb-2 flex items-center opacity-80"
    >
      <FaLock className="text-white" />
      <span className="ml-2">{label}</span>
    </label>
    <div className="relative group">
      <Field
        name={name}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        className={`w-full px-5 py-3 rounded-xl bg-white/10 text-white placeholder-gray-400 
                   focus:outline-none focus:ring-2 focus:ring-[#af1f24] focus:bg-white/15
                   transition-all duration-300 backdrop-blur-sm
                   border ${
                     errors[name] && touched[name]
                       ? "border-red-500"
                       : "border-white/10 hover:border-white/20"
                   }`}
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors duration-200"
      >
        {showPassword ? <FaEyeSlash /> : <FaEye />}
      </button>
      {errors[name] && touched[name] && (
        <p className="mt-1 text-red-500 text-sm">{errors[name]}</p>
      )}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl -z-10" />
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
                Welcome Back
              </h1>
              <p className="text-gray-400">Sign in to continue your journey</p>
            </motion.div>

            <Formik
              initialValues={{ email: "", password: "", rememberMe: false }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form className="space-y-4">
                  <InputField
                    icon={<FaEnvelope className="text-white" />}
                    label="Email"
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

                  {/* Display global error if any */}
                  {(authError || errors.submit) && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm text-center"
                    >
                      {authError || errors.submit}
                    </motion.div>
                  )}

                  <motion.div
                    className="flex items-center justify-between text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="flex items-center space-x-2 text-gray-400 hover:text-white cursor-pointer">
                      <Field
                        type="checkbox"
                        name="rememberMe"
                        className="rounded border-gray-600 text-[#af1f24] focus:ring-[#af1f24]"
                      />
                      <span>Remember me</span>
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-[#af1f24] hover:text-[#d4363c] transition-colors duration-200"
                    >
                      Forgot password?
                    </Link>
                  </motion.div>

                  <motion.div
                    className="mt-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isSubmitting || loading}
                      className={`w-full px-6 py-4 bg-gradient-to-r from-[#af1f24] to-[#d4363c] text-white rounded-xl
                               hover:from-[#9a1b1f] hover:to-[#bf2f34]
                               focus:outline-none focus:ring-2 focus:ring-[#af1f24] focus:ring-offset-2 
                               transition-all duration-200 text-sm font-semibold
                               flex items-center justify-center space-x-2 group
                               ${
                                 isSubmitting || loading
                                   ? "opacity-70 cursor-not-allowed"
                                   : ""
                               }`}
                    >
                      {isSubmitting || loading ? (
                        <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      ) : (
                        <>
                          <span>Sign In</span>
                          <FaChevronRight className="transition-transform duration-200 group-hover:translate-x-1" />
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                </Form>
              )}
            </Formik>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
