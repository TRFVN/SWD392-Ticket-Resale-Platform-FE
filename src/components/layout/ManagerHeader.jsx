import React, { useEffect, useRef, useState } from "react";
import { Menu, Bell, Search } from "lucide-react";

const NO_AVATAR =
  "https://sp-ao.shortpixel.ai/client/q_lossless,ret_img,w_250/https://miamistonesource.com/wp-content/uploads/2018/05/no-avatar-25359d55aa3c93ab3466622fd2ce712d1.jpg";

const LANGUAGES = [
  {
    id: 1,
    language: "Tiếng Việt",
    flag: "https://st.quantrimang.com/photos/image/2021/02/04/Hinh-nen-Quoc-Ky-VN-8.jpg",
  },
  {
    id: 2,
    language: "American",
    flag: "https://eurotravel.com.vn/wp-content/uploads/2023/05/quoc-ky-dau-tien-cua-nuoc-my-voi-13-sao-dai-dien-cho-13-bang-ngay-so-khai.png",
  },
];
const ManagerHeader = ({
  onToggleCollapse,
  onToggleMobileSidebar,
  notificationsCount = 20,
}) => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  console.log(userData);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[1]); // Default American
  const langRef = useRef(null);

  const handleLangSelect = (lang) => {
    setSelectedLang(lang);
    setIsLangOpen(false);
    console.log("Selected language:", lang.name);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langRef.current && !langRef.current.contains(event.target)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="flex items-center justify-between bg-manager-secondary p-4 shadow-md text-white">
      {/* SIDEBAR TOGGLE BUTTONS */}
      <div className="flex items-center gap-2">
        <button className="md:hidden" onClick={onToggleMobileSidebar}>
          <Menu />
        </button>
        <button className="hidden md:inline-flex" onClick={onToggleCollapse}>
          <Menu />
        </button>
      </div>

      {/* RIGHT SIDE CONTENT */}
      <div className="flex items-center gap-4 flex-wrap justify-end">
        {/* SEARCH */}
        <div className="relative hidden sm:block">
          <input
            type="text"
            className="bg-transparent text-white border border-manager-third pl-10 pr-4 py-1 rounded-lg focus:outline-none w-40 md:w-56"
            placeholder="Search..."
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white size-4" />
        </div>

        {/* LANGUAGE DROPDOWN */}
        <div className="relative" ref={langRef}>
          <img
            src={selectedLang.flag}
            alt={selectedLang.language}
            className="w-6 h-4 cursor-pointer"
            onClick={() => setIsLangOpen((prev) => !prev)}
          />
          {isLangOpen && (
            <div className="absolute right-0 mt-2 bg-white text-black rounded-md shadow-lg w-40 z-50">
              {LANGUAGES.map((lang) => (
                <div
                  key={lang.id}
                  className={`flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-md ${
                    selectedLang.id === lang.id
                      ? "font-semibold bg-gray-200"
                      : ""
                  }`}
                  onClick={() => handleLangSelect(lang)}
                >
                  <img
                    src={lang.flag}
                    alt={lang.language}
                    className="w-5 h-3"
                  />
                  <span>{lang.language}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* NOTIFICATION ICON */}
        <div className="relative">
          <Bell className="text-white w-6 h-6" />
          {notificationsCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-xs text-white rounded-full w-5 h-5 flex items-center justify-center">
              {notificationsCount}
            </span>
          )}
        </div>

        {/* AVATAR & USER INFO */}
        <div className="flex items-center gap-2">
          <img
            src={NO_AVATAR}
            alt="Avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="hidden sm:flex flex-col text-sm">
            <span className="truncate max-w-[100px]">{userData?.fullName}</span>
            <span className="text-xs text-gray-400 truncate">
              {userData?.roles}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ManagerHeader;
