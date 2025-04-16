import React from "react";
import { Ticket } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Modern, minimal logo component
 */
const HeaderLogo = ({ condensed = false }) => {
  return (
    <div className="flex items-center group transition-transform duration-200 hover:translate-y-[-2px]">
      <Link to="/" className="flex items-center">
        <div className="relative flex mr-2">
          {/* Logo with simplified background */}
          <div className="bg-gradient-to-r from-primary-light to-primary p-1.5 rounded-lg">
            <Ticket size={16} className="text-white" />
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center">
            <span className="text-base font-bold tracking-tight text-gray-900 dark:text-white">
              Ticket<span className="text-primary">Hub</span>
            </span>
            {/* Badge - hide on condensed mode */}
            {!condensed && (
              <span className="ml-1 text-[0.55rem] px-1 py-0.5 rounded-full bg-primary/10 text-primary uppercase font-semibold tracking-wider">
                Pro
              </span>
            )}
          </div>
          {/* Subtitle - hide on condensed mode */}
          {!condensed && (
            <span className="text-[0.6rem] text-gray-500 dark:text-gray-400 block">
              Nền tảng vé cao cấp
            </span>
          )}
        </div>
      </Link>
    </div>
  );
};

export default HeaderLogo;
