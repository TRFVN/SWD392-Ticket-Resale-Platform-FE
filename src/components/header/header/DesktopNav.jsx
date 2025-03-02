import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigationItems } from "../../../hooks/useNavigationItems";

/**
 * Desktop Navigation
 * Clean, modern navigation with subtle animations
 */
const DesktopNav = ({ hideSecondary = false }) => {
  const { navItems, activeTab, setActiveTab, handleNavigation } =
    useNavigationItems();
  const [indicatorProps, setIndicatorProps] = useState({ left: 0, width: 0 });
  const [hoveredTab, setHoveredTab] = useState(null);

  // Handle navigation item click
  const handleClick = (id, path) => {
    setActiveTab(id);
    handleNavigation(path);
  };

  // Filter items based on priority when space is limited
  const visibleItems = hideSecondary
    ? navItems.filter((item) => !item.secondary)
    : navItems;

  // Prioritize items with badges when space is limited
  const sortedItems = [...visibleItems].sort((a, b) => {
    if (hideSecondary) {
      // Move items with badges to front when in limited space mode
      if (a.badge && !b.badge) return -1;
      if (!a.badge && b.badge) return 1;
    }
    return 0;
  });

  // Update indicator position based on active tab
  useEffect(() => {
    const activeElement = document.getElementById(`nav-item-${activeTab}`);
    if (activeElement) {
      const { offsetLeft, offsetWidth } = activeElement;
      setIndicatorProps({
        left: offsetLeft,
        width: offsetWidth,
      });
    }
  }, [activeTab, hideSecondary]);

  return (
    <nav className="overflow-hidden max-w-full">
      <div className="relative flex items-center px-1 py-1 rounded-full bg-light-secondary/80 dark:bg-dark-secondary/50 backdrop-blur-sm">
        {/* Active tab indicator - animated pill */}
        <motion.div
          className="absolute inset-0 h-full bg-light-primary dark:bg-dark-accent rounded-full shadow-sm z-0"
          initial={false}
          animate={{
            left: indicatorProps.left,
            width: indicatorProps.width,
            opacity: 1,
          }}
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
        />

        {/* Navigation Items */}
        <ul className="flex space-x-0.5 relative z-10">
          {sortedItems.map((item) => (
            <li key={item.id} className="flex-shrink-0">
              <motion.a
                id={`nav-item-${item.id}`}
                href={item.path}
                className={`relative ${
                  hideSecondary ? "px-2 py-1.5" : "px-3 py-2"
                } font-medium text-xs md:text-sm transition-all flex items-center rounded-full whitespace-nowrap ${
                  activeTab === item.id
                    ? "text-primary"
                    : "text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleClick(item.id, item.path);
                }}
                onMouseEnter={() => setHoveredTab(item.id)}
                onMouseLeave={() => setHoveredTab(null)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Item label with subtle icon animations */}
                <div className="flex items-center">
                  {/* Icon mapping for navigation items */}
                  {(() => {
                    let Icon;
                    switch (item.id) {
                      case "events":
                        Icon = () => (
                          <svg
                            className="w-3.5 h-3.5 mr-1"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M9 14L15 8M10.5 8.5H10.51M13.5 11.5H13.51M19 21V5C19 3.89543 18.1046 3 17 3H7C5.89543 3 5 3.89543 5 5V21L8.5 19L12 21L15.5 19L19 21Z"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        );
                        break;
                      case "tickets":
                        Icon = () => (
                          <svg
                            className="w-3.5 h-3.5 mr-1"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M15 5V7M15 11V13M15 17V19M5 5C3.89543 5 3 5.89543 3 7V10C4.10457 10 5 10.8954 5 12C5 13.1046 4.10457 14 3 14V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V14C19.8954 14 19 13.1046 19 12C19 10.8954 19.8954 10 21 10V7C21 5.89543 20.1046 5 19 5H5Z"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        );
                        break;
                      case "venues":
                        Icon = () => (
                          <svg
                            className="w-3.5 h-3.5 mr-1"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M17.6569 16.6569C16.7202 17.5935 15.4616 18.1716 14.1229 18.2803C12.7843 18.389 11.4458 18.0183 10.3598 17.2366C9.27373 16.4549 8.51014 15.3171 8.19672 14.0224C7.8833 12.7278 8.04313 11.3664 8.64113 10.1747C9.23913 8.98301 10.2362 8.05845 11.4393 7.55872C12.6423 7.05899 13.9693 7.01433 15.1983 7.43427C16.4273 7.85421 17.4637 8.70258 18.1127 9.83349C18.7616 10.9644 18.9791 12.2872 18.7212 13.5621L21.8232 16.6641L20.4142 18.0731L17.6569 16.6569Z"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M15 11C15 12.6569 13.6569 14 12 14C10.3431 14 9 12.6569 9 11C9 9.34315 10.3431 8 12 8C13.6569 8 15 9.34315 15 11Z"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M12 4V5M4 12H5M6.34315 6.34315L7.05025 7.05025M17.6569 6.34315L16.9498 7.05025"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        );
                        break;
                      case "trending":
                        Icon = () => (
                          <svg
                            className="w-3.5 h-3.5 mr-1"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M13 7H21M13 17H21M6 7V17M6 7L11 12L6 17"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        );
                        break;
                      case "create":
                        Icon = () => (
                          <svg
                            className="w-3.5 h-3.5 mr-1"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12 4V20M20 12H4"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        );
                        break;
                      default:
                        Icon = null;
                    }
                    return Icon ? <Icon /> : null;
                  })()}
                  {item.label}
                </div>

                {/* Badge with animation (if present) */}
                {item.badge && (
                  <motion.span
                    className={`ml-1 px-1 py-0.5 text-[0.6rem] rounded-full bg-primary text-white ${
                      hideSecondary ? "text-[0.55rem]" : ""
                    }`}
                    initial={{ scale: 1 }}
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "loop",
                    }}
                  >
                    {item.badge}
                  </motion.span>
                )}

                {/* Subtle dot indicator for active item */}
                {activeTab === item.id && (
                  <motion.span
                    className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    layoutId="activeNavDot"
                  />
                )}
              </motion.a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default DesktopNav;
