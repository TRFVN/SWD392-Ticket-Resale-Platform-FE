import React, { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useSelector } from "react-redux";
import { uploadImageApi } from "../../services/uploadImage";
import { useAuth } from "../../hooks/useAuth";
import {
  User,
  Calendar,
  Check,
  LogOut,
  Lock,
  Camera,
  Save,
  Loader,
  UserCircle,
  Mail,
  Phone,
  CreditCard,
  ArrowRight,
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
  });
  const [saveStatus, setSaveStatus] = useState(null); // null, 'saving', 'success', 'error'
  const fileInputRef = useRef(null);
  const isDarkMode = useSelector((state) => state.theme?.isDarkMode);

  useEffect(() => {
    if (!user) {
      refreshUserData();
    } else {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        birthDate: user.birthDate ? user.birthDate.split("T")[0] : "",
        address: user.address || "",
        cccd: user.cccd || "",
        gender: user.gender || "",
        country: user.country || "",
      });
    }

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

      if (updateUserProfile) {
        const result = await updateUserProfile(formData);

        if (result.success) {
          setSaveStatus("success");
        } else {
          throw new Error(result.message || "Không thể cập nhật thông tin");
        }
      } else {
        throw new Error("Chức năng cập nhật thông tin không có sẵn");
      }

      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error("Lỗi khi lưu thông tin:", error);
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

      if (updateUserProfile) {
        await updateUserProfile({ photoURL: result });
      }

      await refreshUserData();
      setIsUploading(false);
    } catch (error) {
      console.error("Lỗi khi tải ảnh:", error);
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
        <div className="w-10 h-10 border-4 border-t-orange-500 border-opacity-50 rounded-full animate-spin"></div>
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
          className={`p-6 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } rounded-xl shadow-md max-w-md w-full text-center`}
        >
          <User
            className={`w-14 h-14 mx-auto mb-3 ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          />
          <h2
            className={`text-xl font-bold mb-2 ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Phiên đăng nhập hết hạn
          </h2>
          <p
            className={`mb-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            Vui lòng đăng nhập để truy cập trang cá nhân
          </p>
          <button className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors">
            Đăng nhập
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      } pb-10`}
    >
      {/* Header */}
      <div
        className={`${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } shadow-sm border-b ${
          isDarkMode ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div
                className={`w-10 h-10 rounded-full overflow-hidden border ${
                  isDarkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                {isUploading ? (
                  <div
                    className={`w-full h-full flex items-center justify-center ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    <Loader className="w-4 h-4 animate-spin text-orange-500" />
                  </div>
                ) : user?.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt={user.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-orange-500">
                    <UserCircle className="w-6 h-6 text-white" />
                  </div>
                )}
              </div>
            </div>
            <h1
              className={`text-base font-medium ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Trang cá nhân
            </h1>
          </div>

          <button
            onClick={logout}
            className={`flex items-center px-2.5 py-1.5 rounded-lg text-sm ${
              isDarkMode
                ? "bg-gray-700 text-white"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            <LogOut className="w-3.5 h-3.5 mr-1 text-orange-500" />
            Đăng xuất
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Thông tin cá nhân */}
        <div
          className={`mb-5 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } rounded-xl shadow-sm p-5 text-center`}
        >
          <div className="relative inline-block mb-3">
            <div
              className={`w-20 h-20 rounded-full overflow-hidden border-2 ${
                isDarkMode ? "border-gray-700" : "border-white"
              } shadow mx-auto`}
            >
              {isUploading ? (
                <div
                  className={`w-full h-full flex items-center justify-center ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  <Loader className="w-6 h-6 animate-spin text-orange-500" />
                </div>
              ) : user?.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt={user.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-orange-500">
                  <UserCircle className="w-10 h-10 text-white" />
                </div>
              )}
            </div>

            <button
              onClick={handleAvatarClick}
              className="absolute bottom-0 right-0 bg-orange-500 p-1.5 rounded-full text-white shadow-sm hover:bg-orange-600"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <h2
            className={`text-lg font-bold ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
          >
            {user?.fullName || "Người dùng"}
          </h2>

          <p
            className={`text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            } flex items-center justify-center`}
          >
            <Mail className="w-3.5 h-3.5 mr-1" />
            {user?.email || ""}
          </p>
        </div>

        <div
          className={`mb-5 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } rounded-xl shadow-sm p-5`}
        >
          <h3
            className={`text-base font-medium mb-4 ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Thông tin cá nhân
          </h3>

          <div className="space-y-4">
            <div>
              <label
                className={`block text-sm mb-1 ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Họ và tên
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className={`w-full p-2.5 rounded-lg border ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-200 text-gray-800"
                } focus:ring-1 focus:ring-orange-500 focus:border-transparent`}
                placeholder="Nhập họ và tên"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  className={`block text-sm mb-1 ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full p-2.5 rounded-lg border ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-200 text-gray-800"
                  } focus:ring-1 focus:ring-orange-500 focus:border-transparent`}
                  placeholder="Nhập email"
                />
              </div>

              <div>
                <label
                  className={`block text-sm mb-1 ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className={`w-full p-2.5 rounded-lg border ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-200 text-gray-800"
                  } focus:ring-1 focus:ring-orange-500 focus:border-transparent`}
                  placeholder="Nhập số điện thoại"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  className={`block text-sm mb-1 ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Ngày sinh
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  className={`w-full p-2.5 rounded-lg border ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-200 text-gray-800"
                  } focus:ring-1 focus:ring-orange-500 focus:border-transparent`}
                />
              </div>

              <div>
                <label
                  className={`block text-sm mb-1 ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Giới tính
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className={`w-full p-2.5 rounded-lg border ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-200 text-gray-800"
                  } focus:ring-1 focus:ring-orange-500 focus:border-transparent`}
                >
                  <option value="">Chọn giới tính</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  className={`block text-sm mb-1 ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  CCCD/CMND
                </label>
                <input
                  type="text"
                  name="cccd"
                  value={formData.cccd}
                  onChange={handleInputChange}
                  className={`w-full p-2.5 rounded-lg border ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-200 text-gray-800"
                  } focus:ring-1 focus:ring-orange-500 focus:border-transparent`}
                  placeholder="Nhập số CCCD/CMND"
                />
              </div>

              <div>
                <label
                  className={`block text-sm mb-1 ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Quốc gia
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className={`w-full p-2.5 rounded-lg border ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-200 text-gray-800"
                  } focus:ring-1 focus:ring-orange-500 focus:border-transparent`}
                  placeholder="Nhập quốc gia"
                />
              </div>
            </div>

            <div>
              <label
                className={`block text-sm mb-1 ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Địa chỉ
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows="2"
                className={`w-full p-2.5 rounded-lg border ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-200 text-gray-800"
                } focus:ring-1 focus:ring-orange-500 focus:border-transparent resize-none`}
                placeholder="Nhập địa chỉ đầy đủ"
              />
            </div>
          </div>
        </div>

        {/* Mật khẩu */}
        <div
          className={`mb-5 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } rounded-xl shadow-sm p-5`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3
                className={`text-base font-medium ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                Bảo mật tài khoản
              </h3>
              <p
                className={`text-xs mt-0.5 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Thay đổi mật khẩu và cài đặt bảo mật
              </p>
            </div>
            <button
              className={`flex items-center justify-center p-1.5 rounded-lg ${
                isDarkMode ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              <ArrowRight className="w-4 h-4 text-orange-500" />
            </button>
          </div>
        </div>

        {/* Nút Lưu */}
        <div className="flex justify-center mt-4">
          <button
            onClick={handleSaveChanges}
            disabled={saveStatus === "saving"}
            className={`w-full sm:w-48 flex items-center justify-center py-2.5 px-4 rounded-lg font-medium ${
              saveStatus === "saving"
                ? "bg-gray-400 cursor-not-allowed"
                : saveStatus === "success"
                ? "bg-green-500 hover:bg-green-600"
                : "bg-orange-500 hover:bg-orange-600"
            } text-white shadow-sm`}
          >
            {saveStatus === "saving" ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Đang lưu...
              </>
            ) : saveStatus === "success" ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Đã lưu thành công!
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Lưu thay đổi
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
