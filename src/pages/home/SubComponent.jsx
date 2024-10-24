import { motion } from "framer-motion";
import { useState } from "react";
import { FaCalendarAlt, FaMapMarkerAlt, FaStar } from "react-icons/fa";
// TestimonialCard.jsx
const TestimonialCard = ({ name, role, image, comment }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg"
  >
    <div className="flex items-center gap-4 mb-4">
      <img
        src={image}
        alt={name}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div>
        <h4 className="font-semibold text-gray-900 dark:text-white">{name}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">{role}</p>
      </div>
    </div>
    <p className="text-gray-600 dark:text-gray-300">{comment}</p>
    <div className="flex gap-1 mt-4">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar key={star} className="text-yellow-400" />
      ))}
    </div>
  </motion.div>
);

// EventCard.jsx
const EventCard = ({ image, title, date, location, price, category }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg group"
  >
    <div className="relative h-48">
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
      />
      <div className="absolute top-4 right-4 px-3 py-1 bg-orange-500 text-white rounded-full text-sm">
        {category}
      </div>
    </div>
    <div className="p-6">
      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        {title}
      </h4>
      <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300 text-sm mb-4">
        <span className="flex items-center gap-2">
          <FaCalendarAlt />
          {date}
        </span>
        <span className="flex items-center gap-2">
          <FaMapMarkerAlt />
          {location}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-orange-500 font-bold">From ${price}</span>
        <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
          Book Now
        </button>
      </div>
    </div>
  </motion.div>
);

// NewsCard.jsx
const NewsCard = ({ image, title, date, excerpt }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg"
  >
    <div className="relative h-48">
      <img src={image} alt={title} className="w-full h-full object-cover" />
      <div className="absolute top-4 left-4 px-3 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-full text-sm">
        {date}
      </div>
    </div>
    <div className="p-6">
      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        {title}
      </h4>
      <p className="text-gray-600 dark:text-gray-300 mb-4">{excerpt}</p>
      <button className="text-orange-500 hover:text-orange-600 font-medium">
        Read More →
      </button>
    </div>
  </motion.div>
);

// FAQItem.jsx
const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <button
        className="w-full py-4 flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-medium text-gray-900 dark:text-white">
          {question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="text-gray-500"
        >
          ↓
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0 }}
        className="overflow-hidden"
      >
        <p className="pb-4 text-gray-600 dark:text-gray-300">{answer}</p>
      </motion.div>
    </div>
  );
};

export { TestimonialCard, EventCard, NewsCard, FAQItem };
