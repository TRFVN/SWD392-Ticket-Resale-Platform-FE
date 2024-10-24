import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { PiShoppingCartBold } from "react-icons/pi";
import {
  FaTicketAlt,
  FaHeart,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaSearch,
  FaSun,
  FaMoon,
} from "react-icons/fa";
import Lottie from "lottie-react";
import TicketHub_Logo_R from "../../assets/TicketHub_Logo_R.png";
import None_Avatar from "../../assets/None_Avatar.jpg";
import animationData from "../common/NotificationV3/notification-V3.json";
import { logout } from "../../store/slice/authSlice";
import { toggleTheme } from "../../store/slice/themeSlice";

const Header = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isDarkMode = useSelector((state) => state.theme?.isDarkMode || false);

  // Toggle theme
  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

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

  const handleLogout = () => {
    dispatch(logout());
    setIsUserMenuOpen(false);
    navigate("/login");
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 
        ${
          isScrolled
            ? "dark:bg-gray-900/95 dark:border-gray-700 bg-white/95"
            : "dark:bg-gray-900/90 dark:border-gray-700 bg-white/90"
        } 
        border-b backdrop-blur-sm`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <Link to="/" className="flex items-center">
            <img
              src={TicketHub_Logo_R}
              alt="Ticket Hub Logo"
              className="h-14 w-auto mr-3"
            />
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-orange-500">
                TicketHub
              </span>
              <span className="text-sm italic dark:text-gray-400 text-gray-600 hidden md:inline">
                The best resell ticket platform
              </span>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="flex-grow max-w-2xl mx-8 hidden lg:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for events, artists, or venues..."
                className="w-full py-2 px-4 pr-10 rounded-full 
                  dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600
                  bg-gray-100 border border-gray-300 
                  focus:outline-none focus:ring-2 focus:ring-orange-400 
                  transition-all duration-300"
              />
              <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            </div>
          </div>

          {/* Navigation Icons */}
          <nav className="flex items-center space-x-6">
            {/* Theme Toggle Button */}
            <button
              onClick={handleThemeToggle}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <FaSun className="text-xl text-orange-400" />
              ) : (
                <FaMoon className="text-xl text-gray-600" />
              )}
            </button>

            {/* Rest of the navigation icons */}
            <Link to="/tickets" className="text-gray-700 dark:text-gray-300">
              <FaTicketAlt className="text-xl" />
            </Link>

            {/* Notification */}
            <div className="relative">
              <Lottie
                animationData={animationData}
                loop={true}
                className="w-7 h-7"
              />
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </div>

            {/* Cart */}
            <div className="relative">
              <PiShoppingCartBold className="text-2xl dark:text-gray-300 text-gray-700" />
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                2
              </span>
            </div>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center focus:outline-none"
              >
                <img
                  src={None_Avatar}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full border-2 border-orange-500"
                />
              </button>
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 dark:bg-gray-800 bg-white rounded-lg shadow-xl py-2 border dark:border-gray-700 border-gray-200">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm dark:text-gray-300 text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FaUser className="inline-block mr-2" /> Profile
                  </Link>
                  <Link
                    to="/wishlist"
                    className="block px-4 py-2 text-sm dark:text-gray-300 text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FaHeart className="inline-block mr-2" /> Wishlist
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm dark:text-gray-300 text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FaCog className="inline-block mr-2" /> Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm dark:text-gray-300 text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FaSignOutAlt className="inline-block mr-2" /> Sign out
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="mt-2 px-4 lg:hidden">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-full py-2 px-4 pr-10 rounded-full 
              dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600
              bg-gray-100 border border-gray-300 
              focus:outline-none focus:ring-2 focus:ring-orange-400
              transition-all duration-300"
          />
          <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
        </div>
      </div>
    </header>
  );
};

export default Header;
