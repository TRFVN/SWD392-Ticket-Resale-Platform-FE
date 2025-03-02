import React, { memo, lazy, Suspense, useState, useEffect } from "react";
import { useHeaderScroll } from "../../hooks/useHeaderScroll";
import HeaderLogo from "../header/header/HeaderLogo";
import DesktopNav from "../header/header/DesktopNav";
import SearchBar from "../header/header/SearchBar";
import ThemeToggle from "../header/header/ThemeToggle";
import UserMenu from "../header/UserMenu";
import MobileMenuButton from "../header/MobileMenu/MobileMenuButton";
import { AnimatePresence, motion } from "framer-motion";
import {
  actionsVariants,
  getHeaderState,
  headerVariants,
  logoVariants,
  navVariants,
} from "../header/animations";
// Import optimized animation variants
// Lazy load mobile navigation to improve initial load performance
const MobileNav = lazy(() => import("../header/MobileMenu"));

/**
 * Modern Header Component - With compact scrolling mode
 *
 * Features:
 * - Normal mode: Shows complete header with logo, nav, and actions
 * - Compact mode: Only shows navigation when scrolled down
 */ const Header = () => {
  const {
    headerRef,
    spacerRef,
    isHeaderVisible,
    isScrolled,
    isMenuOpen,
    isCompactMode,
    toggleMenu,
    closeMenu,
  } = useHeaderScroll();

  // State to track window size and force mobile mode if needed
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200,
  );
  const [forceMobileMode, setForceMobileMode] = useState(false);

  // Responsive breakpoints
  const MOBILE_BREAKPOINT = 768; // Standard mobile breakpoint
  const TABLET_BREAKPOINT = 1024; // Tablet breakpoint
  const COMPACT_BREAKPOINT = 1140; // When to start hiding elements on medium screens

  // Get current header state for animations
  const headerState = getHeaderState(isCompactMode);

  // Compute header background class
  const headerBgClass = isScrolled
    ? "bg-light-primary/90 dark:bg-dark-primary/95 backdrop-blur-md shadow-sm border-b border-gray-200/50 dark:border-gray-800/50"
    : "bg-light-primary dark:bg-dark-primary";

  // Monitor window resize for responsive behavior
  useEffect(() => {
    // Handler to update window width
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);

      // Force mobile menu when width gets too small to prevent overlap
      setForceMobileMode(width < TABLET_BREAKPOINT);

      // Auto-close mobile menu when resizing larger
      if (width >= TABLET_BREAKPOINT && isMenuOpen) {
        closeMenu();
      }
    };

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Initial check
    handleResize();

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, [isMenuOpen, closeMenu]);

  // Determine if we should show mobile nav based on window width or forced state
  const showMobileNav = windowWidth < MOBILE_BREAKPOINT || forceMobileMode;

  // Determine if we should hide certain elements based on window width
  const hideSecondaryElements =
    windowWidth < COMPACT_BREAKPOINT && windowWidth >= MOBILE_BREAKPOINT;

  return (
    <>
      {/* Skip link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-20 focus:left-4 z-50 
        bg-white dark:bg-gray-800 px-4 py-2 text-primary dark:text-primary-light rounded-md"
      >
        Đi đến nội dung chính
      </a>

      {/* Main Header */}
      <motion.header
        ref={headerRef}
        className={`fixed top-0 left-0 w-full z-50 ${headerBgClass} will-change-transform`}
        initial="hidden"
        animate={isHeaderVisible ? "visible" : "hidden"}
        variants={headerVariants}
      >
        <div className="max-w-screen-xl mx-auto">
          <div
            className={`px-3 py-2 sm:px-4 lg:px-6 transition-all duration-300 ${
              isCompactMode ? "py-1.5" : "py-2"
            }`}
          >
            <div className="flex items-center justify-between gap-1 md:gap-3">
              {/* Left: Logo - Hidden in compact mode but always visible on mobile */}
              <motion.div
                className="flex-shrink-0"
                initial="normal"
                animate={
                  !showMobileNav && headerState === "compact"
                    ? "compact"
                    : "normal"
                }
                variants={logoVariants}
              >
                <HeaderLogo condensed={hideSecondaryElements} />
              </motion.div>

              {/* Center: Navigation - Desktop Only */}
              {!showMobileNav && (
                <motion.div
                  className="relative z-10 flex-grow flex justify-center overflow-hidden"
                  initial="normal"
                  animate={headerState}
                  variants={navVariants}
                >
                  <DesktopNav hideSecondary={hideSecondaryElements} />
                </motion.div>
              )}

              {/* Right: Actions */}
              <div className="flex items-center gap-1 sm:gap-2 md:gap-3 flex-shrink-0">
                {/* Mobile Menu Button - Only on small screens */}
                {showMobileNav && (
                  <div className="order-last">
                    <MobileMenuButton
                      isOpen={isMenuOpen}
                      onClick={toggleMenu}
                    />
                  </div>
                )}

                {/* Search Bar */}
                <motion.div
                  className="relative z-30"
                  initial="normal"
                  animate={
                    !showMobileNav && headerState === "compact"
                      ? "compact"
                      : "normal"
                  }
                  variants={actionsVariants}
                >
                  <SearchBar mini={hideSecondaryElements || showMobileNav} />
                </motion.div>

                {/* Theme Toggle */}
                <motion.div
                  className="z-20"
                  initial="normal"
                  animate={
                    !showMobileNav && headerState === "compact"
                      ? "compact"
                      : "normal"
                  }
                  variants={actionsVariants}
                >
                  <ThemeToggle />
                </motion.div>

                {/* User Menu */}
                <motion.div
                  className="z-20"
                  initial="normal"
                  animate={
                    !showMobileNav && headerState === "compact"
                      ? "compact"
                      : "normal"
                  }
                  variants={actionsVariants}
                >
                  <UserMenu />
                </motion.div>
              </div>
            </div>
          </div>

          {/* Mobile Navigation with AnimatePresence for proper exit animations */}
          <Suspense fallback={null}>
            <AnimatePresence mode="wait">
              {isMenuOpen && showMobileNav && (
                <MobileNav isOpen={isMenuOpen} onItemClick={closeMenu} />
              )}
            </AnimatePresence>
          </Suspense>
        </div>
      </motion.header>

      {/* Spacer to prevent content from hiding under header */}
      <div
        ref={spacerRef}
        className="h-14 sm:h-16 md:h-18"
        id="main-content"
        aria-hidden="true"
      ></div>
    </>
  );
};

// Memoize for performance
export default memo(Header);
