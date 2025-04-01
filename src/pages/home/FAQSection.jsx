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
        Câu hỏi thường gặp
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

SectionTitle.displayName = "SectionTitle";

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
                <span>Thông tin này có hữu ích?</span>
                <button className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  Có
                </button>
                <button className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  Không
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

FAQItem.displayName = "FAQItem";

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

  // FAQ data with Vietnamese content
  const faqs = [
    {
      question: "Làm thế nào để mua vé sự kiện?",
      answer:
        "Bạn có thể dễ dàng mua vé bằng cách duyệt danh sách sự kiện, chọn vé mong muốn và tiến hành thanh toán. Chúng tôi chấp nhận tất cả các phương thức thanh toán phổ biến bao gồm thẻ tín dụng, ví điện tử và chuyển khoản ngân hàng. Sau khi mua, vé sẽ được gửi đến email của bạn hoặc có sẵn trong tài khoản.",
    },
    {
      question: "Tôi có thể hoàn tiền vé không?",
      answer:
        "Chính sách hoàn tiền khác nhau tùy theo từng sự kiện. Vui lòng kiểm tra điều khoản và điều kiện cụ thể của sự kiện để biết chi tiết. Thông thường, hầu hết các sự kiện cho phép hoàn tiền trong vòng 48 giờ trước khi sự kiện bắt đầu. Trong trường hợp đặc biệt, vui lòng liên hệ với đội ngũ hỗ trợ của chúng tôi.",
    },
    {
      question: "Làm thế nào để chuyển vé cho người khác?",
      answer:
        "Bạn có thể dễ dàng chuyển vé thông qua trang quản lý tài khoản hoặc ứng dụng di động. Vào phần 'Vé của tôi', chọn vé muốn chuyển, nhấp vào 'Chuyển vé' và nhập địa chỉ email của người nhận. Họ sẽ nhận được hướng dẫn để nhận vé.",
    },
    {
      question: "Vé có được đảm bảo chính hãng không?",
      answer:
        "Vâng, tất cả vé được mua thông qua nền tảng của chúng tôi đều được đảm bảo 100% chính hãng. Chúng tôi làm việc trực tiếp với ban tổ chức sự kiện và các đại lý được xác minh. Nếu bạn gặp vấn đề về tính hợp lệ của vé, chúng tôi sẽ hoàn tiền đầy đủ.",
    },
    {
      question: "Điều gì xảy ra nếu sự kiện bị hoãn hoặc hủy?",
      answer:
        "Nếu sự kiện bị hoãn, vé của bạn sẽ tự động có hiệu lực cho ngày mới. Nếu sự kiện bị hủy, bạn sẽ tự động nhận được hoàn tiền vào phương thức thanh toán ban đầu trong vòng 10-14 ngày làm việc.",
    },
    {
      question: "Tôi có thể mua vé trực tiếp tại cửa không?",
      answer:
        "Có, một số sự kiện cho phép mua vé trực tiếp tại cửa. Tuy nhiên, chúng tôi khuyến nghị mua vé trước qua nền tảng để đảm bảo có chỗ và nhận được các ưu đãi đặc biệt. Vui lòng kiểm tra thông tin chi tiết của từng sự kiện.",
    },
    {
      question: "Làm thế nào để tôi nhận được thông báo về sự kiện mới?",
      answer:
        "Bạn có thể đăng ký nhận thông báo bằng cách tạo tài khoản và chọn các danh mục sự kiện yêu thích. Chúng tôi sẽ gửi email thông báo về các sự kiện mới phù hợp với sở thích của bạn.",
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
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-orange-500/5 rounded-full -translate-y-1/2 -translate-x-1/2 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-400/5 rounded-full translate-y-1/2 translate-x-1/4 blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <SectionTitle
          title="Câu Hỏi Thường Gặp"
          subtitle="Tìm câu trả lời cho những thắc mắc phổ biến"
        />

        {/* Search bar */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-xl mx-auto mb-12"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm câu hỏi..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-12 pr-4 py-3 rounded-full bg-white dark:bg-gray-800 
                border border-gray-200 dark:border-gray-700 focus:border-orange-500 
                focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
            />
          </div>
        </motion.div>

        {/* FAQ list */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-3xl mx-auto space-y-4"
        >
          {filteredFaqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={activeIndex === index}
              onToggle={() => handleToggle(index)}
              index={index}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
