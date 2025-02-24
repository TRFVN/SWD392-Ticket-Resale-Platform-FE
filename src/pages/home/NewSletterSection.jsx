import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

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
      // Clear status after 3 seconds
      setTimeout(() => setSubscriptionStatus(null), 3000);
    }
  };

  const benefits = [
    {
      title: "Early Access",
      description: "Get first access to ticket sales and exclusive presales",
    },
    {
      title: "Personalized Updates",
      description: "Receive notifications about events you might like",
    },
    {
      title: "Special Offers",
      description: "Exclusive discounts and promotions just for subscribers",
    },
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-500" />

      {/* Content */}
      <div className="relative container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-4xl font-bold text-white">
              Stay Updated with Event Alerts
            </h2>
            <p className="text-lg text-white/90">
              Get personalized event recommendations and exclusive offers
              delivered right to your inbox
            </p>

            {/* Newsletter Form */}
            <div className="mt-8">
              <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/95 
                      text-gray-900 placeholder-gray-500 focus:outline-none 
                      focus:ring-2 focus:ring-white/20"
                      disabled={isSubscribing}
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubscribing}
                    className="px-6 py-3 bg-gray-900 text-white rounded-lg 
                    font-medium flex items-center justify-center gap-2
                    hover:bg-gray-800 transition-colors disabled:opacity-70"
                  >
                    {isSubscribing ? (
                      <span>Subscribing...</span>
                    ) : (
                      <>
                        Subscribe Now
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                </div>

                {/* Status Messages */}
                {subscriptionStatus && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4"
                  >
                    {subscriptionStatus === "success" ? (
                      <p className="text-white">
                        ✨ Thanks for subscribing! Please check your email to
                        confirm.
                      </p>
                    ) : (
                      <p className="text-white">
                        Something went wrong. Please try again.
                      </p>
                    )}
                  </motion.div>
                )}

                <p className="mt-4 text-sm text-white/80">
                  By subscribing, you agree to our{" "}
                  <button type="button" className="underline hover:text-white">
                    Privacy Policy
                  </button>{" "}
                  and{" "}
                  <button type="button" className="underline hover:text-white">
                    Terms of Service
                  </button>
                </p>
              </form>
            </div>

            {/* Benefits Grid */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-white/80">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
