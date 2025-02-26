import React, { useState, useRef, useEffect, memo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu as MenuIcon, X, Plus } from "lucide-react";

// Import separated components
import { toggleTheme } from "../../store/slice/themeSlice";
import { useAuth } from "../../hooks/useAuth";
import TicketLogo from "../../assets/TicketHub_Logo.png";

// Import the modularized components
import { MobileMenu } from "../header/MobileMenu";
import { SearchBar } from "../header/SearchBar";
import { UserMenu } from "../header/UserMenu";
import ThemeToggleButton from "../common/ThemeToggleButton";
import NavButton from "../header/NavButton";
import NavLinks from "../header/NavLink";
import GuestButtons from "../header/GuestButton";

// Memoized UserActions component with useCallback for handlers
const UserActions = memo(({ user, onNavigate }) => {
  const actions = [
    {
      icon: Plus,
      path: "/create-ticket",
      label: "Create Ticket",
    },
    {
      icon: ShoppingCart,
      path: "/cart",
      label: "Cart",
      badge: "2",
    },
  ];

  return (
    <div className="hidden sm:flex items-center gap-3">
      {actions.map((action) => (
        <NavButton
          key={action.path}
          icon={action.icon}
          badge={action.badge}
          onClick={() => onNavigate(action.path)}
          label={action.label}
        />
      ))}
    </div>
  );
});

