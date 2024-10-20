import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  FaUser,
  FaCreditCard,
  FaHeart,
  FaCog,
  FaCamera,
  FaEdit,
} from "react-icons/fa";

const ProfilePage = () => {
  const user = useSelector((state) => state.auth.user);
  const [activeTab, setActiveTab] = useState("personal");

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading user data...
      </div>
    );
  }

  const tabs = [
    { id: "personal", label: "Personal Info", icon: <FaUser /> },
    { id: "interests", label: "Interests", icon: <FaHeart /> },
    { id: "payment", label: "Payment Info", icon: <FaCreditCard /> },
    { id: "settings", label: "Settings", icon: <FaCog /> },
  ];

  return (
    <div className="bg-white min-h-screen p-4 sm:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
            <div className="relative">
              <img
                className="h-24 w-24 rounded-full object-cover border-2 border-orange-400"
                src={user.avatarUrl || "https://via.placeholder.com/150"}
                alt={user.fullName}
              />
              <button className="absolute bottom-0 right-0 bg-orange-400 text-white rounded-full p-2 shadow-lg hover:bg-orange-500 transition duration-300">
                <FaCamera size={14} />
              </button>
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                {user.fullName}
              </h1>
              <p className="text-gray-500">{user.roles.join(", ")}</p>
            </div>
          </div>

          <div className="flex flex-wrap -mx-2 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`flex items-center px-4 py-2 m-2 font-medium rounded-full transition-colors duration-300 ${
                  activeTab === tab.id
                    ? "text-white bg-orange-400"
                    : "text-gray-600 bg-gray-100 hover:bg-gray-200"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                <span className="ml-2">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            {activeTab === "personal" && <PersonalInfo user={user} />}
            {activeTab === "interests" && <Interests user={user} />}
            {activeTab === "payment" && <PaymentInfo user={user} />}
            {activeTab === "settings" && <Settings user={user} />}
          </div>
        </div>
      </div>
    </div>
  );
};

const PersonalInfo = ({ user }) => (
  <div className="space-y-4">
    <InfoItem label="Email" value={user.email} />
    <InfoItem label="Phone" value={user.phoneNumber} />
    <InfoItem label="Address" value={user.address} />
    <InfoItem label="CCCD" value={user.cccd} />
    <InfoItem label="Country" value={user.country} />
    <InfoItem
      label="Birthday"
      value={new Date(user.birthDate).toLocaleDateString()}
    />
  </div>
);

const Interests = ({ user }) => (
  <div>
    <h2 className="text-xl font-semibold mb-4">My Interests</h2>
    <div className="flex flex-wrap gap-2">
      {["Travel", "Reading", "Sports", "Music", "Cooking"].map((interest) => (
        <span
          key={interest}
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm"
        >
          {interest}
        </span>
      ))}
    </div>
    <button className="mt-4 text-orange-400 hover:text-orange-500 flex items-center">
      <FaEdit className="mr-2" /> Edit Interests
    </button>
  </div>
);

const PaymentInfo = ({ user }) => (
  <div>
    <h2 className="text-xl font-semibold mb-4">Payment Methods</h2>
    <div className="bg-white p-4 rounded-lg mb-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <FaCreditCard className="text-gray-500 mr-2" />
          <span>•••• •••• •••• 1234</span>
        </div>
        <span className="text-sm text-gray-500">Expires 12/2025</span>
      </div>
    </div>
    <button className="text-orange-400 hover:text-orange-500 flex items-center">
      <FaEdit className="mr-2" /> Manage Payment Methods
    </button>
  </div>
);

const Settings = ({ user }) => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
    <ToggleItem label="Two-factor Authentication" />
    <ToggleItem label="Email Notifications" />
    <ToggleItem label="Profile Visibility" />
  </div>
);

const InfoItem = ({ label, value }) => (
  <div className="flex justify-between items-center border-b border-gray-200 pb-2">
    <span className="text-gray-600">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

const ToggleItem = ({ label }) => (
  <div className="flex items-center justify-between">
    <span className="text-gray-700">{label}</span>
    <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
      <input
        type="checkbox"
        name="toggle"
        id={`toggle-${label}`}
        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
      />
      <label
        htmlFor={`toggle-${label}`}
        className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
      ></label>
    </div>
  </div>
);

export default ProfilePage;
