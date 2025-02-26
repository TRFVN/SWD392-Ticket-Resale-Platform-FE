import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";
import {
  ACCOUNT_TYPES,
  AccountTypeSelector,
  FormButtons,
  initialValues,
  signupSteps,
  SocialLogin,
  StepContent,
  StepIndicator,
  validationSchemas,
} from "../../components/auth/sign-up";

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
  const [currentStep, setCurrentStep] = useState(0);
  const [accountType, setAccountType] = useState(ACCOUNT_TYPES.INDIVIDUAL);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const { signupCustomer, signupOrganization, loading, googleLogin } =
    useAuth();

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      // Ensure we're using the correct signup function based on the current account type
      // This is the critical fix - we need to use the accountType from state, not from values
      if (accountType === ACCOUNT_TYPES.INDIVIDUAL) {
        await signupCustomer(values);
      } else {
        await signupOrganization(values);
      }

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
      console.error("Signup error:", error);
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

  const currentSteps = signupSteps[accountType];

  const isStepValid = (values, errors, step) => {
    const stepFields = currentSteps[step].fields;
    return stepFields.every((field) => values[field] && !errors[field]);
  };

  const handleNextStep = (values, errors) => {
    if (
      currentStep < currentSteps.length - 1 &&
      isStepValid(values, errors, currentStep)
    ) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleAccountTypeChange = (type) => {
    setAccountType(type);
    setCurrentStep(0);
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
          <motion.h2
            className="mt-6 text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {currentSteps[currentStep].title}
          </motion.h2>
          <motion.p
            className="mt-2 text-sm text-gray-600 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {currentSteps[currentStep].subtitle}
          </motion.p>
        </div>

        {/* Account Type Selector */}
        <AccountTypeSelector
          selectedType={accountType}
          onChange={handleAccountTypeChange}
        />

        {/* Progress Indicator */}
        <StepIndicator
          currentStep={currentStep}
          totalSteps={currentSteps.length}
          steps={currentSteps}
        />

        {/* Form */}
        <Formik
          initialValues={{
            ...initialValues[accountType],
            accountType: accountType, // Ensure accountType is correctly set in form values
          }}
          validationSchema={validationSchemas[accountType]}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ errors, touched, values, isValid, dirty }) => (
            <Form className="mt-8 space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${accountType}-${currentStep}`}
                  variants={animationVariants}
                  initial="stepInitial"
                  animate="stepAnimate"
                  exit="stepExit"
                  transition={{ duration: 0.2 }}
                >
                  <StepContent
                    step={currentStep}
                    accountType={accountType}
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
                totalSteps={currentSteps.length}
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
