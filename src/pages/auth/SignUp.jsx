// components/auth/Signup.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";
import { StepIndicator } from "../../components/auth/sign-up/StepIndicator";
import { StepContent } from "../../components/auth/sign-up/StepContent";
import { FormButtons } from "../../components/auth/sign-up/FormButtons";
import { SocialLogin } from "../../components/auth/sign-up/SocialLogin";
// Tách validation schema và steps ra file riêng để dễ maintain
import {
  signupValidationSchema,
  signupSteps,
  STEP_FIELDS,
} from "../../components/auth/sign-up/constants";

// Tách animation variants ra để tái sử dụng
const animationVariants = {
  pageInitial: {
    opacity: 0,
    y: 20,
  },
  pageAnimate: {
    opacity: 1,
    y: 0,
  },
  stepInitial: {
    opacity: 0,
    x: 20,
  },
  stepAnimate: {
    opacity: 1,
    x: 0,
  },
  stepExit: {
    opacity: 0,
    x: -20,
  },
};

const Signup = () => {
  // State
  const [currentStep, setCurrentStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Hooks
  const navigate = useNavigate();
  const { signup, loading, googleLogin } = useAuth();

  // Initial form values
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

  // Handlers
  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      await signup(values);

      toast.success("Registration successful! Please verify your email.", {
        onClose: () => {
          navigate("/login", {
            state: {
              message:
                "Registration successful! Please verify your email to continue.",
            },
          });
        },
      });
    } catch (error) {
      setFieldError("submit", error.message);
      toast.error(error.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await googleLogin();
      toast.success("Successfully signed up with Google!");
      navigate("/");
    } catch (error) {
      if (error?.error !== "popup_closed_by_user") {
        toast.error(error.message || "Failed to sign up with Google");
      }
    }
  };

  // Validation helper
  const isStepValid = (values, errors, step) => {
    const stepFields = STEP_FIELDS[step];
    return stepFields.every((field) => values[field] && !errors[field]);
  };

  // Step navigation
  const handleNextStep = (values, errors) => {
    if (
      currentStep < signupSteps.length - 1 &&
      isStepValid(values, errors, currentStep)
    ) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        variants={animationVariants}
        initial="pageInitial"
        animate="pageAnimate"
        className="max-w-2xl w-full space-y-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8
          backdrop-filter backdrop-blur-lg bg-opacity-95"
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
            className="mt-6 text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {signupSteps[currentStep].title}
          </motion.h2>
          <motion.p
            className="mt-2 text-sm text-gray-600 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {signupSteps[currentStep].subtitle}
          </motion.p>
        </div>

        {/* Progress Indicator */}
        <StepIndicator
          currentStep={currentStep}
          totalSteps={signupSteps.length}
          steps={signupSteps}
        />

        {/* Form */}
        <Formik
          initialValues={initialValues}
          validationSchema={signupValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, values, isValid, dirty }) => (
            <Form className="mt-8 space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  variants={animationVariants}
                  initial="stepInitial"
                  animate="stepAnimate"
                  exit="stepExit"
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
                totalSteps={signupSteps.length}
                isValid={isStepValid(values, errors, currentStep)}
                dirty={dirty}
                loading={loading}
                onBack={handlePreviousStep}
                onNext={() => handleNextStep(values, errors)}
              />

              {/* Social Login */}
              {currentStep === 0 && (
                <SocialLogin
                  onGoogleSignup={handleGoogleSignup}
                  loading={loading}
                />
              )}

              {/* Sign In Link */}
              <div className="text-center mt-4">
                <Link
                  to="/login"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 
                    dark:hover:text-orange-400 transition-colors duration-200"
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
