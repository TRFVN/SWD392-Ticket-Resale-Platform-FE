// ProfilePage.jsx
import React, { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
import { FaUser, FaCreditCard, FaHeart, FaCog } from "react-icons/fa";
import PersonalInfo from "../../components/profile/PersonalInfo";
import Interests from "../../components/profile/Interest";
import PaymentInfo from "../../components/profile/PaymentInfo";
import Settings from "../../components/profile/Settings";
import ProfileHeader from "../../components/profile/ProfileHeader";
import TabButton from "../../components/profile/TabButton";
import ChangePassword from "../auth/ChangePassword";

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

  const handleTabChange = (tabId) => {
    console.log("Tab clicked:", tabId);
    setActiveTab(tabId);
  };

  const handleChangePassword = async (passwordData) => {
    console.log("Changing password:", passwordData);
    setShowChangePassword(false);
  };

  const tabs = [
    { id: "personal", label: "Personal Info", icon: FaUser },
    { id: "interests", label: "Interests", icon: FaHeart },
    { id: "payment", label: "Payment Info", icon: FaCreditCard },
    { id: "settings", label: "Settings", icon: FaCog },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "personal":
        return <PersonalInfo user={user} />;
      case "interests":
        return <Interests />;
      case "payment":
        return <PaymentInfo />;
      case "settings":
        return (
          <Settings
            settings={settings}
            setSettings={setSettings}
            onChangePassword={() => setShowChangePassword(true)}
          />
        );
      default:
        return <PersonalInfo user={user} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="w-16 h-16 relative">
          <div className="absolute w-full h-full border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-xl text-gray-600 dark:text-gray-300 mb-4">
          User not found
        </div>
        <button className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-300">
          Please log in
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="relative">
        {/* Profile Header */}
        <ProfileHeader user={user} />

        {/* Main Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 -mt-12">
          <div className="max-w-4xl mx-auto">
            {/* Tabs Navigation */}
            <div className="relative z-20 flex flex-wrap gap-3 mb-8 p-1">
              {tabs.map((tab) => (
                <TabButton
                  key={tab.id}
                  active={activeTab === tab.id}
                  icon={tab.icon}
                  label={tab.label}
                  onClick={() => handleTabChange(tab.id)}
                />
              ))}
            </div>

            {/* Tab Content */}
            <div className="relative z-10 pointer-events-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm pointer-events-auto"
                >
                  {renderTabContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
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
