// components/auth/Signup.jsx
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { AuthContext } from "../../context/AuthContext";
import { StepIndicator } from "../../components/auth/sign-up/StepIndicator";
import { StepContent } from "../../components/auth/sign-up/StepContent";
import { FormButtons } from "../../components/auth/sign-up/FormButtons";
import { SocialLogin } from "../../components/auth/sign-up/SocialLogin";
import { toast } from "react-toastify";
import { setError } from "../../store/slice/authSlice";

const steps = [
  {
    title: "Account",
    subtitle: "Create your account credentials",
  },
  {
    title: "Personal",
    subtitle: "Tell us about yourself",
  },
  {
    title: "Verification",
    subtitle: "Verify your identity",
  },
];
// components/auth/Signup.jsx (continued)
const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Password confirmation is required"),
  fullName: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .required("Full name is required"),
  phoneNumber: Yup.string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(10, "Must be at least 10 digits")
    .required("Phone number is required"),
  birthDate: Yup.date()
    .max(new Date(), "Birth date cannot be in the future")
    .required("Birth date is required"),
  cccd: Yup.string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .length(12, "CCCD must be exactly 12 digits")
    .required("CCCD is required"),
  country: Yup.string().required("Country is required"),
  address: Yup.string().required("Address is required"),
});

const Signup = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signup, loading } = useContext(AuthContext);

  const navigate = useNavigate();

  const initialValues = {
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phoneNumber: "",
    birthDate: "",
    cccd: "",
    country: "",
    address: "",
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError(null);
      await signup(values);

      // Show success message
      toast.success("Registration successful! Please verify your email.");

      // Navigate to login
      navigate("/login", {
        state: {
          message:
            "Registration successful! Please verify your email to continue.",
        },
      });
    } catch (err) {
      // setError(err.message || "Registration failed. Please try again.");
      // toast.error(err.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };
  // Function to check if current step is valid
  const isStepValid = (values, errors, step) => {
    const stepFields = {
      0: ["email", "password", "confirmPassword"],
      1: ["fullName", "phoneNumber", "birthDate"],
      2: ["cccd", "country", "address"],
    }[step];

    const hasErrors = stepFields.some((field) => errors[field]);
    const hasValues = stepFields.every((field) => values[field]);

    return hasValues && !hasErrors;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full space-y-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
      >
        {/* Header */}
        <div className="text-center">
          <motion.img
            src="/logo.png"
            alt="Logo"
            className="mx-auto h-12 w-auto"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 15 }}
          />
          <motion.h2
            className="mt-6 text-3xl font-bold text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {steps[currentStep].title}
          </motion.h2>
          <motion.p
            className="mt-2 text-sm text-gray-600 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {steps[currentStep].subtitle}
          </motion.p>
        </div>

        {/* Progress Indicator */}
        <StepIndicator
          currentStep={currentStep}
          totalSteps={steps.length}
          steps={steps}
        />

        {/* Form */}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, values, isValid, dirty }) => (
            <Form className="mt-8 space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <StepContent
                    step={currentStep}
                    errors={errors}
                    touched={touched}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                    showConfirmPassword={showConfirmPassword}
                    setShowConfirmPassword={setShowConfirmPassword}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Error Message */}
              {errors.submit && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg bg-red-50 dark:bg-red-900/30 p-4 text-red-600 dark:text-red-400 text-sm"
                >
                  {errors.submit}
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <FormButtons
                currentStep={currentStep}
                totalSteps={steps.length}
                isValid={isStepValid(values, errors, currentStep)}
                dirty={dirty}
                loading={loading}
                onBack={() => setCurrentStep((prev) => prev - 1)}
                onNext={() => {
                  if (
                    currentStep < steps.length - 1 &&
                    isStepValid(values, errors, currentStep)
                  ) {
                    setCurrentStep((prev) => prev + 1);
                  }
                }}
              />

              {/* Social Login */}
              {currentStep === 0 && <SocialLogin />}

              {/* Sign In Link */}
              <div className="text-center mt-4">
                <Link
                  to="/login"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400"
                >
                  Already have an account?{" "}
                  <span className="font-medium">Sign in</span>
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </motion.div>
    </div>
  );
};

export default Signup;
