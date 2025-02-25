import React, { memo } from "react";
import { motion } from "framer-motion";
import {
  BadgeDollarSign,
  Music,
  Radio,
  Theater,
  ChevronRight,
  Zap,
} from "lucide-react";

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
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  },
};

// Optimized CategoryCard component
const CategoryCard = memo(({ icon: Icon, name, count, index }) => {
  // Generate a gradient based on index for variety
  const gradients = [
    "from-orange-500 to-pink-500",
    "from-blue-500 to-teal-400",
    "from-purple-500 to-indigo-500",
    "from-green-500 to-teal-400",
  ];

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -8, transition: { type: "spring", stiffness: 400 } }}
      className="relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 p-8 
        hover:shadow-xl transition-all duration-500 group"
    >
      {/* Top gradient bar */}
      <div
        className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${
          gradients[index % gradients.length]
        }`}
      />

      {/* Background pattern (subtle) */}
      <div className="absolute -right-16 -bottom-16 w-48 h-48 rounded-full bg-gray-100 dark:bg-gray-700/30 z-0" />

      {/* Icon with gradient background */}
      <div
        className={`relative z-10 flex items-center justify-center w-14 h-14 rounded-xl 
        bg-gradient-to-br ${gradients[index % gradients.length]} bg-opacity-10 
        text-white mb-6 transform group-hover:-translate-y-1 transition-transform duration-300`}
      >
        <Icon size={26} className="drop-shadow-md" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {name}
        </h3>
        <p className="text-gray-500 dark:text-gray-300 mb-6">{count}</p>

        {/* Call to action */}
        <div className="flex items-center text-sm font-medium">
          <span
            className={`text-transparent bg-clip-text bg-gradient-to-r ${
              gradients[index % gradients.length]
            }`}
          >
            Explore {name}
          </span>
          <motion.div
            initial={{ x: 0 }}
            whileHover={{ x: 3 }}
            className="ml-1.5"
          >
            <ChevronRight
              className={`w-4 h-4 text-transparent bg-clip-text bg-gradient-to-r ${
                gradients[index % gradients.length]
              }`}
            />
          </motion.div>
        </div>
      </div>

      {/* Popular badge for first category */}
      {index === 0 && (
        <div
          className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
          bg-gradient-to-r from-amber-500 to-amber-600 text-white"
        >
          <Zap className="w-3 h-3 fill-white" />
          <span>Popular</span>
        </div>
      )}
    </motion.div>
  );
});

// Main component
const CategoriesSection = () => {
  const categories = [
    { icon: Music, name: "Concerts", count: "1.2k+ Events" },
    { icon: Theater, name: "Theater", count: "850+ Shows" },
    { icon: BadgeDollarSign, name: "Sports", count: "945+ Matches" },
    { icon: Radio, name: "Festivals", count: "670+ Events" },
  ];

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-800/50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-orange-500/5 rounded-full -translate-y-1/2 -translate-x-1/2 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full translate-y-1/2 translate-x-1/4 blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <motion.div
            variants={itemVariants}
            className="inline-block px-4 py-1.5 bg-orange-100 dark:bg-orange-900/30 
              text-orange-600 dark:text-orange-400 rounded-full text-sm font-medium mb-4"
          >
            CATEGORIES
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-4xl font-bold mb-4 text-gray-900 dark:text-white"
          >
            Discover by Category
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            Find the perfect entertainment for every taste and occasion
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {categories.map((category, index) => (
            <CategoryCard key={category.name} {...category} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CategoriesSection;
