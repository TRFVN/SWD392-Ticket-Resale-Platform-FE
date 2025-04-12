import React, { useState, useCallback, memo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";
import { FaGoogle } from "react-icons/fa";
import {
  HiOutlineShieldCheck,
  HiArrowRight,
  HiMoon,
  HiSun,
  HiOutlineTicket,
  HiLightningBolt,
} from "react-icons/hi";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../../store/slice/themeSlice";
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

// Subtle background animation
const BackgroundAnimation = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        className="absolute inset-0 w-full h-full opacity-50"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="goo">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="10"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
              result="goo"
            />
          </filter>
        </defs>
      </svg>
      {[1, 2, 3, 4].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          initial={{
            background:
              i % 2 === 0
                ? "radial-gradient(circle, rgba(251,146,60,0.15) 0%, rgba(251,146,60,0) 70%)"
                : "radial-gradient(circle, rgba(249,115,22,0.1) 0%, rgba(249,115,22,0) 70%)",
            width: `${Math.random() * 50 + 20}vw`,
            height: `${Math.random() * 50 + 20}vh`,
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
            opacity: 0.3,
          }}
          animate={{
            x: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
            y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: Math.random() * 30 + 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Subtle hover effect card
const HoverCard = ({ children, className }) => {
  return (
    <motion.div
      className={`relative ${className}`}
      whileHover={{
        y: -4,
        transition: { duration: 0.2 },
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
    >
      {children}
    </motion.div>
  );
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const stepAnimations = {
  stepInitial: {
    opacity: 0,
    y: 10,
  },
  stepAnimate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  stepExit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.2,
    },
  },
};

// ThemeToggle component
const ThemeToggle = memo(() => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      onClick={handleToggleTheme}
      className={`fixed top-4 right-4 p-2.5 rounded-full z-50
        ${
          isDarkMode
            ? "bg-white/10 text-orange-400 hover:bg-white/15"
            : "bg-black/5 text-orange-500 hover:bg-black/10"
        } 
        backdrop-blur-sm transition-all duration-200`}
      aria-label={
        isDarkMode ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"
      }
    >
      {isDarkMode ? (
        <HiSun className="w-5 h-5" />
      ) : (
        <HiMoon className="w-5 h-5" />
      )}
    </motion.button>
  );
});

ThemeToggle.displayName = "ThemeToggle";

// Custom Google Button Component
const GoogleButton = memo(({ onClick, isLoading, isDarkMode }) => (
  <motion.button
    whileHover={{ y: -2 }}
    whileTap={{ y: 0 }}
    onClick={onClick}
    disabled={isLoading}
    className={`w-full flex items-center justify-center gap-3 px-5 py-3.5
      relative group
      ${
        isDarkMode
          ? "bg-white/5 text-gray-200 hover:bg-white/10"
          : "bg-black/5 text-gray-700 hover:bg-black/10"
      }
      rounded-xl backdrop-blur-sm
      disabled:opacity-50 disabled:cursor-not-allowed
      transition-all duration-200`}
    aria-label="Đăng ký với Google"
  >
    {isLoading ? (
      <>
        <div
          className={`w-4 h-4 border-2 ${
            isDarkMode ? "border-gray-300" : "border-gray-500"
          } border-t-transparent rounded-full animate-spin`}
        ></div>
        <span>Đang kết nối...</span>
      </>
    ) : (
      <>
        <FaGoogle className="w-4 h-4 text-[#4285F4]" />
        <span>Tiếp tục với Google</span>
        <motion.div className="absolute right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <HiArrowRight className="w-4 h-4" />
        </motion.div>
      </>
    )}
  </motion.button>
));

GoogleButton.displayName = "GoogleButton";

// Minimal Feature Card
const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <motion.div
      variants={itemVariants}
      className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10"
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
    >
      <div className="flex items-center mb-3">
        <div className="bg-orange-500/10 p-2 rounded-md mr-3 text-orange-400">
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="font-medium text-white">{title}</h3>
      </div>
      <p className="text-white/70 text-sm">{description}</p>
    </motion.div>
  );
};

// Quote component with subtle effects
const QuoteSection = memo(({ isDarkMode }) => (
  <motion.div
    className="h-full w-full relative px-8 py-10 flex flex-col justify-center"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.8 }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/90 to-orange-600/90 rounded-2xl"></div>

    {/* Subtle pattern overlay */}
    <div className="absolute inset-0 opacity-5 mix-blend-overlay">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="smallGrid"
            width="10"
            height="10"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 10 0 L 0 0 0 10"
              fill="none"
              stroke="white"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#smallGrid)" />
      </svg>
    </div>

    <motion.div
      className="relative z-10 flex flex-col h-full justify-between"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div>
        <motion.div variants={itemVariants} className="mb-8">
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
        </motion.div>

        <motion.div variants={containerVariants} className="space-y-3 mb-auto">
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
        </motion.div>
      </div>

      <motion.div
        variants={itemVariants}
        className="mt-8 bg-white/10 rounded-xl p-4 border border-white/10 backdrop-blur-sm"
      >
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
      </motion.div>
    </motion.div>
  </motion.div>
));

