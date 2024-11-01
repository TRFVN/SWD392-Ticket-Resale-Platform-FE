import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  ArrowLeft,
  Search,
  AlertCircle,
  RefreshCcw,
  Compass,
  MapPin,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  const [showRecommendations, setShowRecommendations] = useState(false);

  // Simulated recommendations - in real app, fetch from API
  const recommendations = [
    {
      id: 1,
      title: "Taylor Swift Era Tour",
      category: "Music",
      date: "Dec 24",
      location: "Ho Chi Minh City",
    },
    {
      id: 2,
      title: "Stand-up Comedy Night",
      category: "Comedy",
      date: "Dec 25",
      location: "Ha Noi",
    },
    {
      id: 3,
      title: "Soccer Championship",
      category: "Sports",
      date: "Dec 26",
      location: "Da Nang",
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowRecommendations(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  return (
    <div
      className="relative min-h-screen bg-white dark:bg-gray-900 
      text-gray-900 dark:text-white overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-full h-full">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0.3, 0, 0.3],
                scale: [1, 1.2, 1],
                x: Math.random() * 100 - 50,
                y: Math.random() * 100 - 50,
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
              className="absolute w-1 h-1 bg-orange-500/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -left-1/4 -top-1/4 w-1/2 h-1/2 
            bg-gradient-to-br from-orange-500/20 to-transparent 
            rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            rotate: -360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -right-1/4 -bottom-1/4 w-1/2 h-1/2 
            bg-gradient-to-tl from-orange-500/20 to-transparent 
            rounded-full blur-3xl"
        />
      </div>

      {/* Main Content */}
      <div
        className="relative flex flex-col items-center justify-center 
        min-h-screen max-w-7xl mx-auto px-4 py-20"
      >
        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="text-center"
        >
          {/* 404 Section */}
          <motion.div
            variants={itemVariants}
            className="relative w-64 h-64 mb-8 mx-auto"
          >
            <motion.div
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{
                scale: [1, 1.05, 1],
                rotate: [0, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <span
                className="text-[180px] font-bold bg-clip-text text-transparent
                bg-gradient-to-b from-gray-200 to-gray-100 dark:from-gray-800 dark:to-gray-900"
              >
                404
              </span>
            </motion.div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 10, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <AlertCircle className="w-32 h-32 text-orange-500 dark:text-orange-400" />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Text Content */}
          <motion.div variants={itemVariants} className="space-y-4 mb-12">
            <h1 className="text-5xl sm:text-6xl font-bold">
              <span
                className="bg-clip-text text-transparent bg-gradient-to-r 
                from-orange-600 to-orange-400"
              >
                Oops!
              </span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-gray-700 dark:text-gray-300">
              This page seems to have wandered off
            </p>
            <p className="text-base text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Don't worry! Let's find you something interesting instead.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/")}
              className="flex items-center justify-center px-6 py-3 rounded-xl
                bg-gradient-to-r from-orange-500 to-orange-600 text-white
                hover:from-orange-600 hover:to-orange-700
                transition-all duration-200 shadow-lg shadow-orange-500/20"
            >
              <Home className="w-5 h-5 mr-2" />
              Return Home
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className="flex items-center justify-center px-6 py-3 rounded-xl
                bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300
                hover:bg-gray-50 dark:hover:bg-gray-700
                transition-all duration-200 shadow-lg shadow-black/5 dark:shadow-black/20"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/search")}
              className="flex items-center justify-center px-6 py-3 rounded-xl
                border border-gray-200 dark:border-gray-700
                hover:bg-gray-50 dark:hover:bg-gray-800
                transition-all duration-200"
            >
              <Search className="w-5 h-5 mr-2" />
              Browse Events
            </motion.button>
          </motion.div>

          {/* Recommendations Section */}
          <AnimatePresence>
            {showRecommendations && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto"
              >
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
                  Popular Events You Might Like
                </h3>
                <div className="grid gap-4">
                  {recommendations.map((event) => (
                    <motion.div
                      key={event.id}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center p-4 rounded-xl
                        bg-gray-50 dark:bg-gray-800/50 
                        hover:bg-gray-100 dark:hover:bg-gray-800
                        transition-colors duration-200 cursor-pointer"
                      onClick={() => navigate(`/event/${event.id}`)}
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {event.title}
                        </h4>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                          <MapPin className="w-4 h-4 mr-1" />
                          {event.location}
                          <span className="mx-2">•</span>
                          {event.date}
                        </div>
                      </div>
                      <div className="ml-4">
                        <span
                          className="px-3 py-1 text-xs font-medium rounded-full
                          bg-orange-100 dark:bg-orange-500/20 
                          text-orange-600 dark:text-orange-400"
                        >
                          {event.category}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