// Optimize user profile button as a separate component
const UserProfileButton = memo(({ user, isUserMenuOpen, toggleUserMenu }) => (
  <motion.button
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
    onClick={toggleUserMenu}
    className="flex items-center gap-3 p-1.5 rounded-xl
      bg-gradient-to-r from-orange-500/15 to-orange-600/15 
      hover:from-orange-500/25 hover:to-orange-600/25
      dark:from-orange-500/20 dark:to-orange-600/20
      dark:hover:from-orange-500/30 dark:hover:to-orange-600/30
      transition-all duration-300 group"
  >
    <div className="w-9 h-9 rounded-lg overflow-hidden border-2 border-orange-500 shadow-sm group-hover:shadow-md transition-shadow">
      <img
        src={user.avatarUrl || "/assets/None_Avatar.jpg"}
        alt="Avatar"
        className="w-full h-full object-cover"
      />
    </div>
    <div className="hidden lg:block text-left">
      <p className="text-sm font-medium text-gray-700 dark:text-gray-100">
        {user.fullName}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-300">{user.email}</p>
    </div>
    <motion.span
      animate={{ rotate: isUserMenuOpen ? 180 : 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-center"
    >
      <X
        className={`w-4 h-4 text-gray-600 dark:text-gray-300 
          absolute transition-opacity duration-300 
          ${isUserMenuOpen ? "opacity-100" : "opacity-0"}`}
      />
      <svg
        className={`w-4 h-4 text-gray-600 dark:text-gray-300 
          transition-opacity duration-300 
          ${isUserMenuOpen ? "opacity-0" : "opacity-100"}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </motion.span>
  </motion.button>
));

// Optimize mobile menu toggle button
const MobileMenuToggle = memo(({ isOpen, toggleMobileMenu }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={toggleMobileMenu}
    className="sm:hidden p-2.5 rounded-full bg-gray-100/80 dark:bg-gray-700/80 
      hover:bg-gray-200 dark:hover:bg-gray-600/90 transition-all duration-300"
    aria-label="Toggle mobile menu"
  >
    <AnimatePresence mode="wait">
      {isOpen ? (
        <motion.div
          key="close"
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 90, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <X className="w-5 h-5 text-orange-500" />
        </motion.div>
      ) : (
        <motion.div
          key="menu"
          initial={{ rotate: 90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: -90, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <MenuIcon className="w-5 h-5 text-gray-600 dark:text-gray-200" />
        </motion.div>
      )}
    </AnimatePresence>
  </motion.button>
));

// Main Header component
const Header = () => {
  // State with optimized default values
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(window.scrollY > 10);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const { user, logout } = useAuth();
  const userMenuRef = useRef(null);
  const headerRef = useRef(null);

  // Memoized handler functions to prevent unnecessary re-renders
  const toggleUserMenu = useCallback(() => {
    setIsUserMenuOpen((prev) => !prev);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const handleThemeToggle = useCallback(() => {
    dispatch(toggleTheme());
  }, [dispatch]);

  // Optimized scroll event handler with throttling
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          // Check if scrolled past threshold
          setIsScrolled(currentScrollY > 10);

          // Show header when scrolling up or at top of page
          // Hide header when scrolling down (and not hovering)
          if (currentScrollY <= 0) {
            setIsHeaderVisible(true); // Always show at top of page
          } else if (!isHovering) {
            setIsHeaderVisible(
              currentScrollY < lastScrollY || currentScrollY < 50,
            );
          }

          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, isHovering]);

  // Handle mouse hover on top of page
  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
    setIsHeaderVisible(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    if (window.scrollY > 50 && window.scrollY > lastScrollY) {
      setIsHeaderVisible(false);
    }
  }, [lastScrollY]);

  // Optimized click outside handler
  useEffect(() => {
    if (!isUserMenuOpen) return;

    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isUserMenuOpen]);

  // Memoized navigation handler
  const handleNavigate = useCallback((path) => {
    window.location.href = path;
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, []);

  // Memoized logout handler
  const handleLogout = useCallback(async () => {
    try {
      await logout();
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, [logout]);

  // Memoized search handlers
  const handleSearchChange = useCallback((e) => {
    setSearchValue(e.target.value);
  }, []);

  const handleSearchFocus = useCallback(() => {
    setIsSearchFocused(true);
  }, []);

  const handleSearchBlur = useCallback(() => {
    setIsSearchFocused(false);
  }, []);

  const handleSearchClear = useCallback(() => {
    setSearchValue("");
  }, []);

  // Animation variants defined outside render function
  const logoHoverVariants = {
    hover: { scale: 1.03 },
    tap: { scale: 0.97 },
  };

  // Header container animation variants
  const containerVariants = {
    visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
    hidden: { opacity: 0, y: -100, transition: { duration: 0.7 } },
  };

  return (
    <>
      {/* Hover detection area - always at top of screen */}
      <div
        className="fixed top-0 left-0 right-0 h-6 z-50"
        onMouseEnter={handleMouseEnter}
      />

      <motion.div
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-40"
        initial="visible"
        animate={isHeaderVisible ? "visible" : "hidden"}
        variants={containerVariants}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className={`transition-all duration-500 ${
            isScrolled ? "pt-4 px-4 sm:px-6 lg:px-8" : "pt-0 px-0"
          }`}
        >
          <div
            className={`transition-all duration-500 ease-in-out ${
              isScrolled ? "max-w-7xl mx-auto" : "w-full"
            }`}
          >
            <header
              className={`transition-all duration-500 
                ${
                  isScrolled
                    ? "rounded-2xl shadow-lg dark:shadow-black/40 bg-white/90 dark:bg-gray-800/95 backdrop-blur-lg"
                    : "rounded-none shadow-md bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm"
                }
              `}
            >
              <div
                className={`border-b transition-colors duration-500 ${
                  isScrolled
                    ? "border-gray-200 dark:border-gray-700"
                    : "border-transparent"
                }`}
              >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex items-center justify-between h-16 sm:h-20">
                    {/* Logo with hover effect */}
                    <motion.button
                      variants={logoHoverVariants}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={() => handleNavigate("/")}
                      className="flex items-center gap-3 group transition-transform duration-300"
                    >
                      <div className="h-10 w-10 rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-shadow duration-300">
                        <img
                          src={TicketLogo}
                          alt="Logo"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="hidden sm:block">
                        <h1 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                          TicketHub
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Best resell platform
                        </p>
                      </div>
                    </motion.button>

                    {/* Navigation Links - memoized internally */}
                    <NavLinks
                      onNavigate={handleNavigate}
                      activePath={window.location.pathname}
                    />

                    {/* Search and Actions */}
                    <div className="flex items-center gap-4">
                      <div className="hidden sm:block">
                        <SearchBar
                          value={searchValue}
                          onChange={handleSearchChange}
                          onFocus={handleSearchFocus}
                          onBlur={handleSearchBlur}
                          onClear={handleSearchClear}
                        />
                      </div>

                      <ThemeToggleButton
                        isDarkMode={isDarkMode}
                        onClick={handleThemeToggle}
                      />

                      {user ? (
                        <div className="flex items-center gap-4">
                          <UserActions
                            user={user}
                            onNavigate={handleNavigate}
                          />

                          <div className="relative" ref={userMenuRef}>
                            <UserProfileButton
                              user={user}
                              isUserMenuOpen={isUserMenuOpen}
                              toggleUserMenu={toggleUserMenu}
                            />

                            <UserMenu
                              isOpen={isUserMenuOpen}
                              onClose={() => setIsUserMenuOpen(false)}
                              handleLogout={handleLogout}
                            />
                          </div>
                        </div>
                      ) : (
                        <GuestButtons onNavigate={handleNavigate} />
                      )}

                      {/* Mobile Menu Button with animation */}
                      <MobileMenuToggle
                        isOpen={isMobileMenuOpen}
                        toggleMobileMenu={toggleMobileMenu}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Menu - Only render when needed */}
              {isMobileMenuOpen && (
                <MobileMenu
                  isOpen={isMobileMenuOpen}
                  onClose={() => setIsMobileMenuOpen(false)}
                  searchValue={searchValue}
                  onSearchChange={handleSearchChange}
                  onNavigate={handleNavigate}
                  user={user}
                  handleLogout={handleLogout}
                  isDarkMode={isDarkMode}
                  dispatch={dispatch}
                  toggleTheme={toggleTheme}
                  isAuthenticated={!!user}
                />
              )}
            </header>
          </div>
        </div>
      </motion.div>

      {/* Empty spacer that matches the header height to prevent content jump */}
      <div className="h-16 sm:h-20"></div>
    </>
  );
};

export default memo(Header);