QuoteSection.displayName = "QuoteSection";

const Signup = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [accountType, setAccountType] = useState(ACCOUNT_TYPES.INDIVIDUAL);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const { signupCustomer, signupOrganization, loading, googleLogin } =
    useAuth();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  const handleSubmit = useCallback(
    async (values, { setSubmitting, setFieldError }) => {
      try {
        // Prepare data based on account type
        if (accountType === ACCOUNT_TYPES.INDIVIDUAL) {
          // Format customer data to match API expectations exactly
          let birthDateFormatted;

          // Handle different date formats
          if (values.birthDate) {
            // Ensure it's a valid date string
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

          console.log("Customer signup data:", customerData);
          await signupCustomer(customerData);
        } else {
          // Format organization data to match API expectations
          const organizationData = {
            email: values.email,
            password: values.password,
            confirmPassword: values.confirmPassword,
            taxId: values.taxId || "",
            phoneNumber: values.phoneNumber || "",
            organizationName: values.organizationName || "",
            country: values.country || "",
            address: values.address || "",
          };
          await signupOrganization(organizationData);
        }

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
    [accountType, navigate, signupCustomer, signupOrganization],
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

  const handleAccountTypeChange = (type) => {
    setAccountType(type);
    setCurrentStep(0);
  };

  // Create progress percentage for the progress bar
  const progressPercentage = ((currentStep + 1) / currentSteps.length) * 100;

  return (
    <div
      className={`min-h-screen flex items-center justify-center relative
      ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}
      py-8 px-4 sm:px-6 lg:px-8`}
    >
      <BackgroundAnimation />
      <ThemeToggle />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-7xl relative z-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Registration Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="backdrop-blur-sm bg-white/5 dark:bg-gray-800/10 rounded-2xl border border-white/10 dark:border-gray-700/20 overflow-hidden"
          >
            {/* Progress bar */}
            <div className="h-1 bg-gray-200/5">
              <motion.div
                className="h-full bg-orange-500"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            <div className="p-6 sm:p-8">
              <div className="max-w-md mx-auto">
                <motion.div
                  className="mb-6"
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                >
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
                </motion.div>

                {/* Account Type Selector */}
                <motion.div
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  className="mb-6"
                >
                  <AccountTypeSelector
                    selectedType={accountType}
                    onChange={handleAccountTypeChange}
                    isDarkMode={isDarkMode}
                  />
                </motion.div>

                {/* Progress Indicator */}
                <motion.div
                  className="mb-6"
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <StepIndicator
                    currentStep={currentStep}
                    totalSteps={currentSteps.length}
                    steps={currentSteps}
                  />
                </motion.div>

                {/* Form */}
                <div
                  className={`rounded-xl 
                  ${isDarkMode ? "bg-gray-800/30" : "bg-white/30"} 
                  backdrop-blur-sm p-5 border 
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
                            variants={stepAnimations}
                            initial="stepInitial"
                            animate="stepAnimate"
                            exit="stepExit"
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
                            className={`rounded-lg p-3 text-sm
                              ${
                                isDarkMode
                                  ? "bg-red-900/20 border border-red-900/30 text-red-400"
                                  : "bg-red-50 border border-red-100 text-red-500"
                              }`}
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
                          <motion.div
                            className="mt-6"
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                          >
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
                                      ? "bg-gray-800/30 text-gray-400"
                                      : "bg-white/30 text-gray-500"
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
                          </motion.div>
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
          </motion.div>

          {/* Right Column - Quote & Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="hidden lg:block"
          >
            <QuoteSection isDarkMode={isDarkMode} />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
