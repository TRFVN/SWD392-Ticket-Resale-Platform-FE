import React from "react";
import { motion } from "framer-motion";
import { BadgeDollarSign, Music, Radio, Theater } from "lucide-react";

const CategoryCard = ({ icon: Icon, name, count }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-700 p-6 hover:shadow-lg transition-all duration-300"
  >
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-orange-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
    <div className="text-orange-500 mb-4 transform group-hover:-translate-y-1 transition-transform duration-300">
      <Icon size={32} />
    </div>
    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
      {name}
    </h3>
    <p className="text-gray-500 dark:text-gray-300">{count}</p>
  </motion.div>
);

const CategoriesSection = () => {
  const categories = [
    { icon: Music, name: "Concerts", count: "1.2k+ Events" },
    { icon: Theater, name: "Theater", count: "850+ Shows" },
    { icon: BadgeDollarSign, name: "Sports", count: "945+ Matches" },
    { icon: Radio, name: "Festivals", count: "670+ Events" },
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Discover by Category</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Find the perfect entertainment for every taste
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.name} {...category} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
