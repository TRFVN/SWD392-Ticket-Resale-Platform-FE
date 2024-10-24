import React, { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
import {
  FaUser,
  FaCreditCard,
  FaHeart,
  FaCog,
  FaCamera,
  FaEdit,
  FaLock,
  FaUserCircle,
  FaPhone,
  FaMapMarkerAlt,
  FaIdCard,
  FaFlag,
  FaBirthdayCake,
  FaShieldAlt,
  FaBell,
  FaGlobe,
} from "react-icons/fa";
import ChangePassword from "../auth/ChangePassword";

// Subtle fade animation
const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.2 },
};

const TabButton = ({ active, icon, label, onClick }) => (
  <button
    className={`flex items-center px-6 py-3 font-medium rounded-xl transition-colors duration-200 
      ${
        active
          ? "text-white bg-gradient-to-r from-orange-400 to-orange-500"
          : "text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800"
      }`}
    onClick={onClick}
  >
    <span className={`${active ? "opacity-100" : "opacity-70"}`}>{icon}</span>
    <span className="ml-3">{label}</span>
  </button>
);

const InfoItem = ({ icon, label, value }) => (
  <div className="flex justify-between items-center p-5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
    <div className="flex items-center space-x-4">
      <div className="text-orange-400 text-lg">{icon}</div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="font-medium text-gray-900 dark:text-white mt-1">
          {value}
        </p>
      </div>
    </div>
  </div>
);

const ToggleSwitch = ({ icon, label, description, checked, onChange }) => (
  <div className="flex items-center justify-between p-5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
    <div className="flex items-start space-x-4">
      <div className="text-orange-400 text-lg pt-1">{icon}</div>
      <div>
        <p className="font-medium text-gray-900 dark:text-white">{label}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {description}
        </p>
      </div>
    </div>
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={onChange}
      />
      <div
        className="w-11 h-6 bg-gray-300 rounded-full peer dark:bg-gray-600 
                    peer-checked:after:translate-x-full after:content-[''] 
                    after:absolute after:top-[2px] after:left-[2px] 
                    after:bg-white after:rounded-full after:h-5 after:w-5 
                    after:transition-all dark:border-gray-600 
                    peer-checked:bg-orange-400"
      ></div>
    </label>
  </div>
);

