import React, { useState, useRef, useEffect, memo } from "react";
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

// Memoized UserActions component
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

const Header = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const { user, logout } = useAuth();
  const userMenuRef = useRef(null);

  // Handle scroll and click outside effects
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle navigation and close menus
  const handleNavigate = (path) => {
    window.location.href = path;
    setIsMobileMenuOpen(false);
  };

  // Handle user logout
  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  // Handle search input focus
  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  // Handle search input blur
  const handleSearchBlur = () => {
    setIsSearchFocused(false);
  };

  // Handle search clear
  const handleSearchClear = () => {
    setSearchValue("");
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full
        ${
          isScrolled
            ? "dark:bg-gray-900/95 bg-white/95 backdrop-blur-lg shadow-md"
            : "dark:bg-gray-900/80 bg-white/80 backdrop-blur-sm"
        }`}
    >
      <div
        className={`border-b transition-colors duration-500 ${
          isScrolled
            ? "border-gray-200 dark:border-gray-800"
            : "border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo with hover effect */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
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
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Best resell platform
                </p>
              </div>
            </motion.button>

            {/* Navigation Links */}
            <NavLinks onNavigate={handleNavigate} />

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
                onClick={() => dispatch(toggleTheme())}
              />

              {user ? (
                <div className="flex items-center gap-4">
                  <UserActions user={user} onNavigate={handleNavigate} />

                  <div className="relative" ref={userMenuRef}>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center gap-3 p-1.5 rounded-xl
                        bg-gradient-to-r from-orange-500/10 to-orange-600/10 
                        hover:from-orange-500/20 hover:to-orange-600/20
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
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                          {user.fullName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {user.email}
                        </p>
                      </div>
                      <motion.span
                        animate={{ rotate: isUserMenuOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center justify-center"
                      >
                        <X
                          className={`w-4 h-4 text-gray-600 dark:text-gray-400 
                            absolute transition-opacity duration-300 
                            ${isUserMenuOpen ? "opacity-100" : "opacity-0"}`}
                        />
                        <svg
                          className={`w-4 h-4 text-gray-600 dark:text-gray-400 
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
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="sm:hidden p-2.5 rounded-full bg-gray-100/80 dark:bg-gray-800/80 
                  hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
                aria-label="Toggle mobile menu"
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
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
                      <MenuIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        onNavigate={handleNavigate}
        user={user}
        handleLogout={handleLogout}
        isDarkMode={isDarkMode}
        toggleTheme={() => dispatch(toggleTheme())}
      />
    </header>
  );
};

export default Header;
