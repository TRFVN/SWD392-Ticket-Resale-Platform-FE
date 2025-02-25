import React, { useState, memo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, Search } from "lucide-react";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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

// Optimized Section Title component
const SectionTitle = memo(({ title, subtitle }) => (
  <motion.div
    variants={containerVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-100px" }}
    className="text-center mb-16"
  >
    <motion.div
      variants={itemVariants}
      className="flex items-center justify-center gap-2 mb-4"
    >
      <span className="w-12 h-1 bg-orange-500 rounded-full"></span>
      <span className="text-orange-500 font-semibold uppercase tracking-wider">
        FAQ
      </span>
      <span className="w-12 h-1 bg-orange-500 rounded-full"></span>
    </motion.div>

    <motion.h2
      variants={itemVariants}
      className="text-4xl font-bold mb-4 text-gray-900 dark:text-white"
    >
      {title}
    </motion.h2>

    <motion.p
      variants={itemVariants}
      className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
    >
      {subtitle}
    </motion.p>
  </motion.div>
));

// Optimized FAQ Item component
const FAQItem = memo(({ question, answer, isOpen, onToggle, index }) => {
  const contentRef = useRef(null);

  return (
    <motion.div
      variants={itemVariants}
      className={`border-b border-gray-200 dark:border-gray-700 
        ${isOpen ? "bg-orange-50/50 dark:bg-orange-900/10 rounded-lg" : ""}`}
    >
      <button
        className="w-full py-6 px-4 flex justify-between items-center text-left focus:outline-none focus:ring-2 focus:ring-orange-500/40 rounded-lg"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${index}`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center 
            ${
              isOpen
                ? "bg-orange-500 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
            }`}
          >
            <HelpCircle className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {question}
          </h3>
        </div>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center 
            ${
              isOpen
                ? "bg-orange-500 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
            }`}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            ref={contentRef}
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: "auto",
              opacity: 1,
              transition: {
                height: { duration: 0.3, ease: "easeOut" },
                opacity: { duration: 0.2, delay: 0.1 },
              },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                height: { duration: 0.3, ease: "easeIn" },
                opacity: { duration: 0.2 },
              },
            }}
            className="overflow-hidden"
            id={`faq-answer-${index}`}
          >
            <div className="px-4 pb-6 pl-16">
              <p className="text-gray-600 dark:text-gray-300">{answer}</p>

              {/* Optional: "Was this helpful?" buttons */}
              <div className="flex items-center gap-3 mt-4 text-sm text-gray-500">
                <span>Was this helpful?</span>
                <button className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  Yes
                </button>
                <button className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  No
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

// Main component
const FAQSection = () => {
  // State for active FAQ
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // FAQ toggle handler
  const handleToggle = useCallback((index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  }, []);

  // Search handler
  const handleSearch = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  // FAQ data
  const faqs = [
    {
      question: "How do I purchase tickets?",
      answer:
        "Simply browse events, select your desired tickets, and proceed to checkout. We accept all major payment methods including credit cards, PayPal, and Apple Pay. After purchase, tickets will be delivered to your email or available in your account.",
    },
    {
      question: "Can I get a refund for my tickets?",
      answer:
        "Refund policies vary by event. Please check the specific event's terms and conditions for details. Generally, most events allow refunds up to 48 hours before the event starts. For special circumstances, please contact our support team.",
    },
    {
      question: "How do I transfer tickets to someone else?",
      answer:
        "You can easily transfer tickets through your account dashboard or the mobile app. Go to 'My Tickets', select the ticket you want to transfer, click 'Transfer', and enter the recipient's email address. They'll receive instructions to claim the tickets.",
    },
    {
      question: "Are the tickets guaranteed authentic?",
      answer:
        "Yes, all tickets purchased through our platform are 100% guaranteed authentic. We work directly with event organizers and verified resellers. If you ever encounter an issue with ticket validity, we offer a full refund guarantee.",
    },
    {
      question: "What happens if my event gets postponed or cancelled?",
      answer:
        "If an event is postponed, your tickets will automatically be valid for the new date. If an event is cancelled, you'll automatically receive a refund to your original payment method within 10-14 business days.",
    },
  ];

  // Filter FAQs based on search query
  const filteredFaqs = searchQuery
    ? faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : faqs;

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-800/50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-1/2 h-64 bg-orange-50 dark:bg-orange-950/10 rounded-br-full -z-10" />
      <div className="absolute bottom-0 right-0 w-1/3 h-1/2 bg-gray-100 dark:bg-gray-700/20 rounded-tl-3xl -z-10" />

      <div className="container mx-auto px-6">
        <SectionTitle
          title="Frequently Asked Questions"
          subtitle="Got questions? We've got answers to help you navigate our platform"
        />

        {/* Search bar */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-3xl mx-auto mb-12"
        >
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full py-3.5 pl-12 pr-4 rounded-xl bg-white dark:bg-gray-700 
                border border-gray-200 dark:border-gray-600
                focus:outline-none focus:ring-2 focus:ring-orange-500/40
                text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
        </motion.div>

        {/* FAQ items */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-3xl mx-auto divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800 rounded-xl shadow-sm"
        >
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <FAQItem
                key={`faq-${index}`}
                question={faq.question}
                answer={faq.answer}
                isOpen={activeIndex === index}
                onToggle={() => handleToggle(index)}
                index={index}
              />
            ))
          ) : (
            <motion.div variants={itemVariants} className="py-12 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                No matching questions found. Try a different search term.
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Contact support link */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 dark:text-gray-300">
            Can't find what you're looking for?{" "}
            <a
              href="#"
              className="text-orange-500 hover:text-orange-600 font-medium"
            >
              Contact our support team
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
