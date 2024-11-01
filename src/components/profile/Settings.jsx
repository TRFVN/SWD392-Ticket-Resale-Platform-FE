import React from "react";
import { FaShieldAlt, FaBell, FaGlobe, FaLock } from "react-icons/fa";
import ToggleSwitch from "./ToggleSwitch";

const Settings = ({ settings, setSettings, onChangePassword }) => (
  <div className="space-y-8">
    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
      Account Settings
    </h2>

    <div className="space-y-4">
      <ToggleSwitch
        icon={FaShieldAlt}
        label="Two-factor Authentication"
        description="Add an extra layer of security to your account"
        checked={settings.twoFactor}
        onChange={() =>
          setSettings((prev) => ({ ...prev, twoFactor: !prev.twoFactor }))
        }
      />
      <ToggleSwitch
        icon={FaBell}
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
        icon={FaGlobe}
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

    <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-6">
        Security
      </h3>
      <button
        onClick={onChangePassword}
        className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r 
                  from-orange-400 to-orange-500 text-white rounded-xl hover:shadow-lg 
                  hover:shadow-orange-500/20 transition-all duration-300"
      >
        <FaLock className="mr-2" />
        Change Password
      </button>
    </div>
  </div>
);

export default Settings;
