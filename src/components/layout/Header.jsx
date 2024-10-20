import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { PiShoppingCartBold } from "react-icons/pi";
import {
  FaTicketAlt,
  FaHeart,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaSearch,
} from "react-icons/fa";
import Lottie from "lottie-react";
import TicketHub_Logo_R from "../../assets/TicketHub_Logo_R.png";
import None_Avatar from "../../assets/None_Avatar.jpg";
import animationData from "../common/NotificationV3/notification-V3.json";

const Header = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white bg-opacity-95" : "bg-white bg-opacity-90"
      } border-b border-gray-200`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
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
              <span className="text-sm italic text-gray-600 hidden md:inline">
                The best resell ticket platform
              </span>
            </div>
          </Link>

          <div className="flex-grow max-w-2xl mx-8 hidden lg:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for events, artists, or venues..."
                className="w-full py-2 px-4 pr-10 rounded-full bg-gray-100 focus:bg-white border border-gray-300 focus:border-orange-500 focus:outline-none transition-all duration-300"
              />
              <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-500 cursor-pointer" />
            </div>
          </div>

          <nav className="flex items-center space-x-6">
            <Link
              to="/tickets"
              className="text-gray-700 hover:text-orange-500 transition-colors duration-200"
            >
              <FaTicketAlt className="text-xl" />
            </Link>
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
            <div className="relative">
              <PiShoppingCartBold className="text-2xl text-gray-700 hover:text-orange-500 transition-colors duration-200" />
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                2
              </span>
            </div>
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center focus:outline-none"
              >
                <img
                  src={None_Avatar}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full border-2 border-orange-500 transition-transform duration-300 transform hover:scale-110"
                />
              </button>
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-10 border border-gray-200">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-100 transition-colors duration-200"
                  >
                    <FaUser className="inline-block mr-2" /> Profile
                  </Link>
                  <Link
                    to="/wishlist"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-100 transition-colors duration-200"
                  >
                    <FaHeart className="inline-block mr-2" /> Wishlist
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-100 transition-colors duration-200"
                  >
                    <FaCog className="inline-block mr-2" /> Settings
                  </Link>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-100 transition-colors duration-200">
                    <FaSignOutAlt className="inline-block mr-2" /> Sign out
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
      <div className="mt-2 px-4 lg:hidden">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-full py-2 px-4 pr-10 rounded-full bg-gray-100 focus:bg-white border border-gray-300 focus:border-orange-500 focus:outline-none transition-all duration-300"
          />
          <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
    </header>
  );
};

export default Header;
