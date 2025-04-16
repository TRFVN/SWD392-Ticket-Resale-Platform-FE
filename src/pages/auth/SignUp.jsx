import React, { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";
import { FaGoogle } from "react-icons/fa";
import { HiOutlineTicket, HiLightningBolt } from "react-icons/hi";
import { useSelector } from "react-redux";
import TicketLogo from "../../assets/TicketHub_Logo.png";
import {
  ACCOUNT_TYPES,
  AccountTypeSelector,
  FormButtons,
  initialValues,
  signupSteps,
  StepContent,
  StepIndicator,
  validationSchemas,
} from "../../components/auth/sign-up";
import ThemeToggle from "../../components/common/ThemeToggle";

// Simplified component for feature cards
const FeatureCard = ({ icon: Icon, title, description }) => {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  return (
    <div
      className={`p-4 rounded-lg border ${
        isDarkMode ? "border-white/10" : "border-gray-200"
      }`}
    >
      <div className="flex items-start space-x-3">
        <div className="text-orange-500">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h3
            className={`text-sm font-medium ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {title}
          </h3>
          <p
            className={`text-xs ${
              isDarkMode ? "text-white/70" : "text-gray-600"
            }`}
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

// Quote section with reduced animations
const QuoteSection = React.memo(({ isDarkMode }) => (
  <div className="h-full w-full relative px-8 py-10 flex flex-col justify-center">
    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/90 to-orange-600/90 rounded-2xl"></div>

    <div className="relative z-10 flex flex-col h-full justify-between">
      <div>
        <div className="mb-8">
          <img
            src={TicketLogo}
            alt="TicketHub Logo"
            className="w-16 h-16 mb-6"
          />

          <h2 className="text-3xl font-medium text-white mb-4">
            Mua bán vé sự kiện <br />
            dễ dàng và an toàn
          </h2>

          <p className="text-white/80 text-base">
            Nền tảng giao dịch vé sự kiện minh bạch và bảo mật cho cả người mua
            và người bán.
          </p>
        </div>

        <div className="space-y-3 mb-auto">
          <FeatureCard
            icon={HiOutlineTicket}
            title="Giao dịch bảo mật"
            description="Hệ thống xác thực 2 lớp và bảo vệ thông tin giao dịch"
          />
          <FeatureCard
            icon={HiLightningBolt}
            title="Thanh toán nhanh chóng"
            description="Nhiều phương thức thanh toán và xử lý tức thì"
          />
        </div>
      </div>

      <div className="mt-8 bg-white/10 rounded-xl p-4 border border-white/10 backdrop-blur-sm">
        <p className="text-white/90 italic mb-2">
          &ldquo;TicketHub đã thay đổi cách tôi mua vé sự kiện - an toàn, nhanh
          chóng và đáng tin cậy.&rdquo;
        </p>
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-white/20 mr-2"></div>
          <p className="text-white/80 text-sm">
            Nguyễn Minh, Người dùng TicketHub
          </p>
        </div>
      </div>
    </div>
  </div>
));

QuoteSection.displayName = "QuoteSection";

// Google button component
const GoogleButton = ({ onClick, isLoading, isDarkMode }) => (
  <button
    onClick={onClick}
    disabled={isLoading}
    className={`w-full flex items-center justify-center gap-3 px-5 py-3
      ${
        isDarkMode
          ? "bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
      }
      border rounded-lg transition-colors
      disabled:opacity-70 disabled:cursor-not-allowed`}
  >
    {isLoading ? (
      <>
        <div
          className={`w-5 h-5 border-2 rounded-full animate-spin ${
            isDarkMode
              ? "border-white border-t-transparent"
              : "border-gray-500 border-t-transparent"
          }`}
        ></div>
        <span>Đang kết nối...</span>
      </>
    ) : (
      <>
        <FaGoogle className="w-5 h-5 text-[#4285F4]" />
        <span className="font-medium">Tiếp tục với Google</span>
      </>
    )}
  </button>
);

const Signup = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [accountType, setAccountType] = useState(ACCOUNT_TYPES.INDIVIDUAL);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const { signupCustomer, loading, googleLogin } = useAuth();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  const handleSubmit = useCallback(
    async (values, { setSubmitting, setFieldError }) => {
      try {
        // Format customer data to match API expectations
        let birthDateFormatted;

        if (values.birthDate) {
          const dateObj = new Date(values.birthDate);
          if (!isNaN(dateObj.getTime())) {
            birthDateFormatted = dateObj.toISOString();
          } else {
            birthDateFormatted = new Date().toISOString();
          }
        } else {
          birthDateFormatted = new Date().toISOString();
        }

        const customerData = {
          email: values.email,
          password: values.password,
          confirmPassword: values.confirmPassword,
          cccd: values.idNumber || values.cccd || "",
          birthDate: birthDateFormatted,
          phoneNumber: values.phoneNumber || "",
          fullName: values.fullName || "",
          country: values.country || "",
          address: values.address || "",
          gender: values.gender || "",
        };

        await signupCustomer(customerData);

        toast.success("Đăng ký thành công! Vui lòng xác nhận email của bạn.", {
          onClose: () => {
            navigate("/login", {
              state: {
                message:
                  "Đăng ký thành công! Vui lòng xác nhận email của bạn để tiếp tục.",
              },
            });
          },
        });
      } catch (error) {
        console.error("Signup error:", error);
        setFieldError("submit", error.message);
        toast.error(error.message || "Đăng ký thất bại");
      } finally {
        setSubmitting(false);
      }
    },
    [navigate, signupCustomer],
  );

  const handleGoogleSignup = async () => {
    try {
      await googleLogin();
      toast.success("Đăng ký thành công với Google!");
      navigate("/");
    } catch (error) {
      if (error?.error !== "popup_closed_by_user") {
        toast.error(error.message || "Đăng ký với Google thất bại");
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

  const progressPercentage = ((currentStep + 1) / currentSteps.length) * 100;

  return (
    <div
      className={`min-h-screen flex items-center justify-center
      ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}
      py-8 px-4 sm:px-6 lg:px-8`}
    >
      <ThemeToggle />

      <div className="w-full max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Registration Form */}
          <div
            className={`rounded-2xl overflow-hidden ${
              isDarkMode
                ? "bg-gray-800/80 border border-gray-700/30"
                : "bg-white/95 border border-gray-200 shadow-sm"
            }`}
          >
            {/* Progress bar */}
            <div className="h-1 bg-gray-200/10">
              <div
                className="h-full bg-orange-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            <div className="p-6 sm:p-8">
              <div className="max-w-md mx-auto">
                <div className="mb-6">
                  <h1
                    className={`text-2xl font-medium
                    ${isDarkMode ? "text-white" : "text-gray-900"}`}
                  >
                    {currentSteps[currentStep].title}
                  </h1>
                  <p
                    className={`mt-1 text-sm
                    ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    {currentSteps[currentStep].subtitle}
                  </p>
                </div>

                {/* Account Type Selector */}
                <div className="mb-6">
                  <AccountTypeSelector
                    selectedType={accountType}
                    isDarkMode={isDarkMode}
                  />
                </div>

                {/* Progress Indicator */}
                <div className="mb-6">
                  <StepIndicator
                    currentStep={currentStep}
                    totalSteps={currentSteps.length}
                    steps={currentSteps}
                  />
                </div>

                {/* Form */}
                <div
                  className={`rounded-xl 
                  ${isDarkMode ? "bg-gray-800/50" : "bg-white/50"} 
                  p-5 border 
                  ${isDarkMode ? "border-gray-700/40" : "border-gray-200/40"}`}
                >
                  <Formik
                    initialValues={{
                      ...initialValues[accountType],
                      accountType: accountType,
                    }}
                    validationSchema={validationSchemas[accountType]}
                    onSubmit={handleSubmit}
                    enableReinitialize
                  >
                    {({ errors, touched, values, isValid, dirty }) => (
                      <Form className="space-y-5">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={`${accountType}-${currentStep}`}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
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
                          <div
                            className={`rounded-lg p-3 text-sm
                              ${
                                isDarkMode
                                  ? "bg-red-900/20 border border-red-900/30 text-red-400"
                                  : "bg-red-50 border border-red-100 text-red-500"
                              }`}
                          >
                            {errors.submit}
                          </div>
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
                          <div className="mt-6">
                            <div className="relative">
                              <div className="absolute inset-0 flex items-center">
                                <div
                                  className={`w-full border-t
                                  ${
                                    isDarkMode
                                      ? "border-gray-700/60"
                                      : "border-gray-200/60"
                                  }`}
                                />
                              </div>
                              <div className="relative flex justify-center text-xs">
                                <span
                                  className={`px-2 
                                  ${
                                    isDarkMode
                                      ? "bg-gray-800/50 text-gray-400"
                                      : "bg-white text-gray-500"
                                  }`}
                                >
                                  Hoặc tiếp tục với
                                </span>
                              </div>
                            </div>
                            <div className="mt-4">
                              <GoogleButton
                                onClick={handleGoogleSignup}
                                isLoading={loading}
                                isDarkMode={isDarkMode}
                              />
                            </div>
                          </div>
                        )}

                        {/* Sign In Link */}
                        <div className="text-center pt-1">
                          <Link
                            to="/login"
                            className={`text-sm transition-colors duration-200
                              ${
                                isDarkMode
                                  ? "text-gray-400 hover:text-orange-400"
                                  : "text-gray-600 hover:text-orange-500"
                              }`}
                          >
                            Đã có tài khoản?{" "}
                            <span className="font-medium">Đăng nhập</span>
                          </Link>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Quote & Info */}
          <div className="hidden lg:block">
            <QuoteSection isDarkMode={isDarkMode} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
