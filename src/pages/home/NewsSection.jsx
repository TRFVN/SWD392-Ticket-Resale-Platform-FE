import React, { memo } from "react";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, ArrowUpRight, Clock, User } from "lucide-react";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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

// Optimized NewsCard component with memo for performance
const NewsCard = memo(
  ({ title, date, excerpt, image, category, readTime, author, index }) => (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -8 }}
      className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
    >
      {/* Image container with overlay */}
      <div className="aspect-[16/9] relative overflow-hidden">
        {/* Category tag */}
        {category && (
          <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-orange-500 text-white text-xs font-medium rounded-full">
            {category}
          </div>
        )}

        {/* Read more hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1, opacity: 1 }}
            className="w-12 h-12 rounded-full bg-white flex items-center justify-center"
          >
            <ArrowUpRight className="w-5 h-5 text-orange-500" />
          </motion.div>
        </div>

        {/* Image */}
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Date and metadata */}
        <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400 mb-3 text-sm">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-orange-500" />
            <span>{date}</span>
          </div>

          {readTime && (
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-orange-500" />
              <span>{readTime} min read</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-orange-500 transition-colors">
          {title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {excerpt}
        </p>

        {/* Footer with author and read more */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
          {author && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex-shrink-0">
                {author.avatar ? (
                  <img
                    src={author.avatar}
                    alt={author.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4 m-1.5 text-gray-500 dark:text-gray-400" />
                )}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {author.name}
              </span>
            </div>
          )}

          <motion.button
            whileHover={{ x: 3 }}
            className="text-orange-500 hover:text-orange-600 font-medium flex items-center gap-1 text-sm transition-colors"
          >
            Read More <ArrowRight className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  ),
);

// Main component
const NewsSection = () => {
  // Enhanced news items with additional metadata
  const newsItems = [
    {
      title: "Top Summer Music Festivals 2024",
      date: "Dec 1, 2023",
      excerpt:
        "Get ready for an incredible lineup of music festivals coming your way. From Coachella to Glastonbury, we cover the must-attend events of the season.",
      image: "/api/placeholder/400/300",
      category: "Music",
      readTime: 4,
      author: {
        name: "Emma Wilson",
        avatar: null,
      },
    },
    {
      title: "New Venue Opening in Downtown",
      date: "Nov 28, 2023",
      excerpt:
        "A state-of-the-art entertainment venue is opening its doors next month. The 5,000-seat arena will host concerts, sporting events, and more.",
      image: "/api/placeholder/400/300",
      category: "Venues",
      readTime: 3,
      author: {
        name: "Michael Chen",
        avatar: null,
      },
    },
    {
      title: "Artist Spotlight: World Tour 2024",
      date: "Nov 25, 2023",
      excerpt:
        "Leading artists announce their biggest world tours for the upcoming year. Find out who's coming to your city and when tickets go on sale.",
      image: "/api/placeholder/400/300",
      category: "Tours",
      readTime: 5,
      author: {
        name: "Sophia Rodriguez",
        avatar: null,
      },
    },
  ];

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900/30">
      <div className="container mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Section header */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-12">
            <motion.div variants={itemVariants}>
              <div
                className="inline-block px-4 py-1.5 bg-orange-100 dark:bg-orange-900/30 
                text-orange-600 dark:text-orange-400 rounded-full text-sm font-medium mb-4"
              >
                LATEST UPDATES
              </div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Latest News & Updates
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
                Stay informed about the latest trends, announcements, and
                stories from the entertainment world
              </p>
            </motion.div>

            <motion.button
              variants={itemVariants}
              whileHover={{ x: 5 }}
              className="flex items-center gap-2 text-orange-500 hover:text-orange-600 font-semibold group"
            >
              View All Articles
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>

          {/* News cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsItems.map((news, index) => (
              <NewsCard key={`news-${index}`} {...news} index={index} />
            ))}
          </div>

          {/* Newsletter teaser */}
          <motion.div
            variants={itemVariants}
            className="mt-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-8 text-white"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">Want more updates?</h3>
                <p className="text-white/90">
                  Subscribe to our newsletter for weekly news roundups
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-white text-orange-600 rounded-lg font-medium hover:bg-orange-50 transition-colors"
              >
                Subscribe Now
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsSection;
