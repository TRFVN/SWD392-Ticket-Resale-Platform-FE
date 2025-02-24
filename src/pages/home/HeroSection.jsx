import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Plus } from "lucide-react";

const HeroSection = () => {
  const stats = [
    { value: "1M+", label: "Users" },
    { value: "10K+", label: "Events" },
    { value: "100+", label: "Cities" },
  ];

  return (
    <section className="relative h-[80vh] overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1.05 }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          src="/api/placeholder/1920/1080"
          alt="Event crowd"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative container mx-auto px-6 h-full flex items-center z-20">
        <div className="max-w-2xl space-y-8">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="inline-block px-4 py-1.5 bg-orange-500/10 
            text-orange-400 rounded-full text-sm font-medium"
          >
            Smart Ticketing Platform
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold text-white leading-tight"
          >
            Where Moments <br />
            <span className="text-orange-400">Become Memories</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl text-gray-300 max-w-xl"
          >
            Find and book tickets for extraordinary events. Join experiences
            that last a lifetime.
          </motion.p>

          <div className="flex flex-wrap gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg 
              font-medium transition-colors flex items-center gap-2 group"
            >
              Browse Events
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-white/10 text-white rounded-lg 
              font-medium transition-colors flex items-center gap-2"
            >
              Host Event
              <Plus className="w-4 h-4" />
            </motion.button>
          </div>

          <div className="flex gap-8 pt-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="text-white"
              >
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
