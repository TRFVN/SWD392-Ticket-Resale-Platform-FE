import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Plus, ChevronDown } from "lucide-react";
import Banner from "../../assets/banner.jpg";
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

// Stat component defined as a function
function Stat({ value, label, delay }) {
  return (
    <motion.div
      variants={itemVariants}
      custom={delay}
      className="text-white relative"
    >
      <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
        {value}
      </div>
      <div className="text-sm text-gray-300">{label}</div>
      <motion.div
        className="absolute -left-3 top-1/2 w-1 h-12 -translate-y-1/2 rounded-full bg-orange-500/50"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: 1.2 + delay * 0.1, duration: 0.5 }}
      />
    </motion.div>
  );
}

// Hero badge component defined as a function
function HeroBadge() {
  return (
    <motion.div
      variants={itemVariants}
      className="inline-block relative overflow-hidden"
    >
      <span
        className="inline-block px-5 py-2 bg-gradient-to-r from-orange-500/20 to-orange-600/10 
        backdrop-blur-sm border border-orange-500/20
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
}

// Main HeroSection component defined as a function (not using memo to simplify)
function HeroSection() {
  const stats = [
    { value: "1M+", label: "Active Users", delay: 0 },
    { value: "10K+", label: "Events Hosted", delay: 1 },
    { value: "100+", label: "Cities Worldwide", delay: 2 },
  ];

  return (
    <section className="relative min-h-[90vh] h-screen max-h-[1000px] rounded-3xl overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80 z-10" />

        {/* Background image */}
        <motion.div
          initial={{ scale: 1.05, opacity: 0.8 }}
          animate={{ scale: 1.15, opacity: 1 }}
          transition={{
            scale: {
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            },
            opacity: {
              duration: 2,
            },
          }}
          className="w-full h-full"
        >
          <img
            src={Banner}
            alt=""
            className="w-full h-full object-cover"
            role="presentation"
          />
        </motion.div>
      </div>

      {/* Content container */}
      <div className="relative container mx-auto px-6 h-full flex items-center z-20">
        <motion.div
          className="max-w-3xl space-y-8 py-20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <HeroBadge />

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
          >
            Where Moments <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-500">
              Become Memories
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-300 max-w-2xl"
          >
            Find and book tickets for extraordinary events. Join experiences
            that last a lifetime with our innovative platform designed for event
            lovers.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
            <motion.button
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700
                text-white rounded-lg shadow-lg shadow-orange-500/20
                font-medium transition-all duration-300 flex items-center gap-2 group
                focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:ring-offset-2 focus:ring-offset-black/20"
              aria-label="Browse available events"
            >
              Browse Events
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <motion.button
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20
                text-white rounded-lg shadow-lg shadow-black/5
                font-medium transition-all duration-300 flex items-center gap-2 group
                backdrop-blur-sm
                focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-black/20"
              aria-label="Create and host your own event"
            >
              Host Event
              <Plus className="w-4 h-4 transform group-hover:rotate-90 transition-transform" />
            </motion.button>
          </motion.div>

          <motion.div variants={itemVariants} className="flex gap-10 pt-8">
            {stats.map((stat, index) => (
              <Stat key={index} {...stat} />
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 cursor-pointer"
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
          <span className="text-white/70 text-sm mb-2">Scroll Down</span>
          <ChevronDown className="w-6 h-6 text-orange-500" />
        </motion.div>
      </motion.div>

      {/* Diagonal separator */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-br from-gray-900 to-black z-20" />
    </section>
  );
}

export default HeroSection;
