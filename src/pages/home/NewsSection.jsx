import React from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

const NewsCard = ({ title, date, excerpt, image }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg"
  >
    <div className="aspect-[16/9]">
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
    </div>
    <div className="p-6">
      <div className="flex items-center gap-2 text-orange-500 mb-3">
        <Calendar className="w-4 h-4" />
        <span className="text-sm">{date}</span>
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4">{excerpt}</p>
      <button className="text-orange-500 hover:text-orange-600 font-medium">
        Read More →
      </button>
    </div>
  </motion.div>
);

const NewsSection = () => {
  const newsItems = [
    {
      title: "Top Summer Music Festivals 2024",
      date: "Dec 1, 2023",
      excerpt:
        "Get ready for an incredible lineup of music festivals coming your way...",
      image: "/api/placeholder/400/300",
    },
    {
      title: "New Venue Opening in Downtown",
      date: "Nov 28, 2023",
      excerpt:
        "A state-of-the-art entertainment venue is opening its doors next month...",
      image: "/api/placeholder/400/300",
    },
    {
      title: "Artist Spotlight: World Tour 2024",
      date: "Nov 25, 2023",
      excerpt:
        "Leading artists announce their biggest world tours for the upcoming year...",
      image: "/api/placeholder/400/300",
    },
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Latest News & Updates
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Stay informed about the entertainment world
            </p>
          </div>
          <button className="text-orange-500 hover:text-orange-600 font-semibold">
            View All Articles →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {newsItems.map((news) => (
            <NewsCard key={news.title} {...news} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
