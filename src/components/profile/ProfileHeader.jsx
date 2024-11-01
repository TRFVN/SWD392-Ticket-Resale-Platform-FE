import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Camera } from "lucide-react";
import axiosInstance from "../../config/axiosConfig";
import { toast } from "react-toastify";
import { setTokens, setUser } from "../../store/slice/authSlice";

const ProfileHeader = ({ user }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("File", file);

      const response = await axiosInstance.post("/Auth/user/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data && response.data.isSuccess) {
        // Update tokens in Redux store
        dispatch(
          setTokens({
            accessToken: response.data.result.accessToken,
            refreshToken: response.data.result.refreshToken,
          }),
        );

        // Update user data in Redux store with new avatar URL
        dispatch(
          setUser({
            ...currentUser,
            avatarUrl: response.data.result.avatarUrl,
          }),
        );

        toast.success("Avatar updated successfully!");
      } else {
        throw new Error(response.data?.message || "Failed to update avatar");
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to update avatar. Please try again.",
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative">
      <div className="absolute inset-0 h-48 bg-gradient-to-r from-orange-400 to-orange-600 opacity-10"></div>

      <div className="relative pt-12 pb-24 text-center">
        <div className="relative inline-block group">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
            disabled={uploading}
          />

          <div
            onClick={!uploading ? triggerFileInput : undefined}
            className={`p-1 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 
                     transition-all duration-300 ${
                       !uploading &&
                       "cursor-pointer hover:from-orange-500 hover:to-orange-700"
                     }`}
          >
            <div className="relative">
              <img
                src={currentUser.avatarUrl || "https://via.placeholder.com/150"}
                alt={currentUser.fullName}
                className={`w-36 h-36 rounded-full object-cover border-4 border-white 
                         dark:border-gray-800 transition-opacity duration-300
                         ${uploading ? "opacity-50" : "opacity-100"}`}
              />

              {!uploading && (
                <div
                  className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 
                             rounded-full transition-all duration-300 flex items-center justify-center"
                >
                  <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Change Avatar
                  </span>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={!uploading ? triggerFileInput : undefined}
            disabled={uploading}
            className={`absolute bottom-2 right-2 bg-white dark:bg-gray-800 text-orange-500 
                     p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 
                     group-hover:scale-110 
                     ${
                       uploading
                         ? "opacity-50 cursor-not-allowed"
                         : "hover:bg-orange-50"
                     }`}
          >
            <Camera size={18} />
          </button>

          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        <h1 className="mt-6 text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
          {currentUser.fullName}
        </h1>

        <div className="mt-4 flex justify-center gap-3">
          {currentUser.roles.map((role) => (
            <span
              key={role}
              className="px-4 py-1.5 text-sm font-medium bg-gradient-to-r from-orange-50 to-orange-100
                       dark:from-orange-900/30 dark:to-orange-800/30 text-orange-600 dark:text-orange-300
                       rounded-full shadow-sm"
            >
              {role}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
