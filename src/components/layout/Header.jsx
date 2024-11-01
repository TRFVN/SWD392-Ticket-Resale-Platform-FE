import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  ShoppingCart,
  Sun,
  Moon,
  Menu,
  Calendar,
  ChevronDown,
  X,
  LogIn,
  UserPlus,
} from "lucide-react";

import { toggleTheme } from "../../store/slice/themeSlice";
import TicketLogo from "../../assets/TicketHub_Logo.png";
import None_Avatar from "../../assets/None_Avatar.jpg";
import { SearchBar } from "../header/SearchBar";
import { SearchSuggestions } from "../header/SearchSuggestions";
import { UserMenu } from "../header/UserMenu";
import { MobileMenu } from "../header/MobileMenu";
import { AuthContext } from "../../context/AuthContext";

const AuthenticatedNav = ({
  isDarkMode,
  dispatch,
  toggleTheme,
  userMenuRef,
  isUserMenuOpen,
  setIsUserMenuOpen,
  user,
  handleLogout,
  navigate,
}) => (
  <div className="flex items-center gap-4">
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      onClick={() => dispatch(toggleTheme())}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={isDarkMode ? "dark" : "light"}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5 text-orange-500" />
          ) : (
            <Moon className="w-5 h-5 text-gray-600" />
          )}
        </motion.div>
      </AnimatePresence>
    </motion.button>

    {[
      { icon: Calendar, badge: "5", path: "/events" },
      { icon: Bell, badge: "3", path: "/notifications" },
      { icon: ShoppingCart, badge: "2", path: "/cart" },
    ].map((item) => (
      <motion.button
        key={item.path}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => navigate(item.path)}
        className="relative p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        <item.icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        {item.badge && (
          <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs font-medium text-white bg-orange-500 rounded-full border-2 border-white dark:border-gray-900">
            {item.badge}
          </span>
        )}
      </motion.button>
    ))}

    <div className="relative" ref={userMenuRef}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
        className="flex items-center space-x-3 p-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        <img
          src={user?.avatarUrl || None_Avatar}
          alt="User"
          className="w-9 h-9 rounded-lg border-2 border-orange-500"
        />
        <div className="hidden lg:block text-left">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
            {user?.fullName || "User"}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {user?.email || "user@example.com"}
          </p>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
      </motion.button>
      <UserMenu
        isOpen={isUserMenuOpen}
        onClose={() => setIsUserMenuOpen(false)}
        handleLogout={handleLogout}
      />
    </div>
  </div>
);

const GuestNav = ({ isDarkMode, dispatch, toggleTheme, navigate }) => (
  <div className="flex items-center gap-4">
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      onClick={() => dispatch(toggleTheme())}
    >
      {isDarkMode ? (
        <Sun className="w-5 h-5 text-orange-500" />
      ) : (
        <Moon className="w-5 h-5 text-gray-600" />
      )}
    </motion.button>

    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => navigate("/login")}
      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white transition-colors"
    >
      <LogIn className="w-4 h-4" />
      <span>Login</span>
    </motion.button>

    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => navigate("/register")}
      className="flex items-center gap-2 px-4 py-2 rounded-xl border border-orange-500 text-orange-500 hover:bg-orange-50 dark:hover:bg-gray-800 transition-colors"
    >
      <UserPlus className="w-4 h-4" />
      <span>Register</span>
    </motion.button>
  </div>
);

const Header = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const userMenuRef = useRef(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.theme?.isDarkMode || false);

  // Use AuthContext instead of local state
  const { user, logout } = useContext(AuthContext);
  const isAuthenticated = !!user;

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

  const handleLogout = () => {
    logout(); // Use logout from AuthContext
    setIsUserMenuOpen(false);
    navigate("/login");
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full ${
          isScrolled
            ? "dark:bg-gray-900/95 bg-white/95 backdrop-blur-md shadow-lg"
            : "dark:bg-gray-900/90 bg-white/90"
        }`}
      >
        <div className="border-b border-gray-200 dark:border-gray-800 w-full">
          <div className="w-full px-6 max-w-[1920px] mx-auto">
            <div className="flex items-center justify-between h-20">
              <Link to="/" className="flex items-center flex-shrink-0 group">
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  src={TicketLogo}
                  alt="TicketHub"
                  className="h-10 w-auto"
                />
                <div className="hidden sm:flex flex-col ml-3">
                  <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent group-hover:from-orange-600 group-hover:to-orange-700 transition-all duration-300">
                    TicketHub
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Best resell platform
                  </span>
                </div>
              </Link>

              <div className="hidden md:flex items-center flex-1 justify-end space-x-8">
                <div className="flex-1 max-w-3xl mx-8" ref={searchRef}>
                  <div className="relative">
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
                </div>

                {isAuthenticated ? (
                  <AuthenticatedNav
                    isDarkMode={isDarkMode}
                    dispatch={dispatch}
                    toggleTheme={toggleTheme}
                    userMenuRef={userMenuRef}
                    isUserMenuOpen={isUserMenuOpen}
                    setIsUserMenuOpen={setIsUserMenuOpen}
                    user={user}
                    handleLogout={handleLogout}
                    navigate={navigate}
                  />
                ) : (
                  <GuestNav
                    isDarkMode={isDarkMode}
                    dispatch={dispatch}
                    toggleTheme={toggleTheme}
                    navigate={navigate}
                  />
                )}
              </div>

              <div className="md:hidden flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => dispatch(toggleTheme())}
                  className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  {isDarkMode ? (
                    <Sun className="w-5 h-5 text-orange-500" />
                  ) : (
                    <Moon className="w-5 h-5 text-gray-600" />
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  {isMobileMenuOpen ? (
                    <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  ) : (
                    <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        handleLogout={handleLogout}
        isDarkMode={isDarkMode}
        dispatch={dispatch}
        toggleTheme={toggleTheme}
        user={user}
        isAuthenticated={isAuthenticated}
        onNavigate={(path) => {
          navigate(path);
          setIsMobileMenuOpen(false);
        }}
      />

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
