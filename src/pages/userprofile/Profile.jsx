import React, { useContext, useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
import { useSelector } from "react-redux";
import { uploadImageApi } from "../../services/uploadImage";
import { useAuth } from "../../hooks/useAuth";
import {
  User,
  MapPin,
  Globe,
  Calendar,
  Check,
  LogOut,
  Lock,
  Camera,
  Save,
  Loader,
  Building,
  FileText,
  ChevronRight,
  UserCircle,
  Shield,
  Mail,
  Phone,
  CreditCard,
} from "lucide-react";

const ProfilePage = () => {
  const { user, loading } = useContext(AuthContext);
  const { refreshUserData, logout } = useAuth();
  const { updateUserProfile } = useContext(AuthContext);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    birthDate: "",
    address: "",
    cccd: "",
    gender: "",
    country: "",
    organizationName: "",
    taxId: "",
  });
  const [saveStatus, setSaveStatus] = useState(null); // null, 'saving', 'success', 'error'
  const fileInputRef = useRef(null);
  const isDarkMode = useSelector((state) => state.theme?.isDarkMode);

  useEffect(() => {
    if (!user) {
      refreshUserData();
    } else {
      // Initialize form data with user data from API response format
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        birthDate: user.birthDate ? user.birthDate.split("T")[0] : "",
        address: user.address || "",
        cccd: user.cccd || "",
        gender: user.gender || "",
        country: user.country || "",
        organizationName: user.organizationName || "",
        taxId: user.taxId || "",
      });
    }

    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, [refreshUserData, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    try {
      setSaveStatus("saving");

      // Update user profile with context function
      if (updateUserProfile) {
        const result = await updateUserProfile(formData);

        if (result.success) {
          setSaveStatus("success");
        } else {
          throw new Error(result.message || "Failed to update profile");
        }
      } else {
        throw new Error("Update user profile function not available");
      }

      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error("Error saving profile:", error);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const result = await uploadImageApi(file, "user");

      // Update user profile with new photo URL
      if (updateUserProfile) {
        await updateUserProfile({ photoURL: result });
      }

      // Refresh user data to see updated avatar
      await refreshUserData();
      setIsUploading(false);
    } catch (error) {
      console.error("Error uploading avatar:", error);
      setIsUploading(false);
    }
  };

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center h-screen ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="w-12 h-12 border-4 border-t-orange-500 border-opacity-50 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div
        className={`flex items-center justify-center h-screen ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div
          className={`p-8 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } rounded-xl shadow-lg max-w-md w-full text-center`}
        >
          <User
            className={`w-16 h-16 mx-auto mb-4 ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          />
          <h2
            className={`text-xl font-bold mb-2 ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Session Expired
          </h2>
          <p
            className={`mb-6 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            Please log in to access your profile
          </p>
          <button className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors">
            Log In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      } pb-16`}
    >
      {/* Creative Header with Avatar */}
      <div
        className={`${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } relative overflow-hidden`}
      >
        <div
          className={`absolute top-0 left-0 w-full h-16 bg-gradient-to-r ${
            isDarkMode
              ? "from-gray-900 to-gray-700"
              : "from-orange-100 to-orange-50"
          }`}
        ></div>

        <div className="max-w-5xl mx-auto px-4 pt-12 pb-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-end mb-6">
            <div className="relative mb-4 md:mb-0 md:mr-6">
              <div
                className={`w-28 h-28 rounded-full overflow-hidden border-4 ${
                  isDarkMode ? "border-gray-700" : "border-white"
                } shadow-lg transition-all duration-300 group-hover:border-orange-500`}
              >
                {isUploading ? (
                  <div
                    className={`w-full h-full flex items-center justify-center ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    <Loader className="w-8 h-8 animate-spin text-orange-500" />
                  </div>
                ) : user?.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt={user.fullName || "Profile"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-400 to-orange-600">
                    <UserCircle className="w-14 h-14 text-white" />
                  </div>
                )}

                {/* Upload Button */}
                <button
                  onClick={handleAvatarClick}
                  className="absolute bottom-0 right-0 bg-orange-500 p-1.5 rounded-full text-white shadow-md hover:bg-orange-600 transition-all transform hover:scale-110 active:scale-95"
                >
                  <Camera className="w-4 h-4" />
                </button>

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <div className="text-center md:text-left">
              <h1
                className={`text-2xl font-bold ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                {user?.fullName || "User"}
              </h1>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                } flex items-center justify-center md:justify-start mt-1`}
              >
                <Mail className="w-4 h-4 mr-1" />
                {user?.email || ""}
              </p>
            </div>

            <div className="flex-grow"></div>

            <button
              onClick={logout}
              className={`hidden md:flex mt-4 md:mt-0 items-center px-4 py-2 rounded-lg ${
                isDarkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-100 hover:bg-gray-200"
              } transition-all`}
            >
              <LogOut className="w-4 h-4 mr-2 text-red-500" />
              <span
                className={`${isDarkMode ? "text-white" : "text-gray-800"}`}
              >
                Sign Out
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8">
          {/* Personal Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md`}
          >
            <div className="flex items-center justify-between mb-6">
              <h3
                className={`text-lg font-semibold flex items-center ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                <User className="mr-2 h-5 w-5 text-orange-500" />
                Personal Information
              </h3>

              <div className="inline-flex h-7 bg-orange-100 rounded-full px-2 items-center text-orange-700 text-xs font-medium">
                <Shield className="w-3.5 h-3.5 mr-1" />
                Member
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label
                  className={`block text-sm font-medium mb-1 ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  } group-focus-within:text-orange-500 transition-colors`}
                >
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`w-full p-3 pl-10 rounded-lg border ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-200 text-gray-800"
                    } focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
                  />
                </div>
              </div>

              <div className="group">
                <label
                  className={`block text-sm font-medium mb-1 ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  } group-focus-within:text-orange-500 transition-colors`}
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full p-3 pl-10 rounded-lg border ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-200 text-gray-800"
                    } focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
                  />
                </div>
              </div>

              <div className="group">
                <label
                  className={`block text-sm font-medium mb-1 ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  } group-focus-within:text-orange-500 transition-colors`}
                >
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className={`w-full p-3 pl-10 rounded-lg border ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-200 text-gray-800"
                    } focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
                  />
                </div>
              </div>

              <div className="group">
                <label
                  className={`block text-sm font-medium mb-1 ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  } group-focus-within:text-orange-500 transition-colors`}
                >
                  Date of Birth
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    className={`w-full p-3 pl-10 rounded-lg border ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-200 text-gray-800"
                    } focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
                  />
                </div>
              </div>

              <div className="group">
                <label
                  className={`block text-sm font-medium mb-1 ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  } group-focus-within:text-orange-500 transition-colors`}
                >
                  CCCD
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    name="cccd"
                    value={formData.cccd}
                    onChange={handleInputChange}
                    className={`w-full p-3 pl-10 rounded-lg border ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-200 text-gray-800"
                    } focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
                  />
                </div>
              </div>

              <div className="group">
                <label
                  className={`block text-sm font-medium mb-1 ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  } group-focus-within:text-orange-500 transition-colors`}
                >
                  Gender
                </label>
                <div className="relative">
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className={`w-full p-3 pl-4 rounded-lg border appearance-none ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-200 text-gray-800"
                    } focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 text-gray-400 h-4 w-4" />
                </div>
              </div>

              <div className="group md:col-span-2">
                <label
                  className={`block text-sm font-medium mb-1 ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  } group-focus-within:text-orange-500 transition-colors`}
                >
                  Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="2"
                    className={`w-full p-3 pl-10 rounded-lg border ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-200 text-gray-800"
                    } focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none transition-all`}
                  />
                </div>
              </div>

              <div className="group">
                <label
                  className={`block text-sm font-medium mb-1 ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  } group-focus-within:text-orange-500 transition-colors`}
                >
                  Country
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className={`w-full p-3 pl-10 rounded-lg border ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-200 text-gray-800"
                    } focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Organization Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className={`${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md`}
          >
            <div className="flex items-center justify-between mb-6">
              <h3
                className={`text-lg font-semibold flex items-center ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                <Building className="mr-2 h-5 w-5 text-orange-500" />
                Organization Information
              </h3>

              <div className="inline-flex h-7 bg-blue-100 rounded-full px-2 items-center text-blue-700 text-xs font-medium">
                <Shield className="w-3.5 h-3.5 mr-1" />
                Organizer
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label
                  className={`block text-sm font-medium mb-1 ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  } group-focus-within:text-orange-500 transition-colors`}
                >
                  Organization Name
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    name="organizationName"
                    value={formData.organizationName}
                    onChange={handleInputChange}
                    className={`w-full p-3 pl-10 rounded-lg border ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-200 text-gray-800"
                    } focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
                  />
                </div>
              </div>

              <div className="group">
                <label
                  className={`block text-sm font-medium mb-1 ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  } group-focus-within:text-orange-500 transition-colors`}
                >
                  Tax ID
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    name="taxId"
                    value={formData.taxId}
                    onChange={handleInputChange}
                    className={`w-full p-3 pl-10 rounded-lg border ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-200 text-gray-800"
                    } focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Password Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className={`${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md`}
          >
            <h3
              className={`text-lg font-semibold mb-6 flex items-center ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              <Lock className="mr-2 h-5 w-5 text-orange-500" />
              Password & Security
            </h3>

            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="mb-4 md:mb-0">
                <p
                  className={`font-medium ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  Change Password
                </p>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Last updated 3 months ago
                </p>
              </div>
              <button
                className={`inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-sm`}
              >
                <Lock className="w-4 h-4 mr-2" />
                <span>Update Password</span>
              </button>
            </div>
          </motion.div>

          {/* Save Changes Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="flex justify-end mt-2"
          >
            <button
              onClick={handleSaveChanges}
              disabled={saveStatus === "saving"}
              className={`inline-flex items-center px-6 py-3 rounded-lg ${
                saveStatus === "saving"
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
              } text-white transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl`}
            >
              {saveStatus === "saving" ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Saving...
                </>
              ) : saveStatus === "success" ? (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Saved Successfully!
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </motion.div>

          {/* Mobile Sign Out Button */}
          <div className="md:hidden mt-8">
            <button
              onClick={logout}
              className="w-full flex items-center justify-center py-3 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-all"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
