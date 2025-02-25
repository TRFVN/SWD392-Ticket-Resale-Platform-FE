import React, { useState, memo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Mail,
  CheckCircle,
  AlertCircle,
  Bell,
  Calendar,
  Gift,
} from "lucide-react";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
};

// Benefit card component
const BenefitCard = memo(({ title, description, icon: Icon, index }) => (
  <motion.div
    variants={itemVariants}
    custom={index}
    className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center transform hover:-translate-y-2 transition-transform duration-300"
  >
    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
      <Icon className="w-6 h-6 text-white" />
    </div>
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-white/80">{description}</p>
  </motion.div>
));

// Status message component
const StatusMessage = memo(({ status }) => {
  const isSuccess = status === "success";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, height: 0 }}
      animate={{ opacity: 1, y: 0, height: "auto" }}
      exit={{ opacity: 0, y: 10, height: 0 }}
      transition={{ duration: 0.3 }}
      className={`mt-4 rounded-lg ${
        isSuccess ? "bg-white/20" : "bg-red-500/20"
      } backdrop-blur-sm p-3 flex items-center gap-2`}
    >
      {isSuccess ? (
        <>
          <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />
          <p className="text-white text-sm">
            Thanks for subscribing! Please check your email to confirm your
            subscription.
          </p>
        </>
      ) : (
        <>
          <AlertCircle className="w-5 h-5 text-white flex-shrink-0" />
          <p className="text-white text-sm">
            Something went wrong. Please try again.
          </p>
        </>
      )}
    </motion.div>
  );
});

// Main component
const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);

  // Benefits data with icons
  const benefits = [
    {
      icon: Calendar,
      title: "Early Access",
      description:
        "Get first access to ticket sales and exclusive presales for top events",
    },
    {
      icon: Bell,
      title: "Personalized Updates",
      description:
        "Receive notifications about events matching your interests and preferences",
    },
    {
      icon: Gift,
      title: "Special Offers",
      description: "Exclusive discounts and promotions just for subscribers",
    },
  ];

  // Form submission handler
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!email || !email.includes("@")) return;

      setIsSubscribing(true);

      // Simulate API call
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setSubscriptionStatus("success");
        setEmail("");
      } catch (error) {
        setSubscriptionStatus("error");
      } finally {
        setIsSubscribing(false);
        // Clear status after 5 seconds
        setTimeout(() => setSubscriptionStatus(null), 5000);
      }
    },
    [email],
  );

  return (
    <section className="relative py-28 overflow-hidden">
      {/* Background with gradient and pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-orange-500 to-orange-600" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1NiIgaGVpZ2h0PSIxMDAiPgo8cGF0aCBkPSJNMjggNjYgMCA1MCA1MCAyMCA2NiAwdjE2bDEwIDEwLTEwIDEwdiI+PC9wYXRoPgo8L3N2Zz4=')] bg-repeat opacity-5" />

      {/* Decorative shapes */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-orange-400/20 filter blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-orange-700/20 filter blur-3xl" />

      {/* Content */}
      <motion.div
        className="relative container mx-auto px-6 z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Stay Updated with Event Alerts
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-white/90 mb-10"
          >
            Get personalized event recommendations and exclusive offers
            delivered right to your inbox
          </motion.p>

          {/* Newsletter Form */}
          <motion.div variants={itemVariants}>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-12 pr-4 py-3.5 rounded-lg bg-white/95 
                      text-gray-900 placeholder-gray-500 focus:outline-none 
                      focus:ring-2 focus:ring-white/30 shadow-xl"
                    disabled={isSubscribing}
                    aria-label="Email address"
                    required
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={isSubscribing}
                  className="px-6 py-3.5 bg-gray-900 hover:bg-black text-white rounded-lg 
                    font-medium flex items-center justify-center gap-2
                    transition-colors disabled:opacity-70 shadow-xl"
                  aria-label="Subscribe to newsletter"
                >
                  {isSubscribing ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                      <span>Subscribing</span>
                    </>
                  ) : (
                    <>
                      <span>Subscribe Now</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </motion.button>
              </div>

              {/* Status Messages */}
              <AnimatePresence>
                {subscriptionStatus && (
                  <StatusMessage status={subscriptionStatus} />
                )}
              </AnimatePresence>

              <motion.p
                variants={itemVariants}
                className="mt-4 text-sm text-white/80"
              >
                By subscribing, you agree to our{" "}
                <button
                  type="button"
                  className="underline hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/30 rounded"
                >
                  Privacy Policy
                </button>{" "}
                and{" "}
                <button
                  type="button"
                  className="underline hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/30 rounded"
                >
                  Terms of Service
                </button>
              </motion.p>
            </form>
          </motion.div>

          {/* Benefits Grid */}
          <motion.div
            variants={itemVariants}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {benefits.map((benefit, index) => (
              <BenefitCard key={benefit.title} {...benefit} index={index} />
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default NewsletterSection;
