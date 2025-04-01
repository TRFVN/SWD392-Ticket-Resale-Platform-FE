import React from "react";
import { motion } from "framer-motion";
import { User, Building2 } from "lucide-react";
import { ACCOUNT_TYPES } from "./constants";

export const AccountTypeSelector = ({
  selectedType,
  onChange,
  isDarkMode = true,
}) => {
  const types = [
    {
      id: ACCOUNT_TYPES.INDIVIDUAL,
      icon: User,
      title: "Cá nhân",
      description: "Tài khoản dành cho người dùng cá nhân",
    },
    {
      id: ACCOUNT_TYPES.ORGANIZATION,
      icon: Building2,
      title: "Tổ chức",
      description: "Tài khoản dành cho doanh nghiệp và tổ chức",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {types.map(({ id, icon: Icon, title, description }) => (
        <motion.button
          key={id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onChange(id)}
          className={`relative p-4 rounded-xl border-2 transition-colors text-left
            ${
              selectedType === id
                ? `border-orange-500 ${
                    isDarkMode ? "bg-orange-900/20" : "bg-orange-50"
                  }`
                : `${
                    isDarkMode
                      ? "border-gray-700 hover:border-orange-800"
                      : "border-gray-200 hover:border-orange-200"
                  }`
            }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`p-2 rounded-lg 
              ${
                selectedType === id
                  ? "bg-orange-500 text-white"
                  : `${
                      isDarkMode
                        ? "bg-gray-800 text-gray-400"
                        : "bg-gray-100 text-gray-600"
                    }`
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h3
                className={`font-medium ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {title}
              </h3>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {description}
              </p>
            </div>
          </div>

          {selectedType === id && (
            <motion.div
              layoutId="activeIndicator"
              className="absolute -top-px -right-px -bottom-px w-1 bg-orange-500 rounded-r-xl"
            />
          )}
        </motion.button>
      ))}
    </div>
  );
};
