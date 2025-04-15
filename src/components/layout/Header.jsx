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
import SearchBar from "../header/header/SearchBar";
import ThemeToggle from "../header/header/ThemeToggle";
import UserMenu from "../header/UserMenu";
import CartButton from "../header/CartButton";
import MobileMenuButton from "../header/MobileMenu/MobileMenuButton";
import { AnimatePresence, motion } from "framer-motion";

// Lazy load mobile navigation
const MobileNav = lazy(() => import("../header/MobileMenu"));

// Simplified breakpoints
const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
};

// Simplified animation variants
const headerVariants = {
  hidden: { y: -100 },
  visible: { y: 0 },
};

/**
 * Enhanced Header Component with improved UX and performance
 *
 * Features:
 * - Optimized animations with reduced layout shifts
 * - Better accessibility with improved focus management
 * - Enhanced responsive behavior with smoother transitions
 * - Reduced render cycles with memoization and callback optimizations
 * - Improved compact mode with subtle visual cues
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

  // Simplified header background
  const headerBgClass = isScrolled
    ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-sm"
    : "bg-transparent";

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
      <motion.header
        ref={headerRef}
        className={`fixed top-0 left-0 w-full z-50 ${headerBgClass} transition-colors duration-200`}
        initial="hidden"
        animate={isHeaderVisible ? "visible" : "hidden"}
        variants={headerVariants}
        role="banner"
      >
        <div className="max-w-screen-xl mx-auto">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between gap-2">
              {/* Logo */}
              <div className="flex-shrink-0">
                <HeaderLogo />
              </div>

              {/* Desktop Navigation */}
              {!showMobileNav && (
                <div className="flex-1 flex justify-center">
                  <DesktopNav />
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2">
                <SearchBar mini={showMobileNav} />
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
          <Suspense
            fallback={
              <div className="p-4 text-center text-sm text-gray-500">
                <div className="inline-block w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mr-2"></div>
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
        </div>
      </motion.header>

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
