import { useState, useRef, useEffect, useCallback } from "react";

/**
 * Custom hook to handle header scroll behavior with Framer Motion support
 * Optimized for performance with requestAnimationFrame and throttling
 */
export const useHeaderScroll = () => {
  // Refs
  const headerRef = useRef(null);
  const spacerRef = useRef(null);

  // States
  const [isScrolled, setIsScrolled] = useState(false);
  const [prevScrollY, setPrevScrollY] = useState(0);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCompactMode, setIsCompactMode] = useState(false);

  // Toggle mobile menu
  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  // Close mobile menu
  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  // Handle scroll with performance optimizations
  useEffect(() => {
    let lastScrollTime = 0;
    const scrollThreshold = 50; // Throttle time in ms
    const compactModeThreshold = 150; // Scroll position to trigger compact mode
    const visibilityThreshold = 10; // How many pixels to scroll before triggering hide

    const handleScroll = () => {
      const now = Date.now();
      if (now - lastScrollTime < scrollThreshold) return;
      lastScrollTime = now;

      // Use requestAnimationFrame for smoother updates
      requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;

        // Update scrolled state for visual effects
        setIsScrolled(currentScrollY > 5);

        // Compact mode logic - only show navigation bar when scrolled down
        setIsCompactMode(currentScrollY > compactModeThreshold);

        // Header visibility logic
        if (currentScrollY < 20) {
          // Always show at top of page
          setIsHeaderVisible(true);
        } else {
          // Hide when scrolling down, show when scrolling up
          if (prevScrollY > currentScrollY + 5) {
            // Scrolling up - show header
            setIsHeaderVisible(true);
          } else if (currentScrollY > prevScrollY + visibilityThreshold) {
            // Scrolling down - hide header and close menus
            setIsHeaderVisible(false);
            setIsMenuOpen(false);
          }
        }

        setPrevScrollY(currentScrollY);
      });
    };

    // Use passive event listener for better scroll performance
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollY]);

  // Handle window resize and initial setup
  useEffect(() => {
    const handleResize = () => {
      // Close mobile menu on desktop
      if (isMenuOpen && window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }

      // Update spacer height for proper content positioning
      if (spacerRef.current && headerRef.current) {
        spacerRef.current.style.height = `${headerRef.current.offsetHeight}px`;
      }
    };

    window.addEventListener("resize", handleResize, { passive: true });

    // Initial setup
    if (spacerRef.current && headerRef.current) {
      spacerRef.current.style.height = `${headerRef.current.offsetHeight}px`;
    }

    return () => window.removeEventListener("resize", handleResize);
  }, [isMenuOpen]);

  return {
    headerRef,
    spacerRef,
    isScrolled,
    isHeaderVisible,
    isMenuOpen,
    isCompactMode,
    toggleMenu,
    closeMenu,
  };
};
