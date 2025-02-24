import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { SectionTitle } from "../../components/common/Home";

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <button
        className="w-full py-6 flex justify-between items-center text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {question}
        </h3>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-gray-600 dark:text-gray-300">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQSection = () => {
  const faqs = [
    {
      question: "How do I purchase tickets?",
      answer:
        "Simply browse events, select your desired tickets, and proceed to checkout. We accept all major payment methods.",
    },
    {
      question: "Can I get a refund for my tickets?",
      answer:
        "Refund policies vary by event. Please check the specific event's terms and conditions for details.",
    },
    {
      question: "How do I transfer tickets to someone else?",
      answer:
        "You can easily transfer tickets through your account dashboard or the mobile app.",
    },
    {
      question: "Are the tickets guaranteed authentic?",
      answer:
        "Yes, all tickets purchased through our platform are 100% guaranteed authentic.",
    },
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
      <div className="container mx-auto px-6">
        <SectionTitle
          title="Frequently Asked Questions"
          subtitle="Got questions? We've got answers"
        />

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq) => (
            <FAQItem key={faq.question} {...faq} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
