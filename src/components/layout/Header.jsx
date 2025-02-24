import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import {
  ShoppingCart,
  Sun,
  Moon,
  Menu,
  Calendar,
  ChevronDown,
  X,
  LogIn,
  UserPlus,
  Plus,
  Ticket,
} from "lucide-react";

import { toggleTheme } from "../../store/slice/themeSlice";
import { useAuth } from "../../hooks/useAuth";
import TicketLogo from "../../assets/TicketHub_Logo.png";
import None_Avatar from "../../assets/None_Avatar.jpg";
import { SearchBar } from "../header/SearchBar";
import { SearchSuggestions } from "../header/SearchSuggestions";
import { UserMenu } from "../header/UserMenu";
import { MobileMenu } from "../header/MobileMenu";
const ThemeToggleButton = ({ isDarkMode, onClick }) => (
  <button
    className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
    onClick={onClick}
  >
    {isDarkMode ? (
      <Sun className="w-5 h-5 text-orange-500" />
    ) : (
      <Moon className="w-5 h-5 text-gray-600" />
    )}
  </button>
);

const NavButton = ({ icon: Icon, badge, onClick, label }) => (
  <button
    onClick={onClick}
    className="relative p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
    aria-label={label}
  >
    <Icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
    {badge && (
      <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs font-medium text-white bg-orange-500 rounded-full border-2 border-white dark:border-gray-900">
        {badge}
      </span>
    )}
  </button>
);

const NavLinks = ({ onNavigate }) => {
  const navItems = [
    {
      icon: Calendar,
      text: "Browse Events",
      path: "/events",
    },
    {
      icon: Ticket,
      text: "Browse Tickets",
      path: "/tickets",
    },
  ];

  return (
    <div className="hidden md:flex items-center gap-4">
      {navItems.map((item) => (
        <button
          key={item.path}
          onClick={() => onNavigate(item.path)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl 
            hover:bg-orange-50 dark:hover:bg-gray-800/50 
            text-gray-700 dark:text-gray-300 
            transition-all duration-300"
        >
          <item.icon className="w-5 h-5 text-orange-500" />
          <span className="font-medium">{item.text}</span>
        </button>
      ))}
    </div>
  );
};

const GuestButtons = ({ onNavigate }) => (
  <div className="flex items-center gap-3">
    <button
      onClick={() => onNavigate("/login")}
      className="px-4 py-2 rounded-xl bg-orange-500 text-white hover:bg-orange-600 
        transition-colors flex items-center gap-2"
    >
      <LogIn className="w-4 h-4" />
      <span>Login</span>
    </button>
    <button
      onClick={() => onNavigate("/signup")}
      className="px-4 py-2 rounded-xl border border-orange-500 text-orange-500 
        hover:bg-orange-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
    >
      <UserPlus className="w-4 h-4" />
      <span>Register</span>
    </button>
  </div>
);

const UserActions = ({ user, onNavigate }) => {
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
    <div className="flex items-center gap-3">
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
};

const Header = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const { user, logout } = useAuth();
  const userMenuRef = useRef(null);

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

  const handleNavigate = (path) => {
    window.location.href = path;
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full
        ${
          isScrolled
            ? "dark:bg-gray-900/95 bg-white/95 backdrop-blur-md shadow-lg"
            : "dark:bg-gray-900/90 bg-white/90"
        }`}
    >
      <div className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <button
              onClick={() => handleNavigate("/")}
              className="flex items-center gap-3 group"
            >
              <img
                src={TicketLogo}
                alt="Logo"
                className="h-10 w-10 rounded-xl"
              />
              <div className="hidden sm:block">
                <h1
                  className="text-xl font-bold bg-gradient-to-r from-orange-500 
                  to-orange-600 bg-clip-text text-transparent"
                >
                  TicketHub
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Best resell platform
                </p>
              </div>
            </button>

            {/* Navigation Links */}
            <NavLinks onNavigate={handleNavigate} />

            {/* Search and Actions */}
            <div className="flex items-center gap-4">
              <SearchBar
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onFocus={() => {}}
              />

              <ThemeToggleButton
                isDarkMode={isDarkMode}
                onClick={() => dispatch(toggleTheme())}
              />

              {user ? (
                <div className="flex items-center gap-4">
                  <UserActions user={user} onNavigate={handleNavigate} />

                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center gap-3 p-1.5 rounded-xl
                        bg-gradient-to-r from-orange-500/10 to-orange-600/10 
                        hover:from-orange-500/20 hover:to-orange-600/20
                        transition-all duration-300"
                    >
                      <img
                        src={user.avatarUrl || "/assets/None_Avatar.jpg"}
                        alt="Avatar"
                        className="w-9 h-9 rounded-lg border-2 border-orange-500"
                      />
                      <div className="hidden lg:block text-left">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                          {user.fullName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {user.email}
                        </p>
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>

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

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 
                  hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex flex-col space-y-3">
              <SearchBar
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onFocus={() => {}}
              />
              <button
                onClick={() => handleNavigate("/events")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl 
                  hover:bg-gray-100 dark:hover:bg-gray-800 
                  text-gray-700 dark:text-gray-300"
              >
                <Calendar className="w-5 h-5 text-orange-500" />
                <span>Browse Events</span>
              </button>
              <button
                onClick={() => handleNavigate("/tickets")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl 
                  hover:bg-gray-100 dark:hover:bg-gray-800 
                  text-gray-700 dark:text-gray-300"
              >
                <Ticket className="w-5 h-5 text-orange-500" />
                <span>Browse Tickets</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
