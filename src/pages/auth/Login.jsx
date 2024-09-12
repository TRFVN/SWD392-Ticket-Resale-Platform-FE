import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useGoogleLogin } from "@react-oauth/google";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUserGraduate,
  FaChalkboardTeacher,
} from "react-icons/fa";

const loginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const otpSchema = Yup.object().shape({
  otp: Yup.string()
    .required("OTP is required")
    .length(6, "OTP must be 6 digits"),
});

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const parseJwt = useCallback((token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  }, []);

  const fetchUserData = useCallback(
    async (email) => {
      try {
        const response = await fetch(
          `http://localhost/main-service/api/users?email=${encodeURIComponent(
            email,
          )}`,
        );
        const data = await response.json();
        if (data.success) {
          setUserData(data.payload);
          localStorage.setItem("Userdata", JSON.stringify(data.payload));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    },
    [setUserData],
  );
  //   const navigateBasedOnRole = useCallback(
  //     (role) => {
  //       const routes = {
  //         STUDENT: "/student",
  //         INSTRUCTOR: "/instructor",
  //         SUPER_ADMIN: "/super_admin",
  //       };
  //       setTimeout(() => navigate(routes[role] || "/dashboard"), 2000);
  //     },
  //     [router],
  //   );

  const processLoginResponse = useCallback(
    (payload) => {
      const { AccessToken, RefreshToken } = payload;
      localStorage.setItem("accessToken", AccessToken);
      localStorage.setItem("refreshToken", RefreshToken);

      const decodedToken = parseJwt(AccessToken);
      localStorage.setItem("usermail", decodedToken.sub);

      toast.success("Login successful!");
      // Fetch user data and store it in localStorage
      fetchUserData(decodedToken.sub);
    },
    [parseJwt, fetchUserData],
  );

  const handleSubmit = async (values, { setSubmitting }) => {
    if (!showOtpField) {
      try {
        const response = await fetch(
          "http://localhost/auth-service/api/user/auth/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: values.email,
              password: values.password,
            }),
          },
        );

        if (response.ok) {
          const data = await response.json();
          if (values.email === "admin@admin.com") {
            processLoginResponse(data.payload);
          } else {
            setShowOtpField(true);
            setEmail(values.email);
            toast.info("OTP has been sent to your email.");
          }
        } else {
          throw new Error("Login failed");
        }
      } catch (error) {
        toast.error(
          "Login failed. Please check your credentials and try again.",
        );
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleOtpSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await fetch(
        "http://localhost/auth-service/api/user/auth/check-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            otp: values.otp,
            email: email,
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        processLoginResponse(data.payload);
      } else {
        throw new Error("OTP verification failed");
      }
    } catch (error) {
      toast.error("OTP verification failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLoginSuccess = async (codeResponse, role) => {
    try {
      const response = await fetch(
        `http://localhost/auth-service/api/user/auth/login-google?accessToken=${codeResponse.access_token}&role=${role}`,
        {
          method: "GET",
        },
      );

      if (response.ok) {
        const data = await response.json();
        processLoginResponse(data.payload);
      } else {
        throw new Error("Google login failed");
      }
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Google login failed. Please try again.");
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: (codeResponse) =>
      handleGoogleLoginSuccess(codeResponse, "STUDENT"),
    onError: () => {
      toast.error("Google login failed. Please try again.");
    },
  });

  const loginAsInstructorWithGoogle = useGoogleLogin({
    onSuccess: (codeResponse) =>
      handleGoogleLoginSuccess(codeResponse, "INSTRUCTOR"),
    onError: () => {
      toast.error("Google login failed. Please try again.");
    },
  });

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="m-auto w-full max-w-md p-8 bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700"
      >
        <h1 className="text-3xl font-bold mb-6 text-white text-center">
          Login
        </h1>
        <AnimatePresence mode="wait">
          {!showOtpField ? (
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={loginSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form className="space-y-4">
                  <div className="relative">
                    <FaEnvelope
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <Field
                      name="email"
                      type="email"
                      placeholder="Email"
                      className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                  {touched.email && errors.email && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.email}
                    </div>
                  )}

                  <div className="relative">
                    <FaLock
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <Field
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="w-full pl-10 pr-10 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {showPassword ? (
                        <FaEyeSlash size={18} />
                      ) : (
                        <FaEye size={18} />
                      )}
                    </button>
                  </div>
                  {touched.password && errors.password && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.password}
                    </div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className={`w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all duration-300 ${
                      isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Logging in..." : "Login"}
                  </motion.button>
                </Form>
              )}
            </Formik>
          ) : (
            <Formik
              initialValues={{ otp: "" }}
              validationSchema={otpSchema}
              onSubmit={handleOtpSubmit}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form className="space-y-4">
                  <Field
                    name="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {touched.otp && errors.otp && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.otp}
                    </div>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className={`w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all duration-300 ${
                      isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Verifying..." : "Verify OTP"}
                  </motion.button>
                </Form>
              )}
            </Formik>
          )}
        </AnimatePresence>

        {!showOtpField && (
          <div className="mt-6 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => loginWithGoogle()}
                className="flex items-center justify-center px-4 py-2 border border-gray-600 rounded-lg shadow-sm text-sm font-medium text-white bg-gray-700 hover:bg-gray-600"
              >
                <FaUserGraduate className="w-5 h-5 mr-2" />
                Student
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => loginAsInstructorWithGoogle()}
                className="flex items-center justify-center px-4 py-2 border border-gray-600 rounded-lg shadow-sm text-sm font-medium text-white bg-gray-700 hover:bg-gray-600"
              >
                <FaChalkboardTeacher className="w-5 h-5 mr-2" />
                Instructor
              </motion.button>
            </div>
          </div>
        )}

        <p className="text-center text-sm text-gray-400 mt-6">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
          >
            Sign up
          </button>
        </p>
      </motion.div>
      <ToastContainer theme="dark" />
    </div>
  );
}
