// src/components/header/Header.jsx
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  Bell,
  ShoppingCart,
  Ticket,
  Sun,
  Moon,
  Menu,
  Calendar,
  ChevronDown,
  X,
} from "lucide-react";

import { logout } from "../../store/slice/authSlice";
import { toggleTheme } from "../../store/slice/themeSlice";
import TicketLogo from "../../assets/TicketHub_Logo.png";
import None_Avatar from "../../assets/None_Avatar.jpg";

// Import components
import { IconButton } from "../header/IconButton";
import { SearchBar } from "../header/SearchBar";
import { SearchSuggestions } from "../header/SearchSuggestions";
import { UserMenu } from "../header/UserMenu";
import { MobileMenu } from "../header/MobileMenu";

const Header = () => {
  // States
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);

  // Refs
  const userMenuRef = useRef(null);
  const searchRef = useRef(null);

  // Hooks
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.theme?.isDarkMode || false);

  // Effects
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchSuggestions(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handlers
  const handleLogout = () => {
    dispatch(logout());
    setIsUserMenuOpen(false);
    navigate("/login");
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full
    ${
      isScrolled
        ? "dark:bg-gray-900/95 bg-white/95 backdrop-blur-md shadow-lg"
        : "dark:bg-gray-900/90 bg-white/90"
    }`}
      >
        <div className="border-b border-gray-200 dark:border-gray-800 w-full">
          {/* Thay đổi container class */}
          <div className="w-full px-4 max-w-[100vw] mx-auto">
            {" "}
            {/* Removed fixed width container */}
            <div className="flex items-center justify-between h-16">
              {/* Logo - Make it more compact */}
              <Link to="/" className="flex items-center flex-shrink-0">
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  src={TicketLogo}
                  alt="TicketHub"
                  className="h-8 w-auto"
                />
                <div className="hidden sm:flex flex-col ml-2">
                  <span className="text-lg font-bold text-orange-500">
                    TicketHub
                  </span>
                  <span className="text-xs italic text-gray-600 dark:text-gray-400">
                    Best resell platform
                  </span>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center flex-1 justify-end">
                {/* Search Section */}
                <div className="flex-1 max-w-2xl mx-6" ref={searchRef}>
                  <SearchBar
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onFocus={() => setShowSearchSuggestions(true)}
                  />
                  <SearchSuggestions
                    isVisible={showSearchSuggestions}
                    onClose={() => setShowSearchSuggestions(false)}
                  />
                </div>

                {/* Desktop Action Icons */}
                <div className="flex items-center gap-3">
                  <IconButton
                    icon={isDarkMode ? Sun : Moon}
                    onClick={() => dispatch(toggleTheme())}
                  />
                  <IconButton
                    icon={Calendar}
                    onClick={() => navigate("/events")}
                    badge="5"
                  />
                  <IconButton
                    icon={Bell}
                    badge="3"
                    onClick={() => navigate("/notifications")}
                  />
                  <IconButton
                    icon={ShoppingCart}
                    badge="2"
                    onClick={() => navigate("/cart")}
                  />

                  {/* User Menu */}
                  <div className="relative" ref={userMenuRef}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center space-x-2 p-1 rounded-full focus:outline-none"
                    >
                      <img
                        src={None_Avatar}
                        alt="User"
                        className="w-8 h-8 rounded-full border-2 border-orange-500"
                      />
                      <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </motion.button>
                    <UserMenu isOpen={isUserMenuOpen} onClose={handleLogout} />
                  </div>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden flex items-center gap-3">
                <IconButton
                  icon={isDarkMode ? Sun : Moon}
                  onClick={() => dispatch(toggleTheme())}
                  className="text-gray-600 dark:text-gray-300"
                />
                <IconButton
                  icon={isMobileMenuOpen ? X : Menu}
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-gray-600 dark:text-gray-300"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        handleLogout={handleLogout}
        isDarkMode={isDarkMode}
        dispatch={dispatch}
        toggleTheme={toggleTheme}
        notifications={3}
        cartItems={2}
        events={5}
        onNavigate={(path) => {
          navigate(path);
          setIsMobileMenuOpen(false);
        }}
      />

      {/* Search Suggestions Backdrop - Only shown on desktop */}
      {showSearchSuggestions && (
        <div
          className="hidden md:block fixed inset-0 bg-black/20 dark:bg-black/40 z-40"
          onClick={() => setShowSearchSuggestions(false)}
        />
      )}
    </>
  );
};

export default Header;
