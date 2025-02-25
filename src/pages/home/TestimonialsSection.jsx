import React, { memo, useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Quote,
  Star,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
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
      className="inline-block px-4 py-1.5 bg-orange-100 dark:bg-orange-900/30 
        text-orange-600 dark:text-orange-400 rounded-full text-sm font-medium mb-4"
    >
      TESTIMONIALS
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

// Star Rating component
const StarRating = memo(({ rating }) => {
  return (
    <div className="flex items-center mb-3">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300 dark:text-gray-600"
          }`}
        />
      ))}
    </div>
  );
});

// Enhanced Testimonial Card
const TestimonialCard = memo(
  ({ name, role, image, comment, rating, eventName, date }) => (
    <motion.div
      variants={itemVariants}
      className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md hover:shadow-xl 
      transition-shadow duration-300 relative z-10 h-full flex flex-col"
    >
      <Quote className="absolute top-6 right-6 text-orange-500/20 w-16 h-16" />

      {/* Rating */}
      {rating && <StarRating rating={rating} />}

      {/* Comment */}
      <p className="text-gray-600 dark:text-gray-300 italic mb-6 flex-grow relative z-10">
        "{comment}"
      </p>

      {/* Event reference */}
      {eventName && (
        <div className="mb-6 pt-4 border-t border-gray-100 dark:border-gray-700">
          <span className="text-sm text-orange-500">Event attended:</span>
          <div className="font-medium text-gray-800 dark:text-gray-200">
            {eventName}
          </div>
          {date && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {date}
            </div>
          )}
        </div>
      )}

      {/* User info */}
      <div className="flex items-center gap-4 z-10">
        <div className="w-12 h-12 rounded-full overflow-hidden shadow-md border-2 border-white dark:border-gray-700">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{role}</p>
        </div>
      </div>
    </motion.div>
  ),
);

// Testimonial Slider for mobile
const TestimonialSlider = memo(({ testimonials }) => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrent(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  }, [testimonials.length]);

  // Auto slide
  const autoSlideRef = useRef(null);

  useEffect(() => {
    autoSlideRef.current = setTimeout(() => {
      handleNext();
    }, 5000);

    return () => {
      if (autoSlideRef.current) {
        clearTimeout(autoSlideRef.current);
      }
    };
  }, [current, handleNext]);

  return (
    <div className="relative">
      <div className="overflow-hidden relative h-[320px]">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute w-full"
          >
            <TestimonialCard {...testimonials[current]} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation controls */}
      <div className="flex justify-center gap-4 mt-6">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handlePrev}
          className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-md 
            flex items-center justify-center text-gray-600 dark:text-gray-300
            hover:bg-orange-50 dark:hover:bg-gray-700 transition-colors"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleNext}
          className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-md 
            flex items-center justify-center text-gray-600 dark:text-gray-300
            hover:bg-orange-50 dark:hover:bg-gray-700 transition-colors"
          aria-label="Next testimonial"
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Pagination indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {testimonials.map((_, index) => (
          <button
            key={`dot-${index}`}
            onClick={() => {
              setDirection(index > current ? 1 : -1);
              setCurrent(index);
            }}
            className={`w-2 h-2 rounded-full ${
              index === current
                ? "bg-orange-500 w-6"
                : "bg-gray-300 dark:bg-gray-600"
            } transition-all`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
});

// Main component
const TestimonialsSection = () => {
  // Enhanced testimonials data with ratings and event info
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Music Enthusiast",
      image: "/api/placeholder/100/100",
      comment:
        "The best ticketing platform I've ever used! Super easy to navigate and find great events. The mobile app is incredibly intuitive and I love the notification feature for price drops.",
      rating: 5,
      eventName: "Summer Music Festival 2023",
      date: "August 15, 2023",
    },
    {
      name: "Mike Thompson",
      role: "Sports Fan",
      image: "/api/placeholder/100/100",
      comment:
        "Seamless booking experience and great customer service. Highly recommended! I've been using this platform for over a year now and haven't had a single issue with tickets.",
      rating: 4,
      eventName: "NBA Finals Game 6",
      date: "June 10, 2023",
    },
    {
      name: "Emily Chen",
      role: "Theater Lover",
      image: "/api/placeholder/100/100",
      comment:
        "Love the variety of events and the easy ticket transfer feature. My go-to platform! The seating preview feature is a game-changer when booking theater tickets.",
      rating: 5,
      eventName: "Hamilton Broadway Show",
      date: "September 22, 2023",
    },
    {
      name: "James Wilson",
      role: "Concert Goer",
      image: "/api/placeholder/100/100",
      comment:
        "I appreciate how transparent the pricing is - no surprise fees at checkout like other platforms. The user interface is clean and makes finding the right events so simple.",
      rating: 4,
      eventName: "Rock Festival 2023",
      date: "July 8, 2023",
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-orange-50 dark:bg-orange-950/5 rounded-bl-full -z-10" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-gray-100/80 dark:bg-gray-800/20 -z-10" />

      <div className="container mx-auto px-6">
        {/* Section title */}
        <SectionTitle
          title="What Our Customers Say"
          subtitle="Real feedback from event-goers who've used our platform"
        />

        {/* Testimonial count banner */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex justify-center mb-12"
        >
          <div
            className="px-6 py-3 bg-orange-50 dark:bg-orange-900/10 rounded-full
            flex items-center gap-2 text-orange-600 dark:text-orange-400"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="font-medium">
              From our {testimonials.length}+ verified customer reviews
            </span>
          </div>
        </motion.div>

        {/* Desktop view: Grid layout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={`testimonial-${index}`} {...testimonial} />
          ))}
        </motion.div>

        {/* Mobile view: Carousel/Slider */}
        <div className="md:hidden">
          <TestimonialSlider testimonials={testimonials} />
        </div>

        {/* Call to action */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Join thousands of satisfied customers and find your next event
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white 
              rounded-lg font-medium transition-colors shadow-md"
          >
            Browse Events
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
