import React, { memo } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Plus, ChevronDown } from "lucide-react";

// Animation variants for coordinated animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 500,
    },
  },
};

const buttonVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

// Optimized Stat component with detailed styling
const Stat = memo(({ value, label, delay }) => {
  return (
    <motion.div
      variants={itemVariants}
      custom={delay}
      className="text-white relative"
    >
      <div className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
        {value}
      </div>
      <div className="text-sm md:text-base text-gray-300 mt-1 font-medium">
        {label}
      </div>
      <motion.div
        className="absolute -left-3 top-1/2 w-1 h-12 -translate-y-1/2 rounded-full bg-gradient-to-b from-orange-400 to-orange-600"
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{ delay: 1.2 + delay * 0.1, duration: 0.5 }}
      />
    </motion.div>
  );
});

// Enhanced Hero badge component
const HeroBadge = memo(() => {
  return (
    <motion.div
      variants={itemVariants}
      className="inline-block relative overflow-hidden"
    >
      <span
        className="inline-block px-5 py-2.5 bg-gradient-to-r from-orange-500/20 to-orange-600/10 
        backdrop-blur-sm border border-orange-500/30
        text-orange-400 rounded-full text-sm font-medium"
      >
        Smart Ticketing Platform
      </span>
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: "-100%" }}
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: "linear",
          repeatType: "loop",
        }}
        className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-20"
      />
    </motion.div>
  );
});

// Optimized and enhanced HeroSection component
const HeroSection = () => {
  const stats = [
    { value: "1M+", label: "Active Users", delay: 0 },
    { value: "10K+", label: "Events Hosted", delay: 1 },
    { value: "100+", label: "Cities Worldwide", delay: 2 },
  ];

  return (
    <section className="relative min-h-[90vh] h-screen max-h-[1000px] rounded-3xl overflow-hidden">
      {/* Background image with improved overlay */}
      <div className="absolute inset-0">
        {/* Enhanced gradient overlay with more depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90 z-10" />

        {/* Subtle noise texture for depth */}
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] z-10 mix-blend-overlay" />

        {/* Background image with smoother animation */}
        <motion.div
          initial={{ scale: 1.05, opacity: 0.8 }}
          animate={{ scale: 1.12, opacity: 1 }}
          transition={{
            scale: {
              duration: 25,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            },
            opacity: {
              duration: 2.5,
            },
          }}
          className="w-full h-full"
        >
          <img
            src="https://images.alphacoders.com/117/1178907.jpg"
            alt=""
            className="w-full h-full object-cover"
            role="presentation"
          />
        </motion.div>
      </div>

      {/* Content container with improved spacing */}
      <div className="relative container mx-auto px-6 md:px-8 h-full flex items-center z-20">
        <motion.div
          className="max-w-3xl space-y-8 md:space-y-10 py-20 md:py-24"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <HeroBadge />

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight"
          >
            Where Moments <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
              Become Memories
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-300 max-w-2xl font-light leading-relaxed"
          >
            Find and book tickets for extraordinary events. Join experiences
            that last a lifetime with our innovative platform designed for event
            lovers.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-4 pt-2"
          >
            <motion.button
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              className="px-7 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700
                text-white rounded-xl shadow-lg shadow-orange-500/30
                font-medium transition-all duration-300 flex items-center gap-2.5 group
                focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:ring-offset-2 focus:ring-offset-black/20"
              aria-label="Browse available events"
            >
              <span className="text-base">Browse Events</span>
              <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <motion.button
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              className="px-7 py-4 bg-white/10 hover:bg-white/15 border border-white/20
                text-white rounded-xl shadow-lg shadow-black/5
                font-medium transition-all duration-300 flex items-center gap-2.5 group
                backdrop-blur-sm
                focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-black/20"
              aria-label="Create and host your own event"
            >
              <span className="text-base">Host Event</span>
              <Plus className="w-5 h-5 transform group-hover:rotate-90 transition-transform" />
            </motion.button>
          </motion.div>

          {/* Enhanced stats section with better spacing */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-12 md:gap-16 pt-8 md:pt-12"
          >
            {stats.map((stat, index) => (
              <Stat key={index} {...stat} />
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Enhanced scroll indicator */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 cursor-pointer"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.5 }}
        whileHover={{ y: 5 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "loop",
          }}
          className="flex flex-col items-center"
        >
          <span className="text-white/80 text-sm mb-2 font-medium tracking-wide">
            Scroll Down
          </span>
          <div className="bg-white/10 backdrop-blur-sm p-2 rounded-full border border-white/10">
            <ChevronDown className="w-6 h-6 text-orange-500" />
          </div>
        </motion.div>
      </motion.div>

      {/* Improved diagonal separator with gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-900 via-gray-900/95 to-transparent z-20" />

      {/* Side decorative elements */}
      <div className="absolute top-1/4 right-12 w-24 h-24 rounded-full bg-orange-500/10 blur-3xl z-10"></div>
      <div className="absolute bottom-1/3 left-12 w-32 h-32 rounded-full bg-orange-600/10 blur-3xl z-10"></div>
    </section>
  );
};

export default memo(HeroSection);
