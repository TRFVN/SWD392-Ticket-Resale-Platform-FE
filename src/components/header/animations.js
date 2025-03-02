// Comprehensive animations file with optimized performance
// Includes all animation variants for the entire application

// ====== SHARED TRANSITION CONFIGURATIONS ======
// Base transitions for consistency across the application

export const springTransition = {
  type: "spring",
  stiffness: 350, // Slightly increased for more responsive feel
  damping: 25, // Slightly reduced for more natural bouncing
  mass: 0.5, // Lighter mass for quicker response
};

export const easeTransition = {
  type: "tween",
  ease: [0.25, 0.1, 0.25, 1], // Optimized cubic-bezier curve for smoother motion
  duration: 0.3,
};

export const staggerConfig = {
  staggerChildren: 0.04,
  delayChildren: 0.01,
};

// ====== HEADER ANIMATIONS ======
// For main site header including compact mode

// Header animation - optimized for 60fps rendering
export const headerVariants = {
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      ...springTransition,
      stiffness: 280, // Softer for header to feel more stable
      restDelta: 0.001, // Controls when spring is considered "at rest"
    },
  },
  hidden: {
    y: -80,
    opacity: 0,
    transition: {
      ...springTransition,
      duration: 0.25, // Slightly faster for hiding
      damping: 30,
    },
  },
};

// Logo animations for compact mode
export const logoVariants = {
  normal: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: easeTransition,
  },
  compact: {
    opacity: 0,
    x: -20,
    scale: 0.8,
    transition: {
      ...easeTransition,
      duration: 0.25, // Slightly faster for better UX
    },
  },
};

// Navigation animations for compact mode
export const navVariants = {
  normal: {
    scale: 1,
    transition: easeTransition,
  },
  compact: {
    scale: 0.95, // Slightly smaller in compact mode
    transition: easeTransition,
  },
};

// Actions (buttons) animations for compact mode
export const actionsVariants = {
  normal: {
    opacity: 1,
    x: 0,
    scale: 1,
    pointerEvents: "auto",
    transition: easeTransition,
  },
  compact: {
    opacity: 0,
    x: 20,
    scale: 0.8,
    pointerEvents: "none",
    transition: easeTransition,
  },
};

// Header container animations for compact mode
export const containerVariants = {
  normal: {
    padding: "0.75rem 1.5rem",
    transition: easeTransition,
  },
  compact: {
    padding: "0.375rem 1.5rem",
    transition: easeTransition,
  },
};

// Scroll progress indicator for advanced UX
export const scrollProgressVariants = {
  hidden: {
    scaleX: 0,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
  visible: (progress) => ({
    scaleX: progress,
    transition: {
      duration: 0.1,
      ease: "linear",
    },
  }),
};

// ====== MENU ANIMATIONS ======
// For user menus, dropdowns, and mobile navigation

// User menu optimized for performance with will-change hints
export const userMenuVariants = {
  closed: {
    opacity: 0,
    scale: 0.95,
    y: -5,
    transition: easeTransition,
    transitionEnd: { display: "none" }, // Memory optimization
  },
  open: {
    opacity: 1,
    scale: 1,
    y: 0,
    display: "block",
    transition: {
      ...easeTransition,
      duration: 0.25, // Slightly faster for more responsive feel
      ...staggerConfig,
    },
  },
};

// Menu item transitions optimized for smoothness
export const itemVariants = {
  closed: {
    opacity: 0,
    y: -5,
    transition: { duration: 0.15 }, // Quick fade out
  },
  open: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
};

// Mobile menu with hardware acceleration optimization
export const mobileMenuVariants = {
  closed: {
    x: "100%",
    transition: {
      type: "tween",
      duration: 0.25,
      ease: [0.4, 0.0, 0.2, 1],
    },
    transitionEnd: { display: "none" }, // Memory optimization
  },
  open: {
    x: 0,
    display: "flex",
    transition: {
      type: "tween",
      duration: 0.35,
      ease: [0.0, 0.0, 0.2, 1],
      ...staggerConfig,
      stiffness: 300,
      restDelta: 0.005,
    },
  },
};

// Backdrop with minimal properties for better performance
export const backdropVariants = {
  closed: {
    opacity: 0,
    transition: { duration: 0.2 },
    transitionEnd: { display: "none" },
  },
  open: {
    opacity: 1,
    display: "block",
    transition: {
      duration: 0.25,
    },
  },
};

// ====== FORM AND SEARCH ANIMATIONS ======
// For input fields, search, and form components

// Search field expansion with optimized width transition
export const searchVariants = {
  closed: {
    width: "40px",
    borderColor: "rgba(229, 231, 235, 0.5)",
    transition: {
      duration: 0.25,
      ease: [0.4, 0.0, 0.2, 1],
    },
  },
  open: {
    width: "250px",
    borderColor: "rgba(249, 115, 22, 0.5)",
    transition: {
      duration: 0.3,
      ease: [0.0, 0.0, 0.2, 1],
    },
  },
};

// ====== INTERACTION ANIMATIONS ======
// For hover, click, and interaction effects

// Hover animations optimization with reduced properties
export const hoverVariants = {
  rest: {
    scale: 1,
    transition: {
      duration: 0.15,
      ease: "easeOut",
    },
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1,
      ease: "easeIn",
    },
  },
};

// ====== UI ELEMENT ANIMATIONS ======
// For notifications, dropdowns and other UI components

// Optimized dropdown animation (for any dropdown menus)
export const dropdownVariants = {
  hidden: {
    opacity: 0,
    y: -5,
    clipPath: "inset(0% 0% 100% 0%)",
    transition: {
      type: "tween",
      duration: 0.2,
      ease: [0.4, 0.0, 0.2, 1],
    },
    transitionEnd: { display: "none" },
  },
  visible: {
    opacity: 1,
    y: 0,
    clipPath: "inset(0% 0% 0% 0%)",
    display: "block",
    transition: {
      type: "tween",
      duration: 0.25,
      ease: [0.0, 0.0, 0.2, 1],
      ...staggerConfig,
    },
  },
};

// Toast/notification animation for better UX
export const toastVariants = {
  hidden: {
    opacity: 0,
    y: 10,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

// ====== UTILITY FUNCTIONS ======
// Helper functions for animations

// Get the current header state for animation
export const getHeaderState = (isCompactMode) =>
  isCompactMode ? "compact" : "normal";

// Calculate progress for scroll indicators
export const calculateScrollProgress = () => {
  const scrollTop = window.scrollY;
  const scrollHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  return scrollHeight > 0 ? scrollTop / scrollHeight : 0;
};

// Optimize animation based on device performance
export const getOptimizedTransition = (isLowPowerMode = false) => {
  if (isLowPowerMode) {
    return {
      type: "tween",
      duration: 0.2,
      ease: "easeOut",
    };
  }
  return springTransition;
};
