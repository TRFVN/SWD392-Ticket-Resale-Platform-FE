// ProfilePage.jsx
import React, { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
import {
  FaUser,
  FaCreditCard,
  FaHeart,
  FaCog,
  FaTicketAlt,
  FaHistory,
  FaBell,
  FaChevronRight,
  FaShieldAlt,
} from "react-icons/fa";
import ProfileStats from "../../components/profile/ProfileStats";
import UpcomingEvent from "../../components/profile/UpcomingEvents";

const ProfilePage = () => {
  const { user, loading, refreshUserData } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("overview");
  const [showChangePassword, setShowChangePassword] = useState(false);

  useEffect(() => {
    if (!user) {
      refreshUserData();
    }

    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, [refreshUserData, user]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  // Mock data for demonstration
  const upcomingEvents = [
    {
      id: 1,
      title: "Summer Music Festival 2025",
      date: "April 15, 2025",
      image: "/api/placeholder/500/300",
      location: "Central Park, New York",
      tickets: 2,
    },
    {
      id: 2,
      title: "Tech Conference 2025",
      date: "May 22, 2025",
      image: "/api/placeholder/500/300",
      location: "Convention Center, San Francisco",
      tickets: 1,
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: "purchase",
      title: "Purchased 2 tickets - Summer Music Festival",
      date: "February 28, 2025",
    },
    {
      id: 2,
      type: "saved",
      title: "Saved event - International Film Festival",
      date: "February 25, 2025",
    },
    {
      id: 3,
      type: "review",
      title: "Left a review - Tech Conference 2024",
      date: "February 20, 2025",
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ProfileStats
                title="Events Attended"
                value="12"
                trend="+3 this month"
                trendUp={true}
              />
              <ProfileStats
                title="Tickets Purchased"
                value="27"
                trend="+5 this month"
                trendUp={true}
              />
              <ProfileStats
                title="Saved Events"
                value="8"
                trend="3 upcoming"
                trendUp={null}
              />
            </div>

            {/* Upcoming Events Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  Upcoming Events
                </h3>
                <button className="text-primary-DEFAULT hover:text-primary-dark font-medium flex items-center gap-1 transition-colors">
                  View all <FaChevronRight size={12} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingEvents.map((event) => (
                  <UpcomingEvent key={event.id} event={event} />
                ))}
              </div>
            </div>

            {/* Recent Activity Section */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                Recent Activity
              </h3>
              <div className="bg-light-secondary dark:bg-dark-secondary rounded-xl overflow-hidden">
                {recentActivity.map((activity, index) => (
                  <div
                    key={activity.id}
                    className={`p-4 flex justify-between items-center ${
                      index !== recentActivity.length - 1
                        ? "border-b border-gray-200 dark:border-gray-700"
                        : ""
                    }`}
                  >
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {activity.date}
                      </p>
                    </div>
                    <button className="text-primary-DEFAULT hover:text-primary-dark">
                      <FaChevronRight />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case "tickets":
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              My Tickets
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Manage all your event tickets in one place. View upcoming events,
              download tickets, or request refunds.
            </p>

            {/* Tab for ticket status */}
            <div className="flex space-x-1 bg-light-secondary dark:bg-dark-secondary p-1 rounded-lg w-fit">
              {["Upcoming", "Past", "Canceled"].map((status) => (
                <button
                  key={status}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    status === "Upcoming"
                      ? "bg-white dark:bg-dark-primary text-gray-800 dark:text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Tickets list */}
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white dark:bg-dark-secondary rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="relative md:w-1/3 h-48 md:h-auto">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6 md:w-2/3 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                            {event.title}
                          </h3>
                          <span className="bg-primary-light/10 text-primary-DEFAULT px-3 py-1 rounded-full text-sm font-medium">
                            {event.tickets}{" "}
                            {event.tickets > 1 ? "tickets" : "ticket"}
                          </span>
                        </div>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                          {event.date} • {event.location}
                        </p>
                      </div>

                      <div className="mt-6 flex flex-wrap gap-3">
                        <button className="px-4 py-2 bg-primary-DEFAULT hover:bg-primary-dark text-white rounded-lg transition-colors text-sm font-medium">
                          View Tickets
                        </button>
                        <button className="px-4 py-2 bg-light-secondary dark:bg-dark-accent text-gray-800 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium">
                          Event Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );

      case "personal":
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-secondary text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-light focus:border-primary-DEFAULT outline-none transition-all"
                  defaultValue={user?.displayName || ""}
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-secondary text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-light focus:border-primary-DEFAULT outline-none transition-all"
                  defaultValue={user?.email || ""}
                  placeholder="Your email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-secondary text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-light focus:border-primary-DEFAULT outline-none transition-all"
                  defaultValue={user?.phone || ""}
                  placeholder="Your phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-secondary text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-light focus:border-primary-DEFAULT outline-none transition-all"
                  defaultValue={user?.birthDate || ""}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Address
                </label>
                <textarea
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-secondary text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-light focus:border-primary-DEFAULT outline-none transition-all resize-none h-24"
                  defaultValue={user?.address || ""}
                  placeholder="Your full address"
                />
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 flex justify-end">
              <button className="px-6 py-3 bg-primary-DEFAULT hover:bg-primary-dark text-white rounded-lg transition-colors font-medium">
                Save Changes
              </button>
            </div>
          </motion.div>
        );

      case "payment":
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Payment Methods
            </h2>

            <div className="space-y-4">
              {/* Saved payment methods */}
              <div className="bg-white dark:bg-dark-secondary rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-8 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold">
                      Visa
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">
                        Visa ending in 4242
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Expires 04/2028
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                      Edit
                    </button>
                    <button className="text-red-500 hover:text-red-700">
                      Remove
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-dark-secondary rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-8 bg-green-600 rounded-md flex items-center justify-center text-white font-bold">
                      MC
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">
                        Mastercard ending in 8888
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Expires 08/2026
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                      Edit
                    </button>
                    <button className="text-red-500 hover:text-red-700">
                      Remove
                    </button>
                  </div>
                </div>
              </div>

              {/* Add new payment method */}
              <button className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-center text-gray-600 dark:text-gray-400 hover:text-primary-DEFAULT hover:border-primary-DEFAULT transition-colors">
                <span className="flex items-center justify-center gap-2">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 4V16M4 10H16"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Add Payment Method
                </span>
              </button>
            </div>

            <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-8">
              Billing Address
            </h3>
            <div className="bg-white dark:bg-dark-secondary rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">
                    Same as profile address
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    123 Main Street, Apt 4B
                    <br />
                    New York, NY 10001
                    <br />
                    United States
                  </p>
                </div>
                <button className="text-primary-DEFAULT hover:text-primary-dark">
                  Edit
                </button>
              </div>
            </div>
          </motion.div>
        );

      case "interests":
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              My Interests
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Select your favorite event types to help us personalize your event
              recommendations.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {[
                "Music",
                "Sports",
                "Arts",
                "Theater",
                "Food & Drink",
                "Business",
                "Technology",
                "Health",
                "Education",
                "Lifestyle",
                "Community",
                "Charity",
                "Film",
                "Comedy",
                "Nightlife",
              ].map((interest) => (
                <div
                  key={interest}
                  className="flex items-center space-x-3 p-4 bg-white dark:bg-dark-secondary rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <input
                    type="checkbox"
                    id={`interest-${interest}`}
                    className="h-5 w-5 rounded border-gray-300 text-primary-DEFAULT focus:ring-primary-light"
                    defaultChecked={[
                      "Music",
                      "Technology",
                      "Food & Drink",
                      "Comedy",
                    ].includes(interest)}
                  />
                  <label
                    htmlFor={`interest-${interest}`}
                    className="text-gray-800 dark:text-white font-medium"
                  >
                    {interest}
                  </label>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                Favorite Artists/Teams
              </h3>
              <div className="bg-white dark:bg-dark-secondary rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex flex-wrap gap-2 mb-4">
                  {["Taylor Swift", "Coldplay", "Lakers", "Local Theater"].map(
                    (tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
                      >
                        {tag}
                        <button className="ml-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M18 6L6 18M6 6L18 18"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </span>
                    ),
                  )}
                </div>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-secondary text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-light focus:border-primary-DEFAULT outline-none transition-all pr-12"
                    placeholder="Add artists, teams, or venues you follow"
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary-DEFAULT hover:text-primary-dark rounded-full w-8 h-8 flex items-center justify-center">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10 4V16M4 10H16"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 flex justify-end">
              <button className="px-6 py-3 bg-primary-DEFAULT hover:bg-primary-dark text-white rounded-lg transition-colors font-medium">
                Save Preferences
              </button>
            </div>
          </motion.div>
        );

      case "settings":
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Account Settings
            </h2>

            <div className="space-y-6">
              {/* Notification settings */}
              <div className="bg-white dark:bg-dark-secondary rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <FaBell className="text-primary-DEFAULT" /> Notification
                    Settings
                  </h3>

                  <div className="mt-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">
                          Email Notifications
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Receive updates about your tickets and favorite events
                        </p>
                      </div>
                      <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200 dark:bg-gray-700">
                        <input
                          type="checkbox"
                          id="emailToggle"
                          className="sr-only"
                          defaultChecked={true}
                        />
                        <label
                          htmlFor="emailToggle"
                          className="toggle-label absolute left-0 w-6 h-6 bg-white rounded-full transition transform translate-x-0 cursor-pointer peer-checked:translate-x-6 peer-checked:bg-primary-DEFAULT"
                        ></label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">
                          SMS Notifications
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Get text messages for important updates
                        </p>
                      </div>
                      <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200 dark:bg-gray-700">
                        <input
                          type="checkbox"
                          id="smsToggle"
                          className="sr-only"
                        />
                        <label
                          htmlFor="smsToggle"
                          className="toggle-label absolute left-0 w-6 h-6 bg-white rounded-full transition transform translate-x-0 cursor-pointer peer-checked:translate-x-6 peer-checked:bg-primary-DEFAULT"
                        ></label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">
                          Marketing Communications
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Receive special offers and recommendations
                        </p>
                      </div>
                      <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200 dark:bg-gray-700">
                        <input
                          type="checkbox"
                          id="marketingToggle"
                          className="sr-only"
                          defaultChecked={true}
                        />
                        <label
                          htmlFor="marketingToggle"
                          className="toggle-label absolute left-0 w-6 h-6 bg-white rounded-full transition transform translate-x-0 cursor-pointer peer-checked:translate-x-6 peer-checked:bg-primary-DEFAULT"
                        ></label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security settings */}
              <div className="bg-white dark:bg-dark-secondary rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <FaShieldAlt className="text-primary-DEFAULT" /> Security
                    Settings
                  </h3>

                  <div className="mt-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">
                          Change Password
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Last changed 3 months ago
                        </p>
                      </div>
                      <button
                        onClick={() => setShowChangePassword(true)}
                        className="px-4 py-2 bg-light-secondary dark:bg-dark-accent text-gray-800 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                      >
                        Update
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">
                          Two-Factor Authentication
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <button className="px-4 py-2 bg-primary-DEFAULT hover:bg-primary-dark text-white rounded-lg transition-colors text-sm font-medium">
                        Set Up
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">
                          Connected Social Accounts
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Login with social accounts
                        </p>
                      </div>
                      <button className="px-4 py-2 bg-light-secondary dark:bg-dark-accent text-gray-800 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium">
                        Manage
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account actions */}
              <div className="bg-white dark:bg-dark-secondary rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                    Account Actions
                  </h3>

                  <div className="mt-4 space-y-4">
                    <button className="flex items-center text-yellow-600 hover:text-yellow-700 font-medium">
                      <span className="mr-2">⚠️</span> Download my data
                    </button>
                    <button className="flex items-center text-red-500 hover:text-red-700 font-medium">
                      <span className="mr-2">🚫</span> Delete my account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-light-secondary dark:bg-dark-primary">
        <div className="w-16 h-16 relative">
          <div className="absolute w-full h-full border-4 border-gray-200 border-opacity-50 rounded-full"></div>
          <div className="absolute w-full h-full border-4 border-primary-DEFAULT border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-light-secondary dark:bg-dark-primary">
        <div className="text-center max-w-md mx-auto p-8 bg-white dark:bg-dark-secondary rounded-2xl shadow-lg">
          <div className="w-20 h-20 bg-primary-light/10 text-primary-DEFAULT rounded-full flex items-center justify-center mx-auto mb-6">
            <FaUser size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Session Expired
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please log in to access your profile and manage your event tickets.
          </p>
          <button className="w-full px-6 py-3 bg-primary-DEFAULT text-white rounded-lg hover:bg-primary-dark transition-all duration-300 font-medium">
            Log In
          </button>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Don't have an account?{" "}
            <a
              href="#"
              className="text-primary-DEFAULT hover:text-primary-dark"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: FaUser },
    { id: "tickets", label: "My Tickets", icon: FaTicketAlt },
    { id: "personal", label: "Profile Info", icon: FaUser },
    { id: "payment", label: "Payment", icon: FaCreditCard },
    { id: "interests", label: "Interests", icon: FaHeart },
    { id: "settings", label: "Settings", icon: FaCog },
  ];

  return (
    <div className="min-h-screen bg-light-secondary dark:bg-dark-primary">
      {/* Profile Header with Gradient */}
      <div className="relative h-72 bg-gradient-to-r from-primary-dark via-primary-DEFAULT to-primary-light animate-gradient-x">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-4">
          <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-white">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary-DEFAULT text-white">
                <span className="text-3xl font-bold">
                  {user.displayName ? user.displayName[0].toUpperCase() : "U"}
                </span>
              </div>
            )}
          </div>
          <h1 className="mt-4 text-3xl font-bold">
            {user.displayName || "User"}
          </h1>
          <p className="text-white/80">
            Member since{" "}
            {user.createdAt ? new Date(user.createdAt).getFullYear() : "2023"}
          </p>
        </div>

        {/* Wave effect at bottom of header */}
        <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="absolute bottom-0 w-full h-16 text-light-secondary dark:text-dark-primary"
            fill="currentColor"
          >
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"></path>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 -mt-8 relative z-10">
        {/* Tabs Navigation */}
        <div className="bg-white dark:bg-dark-secondary rounded-xl shadow-sm mb-8">
          <div className="flex overflow-x-auto hide-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center px-6 py-4 whitespace-nowrap border-b-2 transition-all ${
                  activeTab === tab.id
                    ? "border-primary-DEFAULT text-primary-DEFAULT font-semibold"
                    : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
                }`}
              >
                <tab.icon className="mr-2" size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mb-12">
          <AnimatePresence mode="wait">{renderTabContent()}</AnimatePresence>
        </div>
      </div>

      {/* Change Password Modal - Simplified version */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-dark-secondary rounded-xl p-6 w-full max-w-md shadow-xl"
          >
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              Change Password
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-secondary text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-light focus:border-primary-DEFAULT outline-none transition-all"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-secondary text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-light focus:border-primary-DEFAULT outline-none transition-all"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-secondary text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-light focus:border-primary-DEFAULT outline-none transition-all"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowChangePassword(false)}
                className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-3 bg-primary-DEFAULT hover:bg-primary-dark text-white rounded-lg transition-colors">
                Update Password
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;

// Add this to your CSS to hide scrollbars but allow scrolling
/*
.hide-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
*/
