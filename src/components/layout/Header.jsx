"use client";

import React, {
  memo,
  lazy,
  Suspense,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useHeaderScroll } from "../../hooks/useHeaderScroll";
import HeaderLogo from "../header/header/HeaderLogo";
import DesktopNav from "../header/header/DesktopNav";
import ThemeToggle from "../header/header/ThemeToggle";
import UserMenu from "../header/UserMenu";
import CartButton from "../header/CartButton";
import MobileMenuButton from "../header/MobileMenu/MobileMenuButton";
import { AnimatePresence, motion } from "framer-motion";

// Import MobileNav directly as a failsafe in case lazy loading fails
import MobileNavDirect from "../header/MobileMenu";

// ErrorBoundary for gracefully handling lazy loading errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error loading component:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Fallback to direct import if lazy loading fails
      return this.props.fallback || null;
    }
    return this.props.children;
  }
}

// Lazy load mobile navigation with error boundary fallback
const MobileNav = lazy(() =>
  import("../header/MobileMenu").catch((err) => {
    console.error("Failed to lazy load MobileMenu:", err);
    // Return a module-like object that will use the direct import
    return { default: MobileNavDirect };
  }),
);

// Simplified breakpoints
const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
};

// Enhanced animation variants
const headerVariants = {
  hidden: { y: -100, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

/**
 * Modern Header Component with optimized UI
 */
const Header = () => {
  const {
    headerRef,
    spacerRef,
    isHeaderVisible,
    isScrolled,
    isMenuOpen,
    toggleMenu,
    closeMenu,
  } = useHeaderScroll();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Get user role from localStorage
    setUserRole(localStorage.getItem("userRole"));
  }, []);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200,
  );
  const [forceMobileMode, setForceMobileMode] = useState(false);

  const showMobileNav = windowWidth < BREAKPOINTS.MOBILE || forceMobileMode;

  // Clean header background styling
  const headerBgClass = isScrolled
    ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-sm"
    : "bg-white dark:bg-gray-900";

  // Optimized resize handler
  const handleResize = useCallback(() => {
    const width = window.innerWidth;
    setWindowWidth(width);
    setForceMobileMode(width < BREAKPOINTS.TABLET);

    if (width >= BREAKPOINTS.TABLET && isMenuOpen) {
      closeMenu();
    }
  }, [isMenuOpen, closeMenu]);

  useEffect(() => {
    let resizeTimer;
    const debouncedResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(handleResize, 100);
    };

    window.addEventListener("resize", debouncedResize);
    handleResize();

    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", debouncedResize);
    };
  }, [handleResize]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isMenuOpen) {
        closeMenu();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen, closeMenu]);

  return (
    <>
      {/* Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-20 focus:left-4 z-50 
        bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-white 
        rounded-md shadow-lg ring-2 ring-orange-500 focus:outline-none"
      >
        Đi đến nội dung chính
      </a>

      {/* Main Header */}
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 w-full z-50 ${headerBgClass} transition-all duration-300`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex-shrink-0">
                <HeaderLogo />
              </div>

              {/* Desktop Navigation */}
              {!showMobileNav && (
                <div className="flex-1 flex justify-center mx-8">
                  <DesktopNav />
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center space-x-4">
                <ThemeToggle />
                {userRole && userRole !== "ORGANIZATION" && <CartButton />}
                <UserMenu />

                {/* Mobile Menu Button */}
                {showMobileNav && (
                  <MobileMenuButton isOpen={isMenuOpen} onClick={toggleMenu} />
                )}
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <ErrorBoundary
            fallback={
              isMenuOpen && showMobileNav ? (
                <MobileNavDirect isOpen={isMenuOpen} onItemClick={closeMenu} />
              ) : null
            }
          >
            <Suspense
              fallback={
                <div className="p-4 text-center text-sm text-gray-500">
                  <div className="inline-block w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                  Đang tải...
                </div>
              }
            >
              <AnimatePresence>
                {isMenuOpen && showMobileNav && (
                  <MobileNav isOpen={isMenuOpen} onItemClick={closeMenu} />
                )}
              </AnimatePresence>
            </Suspense>
          </ErrorBoundary>
        </div>
      </header>

      {/* Spacer */}
      <div
        ref={spacerRef}
        className="h-16 sm:h-20 transition-all duration-200"
        id="main-content"
        aria-hidden="true"
      />
    </>
  );
};

export default memo(Header);