const ProfilePage = () => {
  const { user, loading, refreshUserData } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("personal");
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [settings, setSettings] = useState({
    twoFactor: false,
    emailNotifications: true,
    profileVisibility: true,
  });

  useEffect(() => {
    if (!user) {
      refreshUserData();
    }
  }, [refreshUserData, user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen dark:bg-gray-900">
        <div className="w-16 h-16 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen dark:bg-gray-900 dark:text-gray-200">
        User not found. Please log in.
      </div>
    );
  }

  const handleChangePassword = async (passwordData) => {
    console.log("Changing password:", passwordData);
    setShowChangePassword(false);
  };

  const tabs = [
    { id: "personal", label: "Personal Info", icon: <FaUser /> },
    { id: "interests", label: "Interests", icon: <FaHeart /> },
    { id: "payment", label: "Payment Info", icon: <FaCreditCard /> },
    { id: "settings", label: "Settings", icon: <FaCog /> },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Profile Header */}
        <div className="mb-12 text-center">
          <div className="relative inline-block">
            <img
              src={user.avatarUrl || "https://via.placeholder.com/150"}
              alt={user.fullName}
              className="w-32 h-32 rounded-full object-cover border-4 border-orange-400 dark:border-orange-500"
            />
            <button className="absolute bottom-0 right-0 bg-orange-400 dark:bg-orange-500 text-white p-3 rounded-full shadow-lg">
              <FaCamera size={16} />
            </button>
          </div>
          <h1 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            {user.fullName}
          </h1>
          <div className="mt-3 flex justify-center gap-2">
            {user.roles.map((role) => (
              <span
                key={role}
                className="px-4 py-1.5 text-sm font-medium bg-orange-100 dark:bg-orange-900/30 
                          text-orange-600 dark:text-orange-300 rounded-full"
              >
                {role}
              </span>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {/* Tabs */}
          <div className="flex flex-wrap gap-3 mb-8">
            {tabs.map((tab) => (
              <TabButton
                key={tab.id}
                active={activeTab === tab.id}
                icon={tab.icon}
                label={tab.label}
                onClick={() => setActiveTab(tab.id)}
              />
            ))}
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            {...fadeIn}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700"
          >
            {activeTab === "personal" && (
              <div className="grid gap-4 md:grid-cols-2">
                <InfoItem
                  icon={<FaUserCircle />}
                  label="Email"
                  value={user.email}
                />
                <InfoItem
                  icon={<FaPhone />}
                  label="Phone"
                  value={user.phoneNumber}
                />
                <InfoItem
                  icon={<FaMapMarkerAlt />}
                  label="Address"
                  value={user.address}
                />
                <InfoItem icon={<FaIdCard />} label="CCCD" value={user.cccd} />
                <InfoItem
                  icon={<FaFlag />}
                  label="Country"
                  value={user.country}
                />
                <InfoItem
                  icon={<FaBirthdayCake />}
                  label="Birthday"
                  value={new Date(user.birthDate).toLocaleDateString()}
                />
              </div>
            )}

            {activeTab === "interests" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Interests
                  </h2>
                  <button className="flex items-center text-orange-400 space-x-2">
                    <FaEdit />
                    <span>Edit</span>
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    "Travel",
                    "Reading",
                    "Sports",
                    "Music",
                    "Cooking",
                    "Gaming",
                  ].map((interest) => (
                    <div
                      key={interest}
                      className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 
                              dark:border-gray-700 text-center"
                    >
                      <span className="text-gray-800 dark:text-gray-200">
                        {interest}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "payment" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Payment Methods
                  </h2>
                  <button className="flex items-center text-orange-400 space-x-2">
                    <FaEdit />
                    <span>Manage</span>
                  </button>
                </div>
                <div className="p-6 rounded-xl bg-gradient-to-r from-gray-800 to-gray-900 text-white">
                  <div className="flex justify-between items-start mb-8">
                    <FaCreditCard size={24} />
                    <span className="text-gray-300">Visa</span>
                  </div>
                  <div className="text-2xl mb-6">•••• •••• •••• 1234</div>
                  <div className="flex justify-between text-sm">
                    <span>John Doe</span>
                    <span>12/25</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Account Settings
                </h2>
                <div className="space-y-4">
                  <ToggleSwitch
                    icon={<FaShieldAlt />}
                    label="Two-factor Authentication"
                    description="Add an extra layer of security to your account"
                    checked={settings.twoFactor}
                    onChange={() =>
                      setSettings((prev) => ({
                        ...prev,
                        twoFactor: !prev.twoFactor,
                      }))
                    }
                  />
                  <ToggleSwitch
                    icon={<FaBell />}
                    label="Email Notifications"
                    description="Receive updates about your account activity"
                    checked={settings.emailNotifications}
                    onChange={() =>
                      setSettings((prev) => ({
                        ...prev,
                        emailNotifications: !prev.emailNotifications,
                      }))
                    }
                  />
                  <ToggleSwitch
                    icon={<FaGlobe />}
                    label="Profile Visibility"
                    description="Control who can see your profile"
                    checked={settings.profileVisibility}
                    onChange={() =>
                      setSettings((prev) => ({
                        ...prev,
                        profileVisibility: !prev.profileVisibility,
                      }))
                    }
                  />
                </div>
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Security
                  </h3>
                  <button
                    onClick={() => setShowChangePassword(true)}
                    className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r 
                            from-orange-400 to-orange-500 text-white rounded-xl"
                  >
                    <FaLock className="mr-2" />
                    Change Password
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePassword && (
        <ChangePassword
          onClose={() => setShowChangePassword(false)}
          onSubmit={handleChangePassword}
        />
      )}
    </div>
  );
};

export default ProfilePage;
