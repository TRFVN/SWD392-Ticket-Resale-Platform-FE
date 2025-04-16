import React, { useState, useEffect, memo, useCallback } from "react";
import { useNavigationItems } from "../../../hooks/useNavigationItems";
import { Ticket, Calendar, MapPin, TrendingUp, PlusCircle } from "lucide-react";

// Icon mapping component
const NavIcon = memo(({ id, isActive }) => {
  const icons = {
    events: Ticket,
    tickets: Calendar,
    venues: MapPin,
    trending: TrendingUp,
    create: PlusCircle,
  };

  const Icon = icons[id];
  if (!Icon) return null;

  return (
    <Icon
      className={`w-4 h-4 ${isActive ? "text-orange-500" : "text-gray-500"}`}
    />
  );
});

NavIcon.displayName = "NavIcon";

/**
 * Desktop Navigation - Simplified for modern UI
 */
const DesktopNav = () => {
  const { navItems, activeTab, setActiveTab, handleNavigation } =
    useNavigationItems();
  const [indicatorProps, setIndicatorProps] = useState({ left: 0, width: 0 });

  // Memoized click handler
  const handleClick = useCallback(
    (id, path, e) => {
      e.preventDefault();
      setActiveTab(id);
      handleNavigation(path);
    },
    [setActiveTab, handleNavigation],
  );

  // Update indicator position
  useEffect(() => {
    const activeElement = document.getElementById(`nav-item-${activeTab}`);
    if (activeElement) {
      const { offsetLeft, offsetWidth } = activeElement;
      setIndicatorProps({
        left: offsetLeft,
        width: offsetWidth,
      });
    }
  }, [activeTab]);

  return (
    <nav className="overflow-hidden max-w-full" aria-label="Điều Hướng Chính">
      <div className="relative flex items-center gap-1 px-1 py-1">
        {/* Simplified indicator */}
        <div
          className="absolute inset-0 h-full bg-orange-500/10 dark:bg-orange-500/20 rounded-lg transition-all duration-300 ease-out"
          style={{
            left: indicatorProps.left,
            width: indicatorProps.width,
          }}
        />

        {/* Navigation Items */}
        <ul className="flex items-center gap-1 relative z-10">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;

            return (
              <li key={item.id} className="flex-shrink-0">
                <a
                  id={`nav-item-${item.id}`}
                  href={item.path}
                  className={`relative group outline-none px-3 py-2 text-sm font-medium 
                    transition-colors flex items-center gap-2 rounded-lg
                    ${
                      isActive
                        ? "text-orange-500"
                        : "text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                    }`}
                  onClick={(e) => handleClick(item.id, item.path, e)}
                  tabIndex="0"
                  role="menuitem"
                  aria-current={isActive ? "page" : undefined}
                >
                  <NavIcon id={item.id} isActive={isActive} />
                  <span className="hidden sm:inline">{item.label}</span>

                  {/* Badge */}
                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.5 text-xs rounded-full 
                        ${
                          isActive
                            ? "bg-orange-500 text-white"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                        }`}
                    >
                      {item.badge}
                    </span>
                  )}

                  {/* Focus indicator */}
                  <div
                    className="absolute inset-0 rounded-lg ring-2 ring-orange-500 ring-opacity-0 
                    group-focus-visible:ring-opacity-50 transition-opacity"
                    aria-hidden="true"
                  />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

// Memoize for better performance
export default memo(DesktopNav);
