import React from "react";
import { motion } from "framer-motion";
import { User } from "lucide-react";
import { ACCOUNT_TYPES } from "./constants";

export const AccountTypeSelector = ({
  selectedType,
  onChange,
  isDarkMode = true,
}) => {
  // Only individual type is available
  const types = [
    {
      id: ACCOUNT_TYPES.INDIVIDUAL,
      icon: User,
      title: "Người dùng",
      description: "Tài khoản dành cho người dùng cá nhân",
    },
    // Organization option removed
  ];

  // Force to individual account type
  React.useEffect(() => {
    if (selectedType !== ACCOUNT_TYPES.INDIVIDUAL) {
      onChange(ACCOUNT_TYPES.INDIVIDUAL);
    }
  }, [selectedType, onChange]);

  return (
    <div>
      {types.map(({ id, icon: Icon, title, description }) => (
        <motion.div
          key={id}
          className={`relative p-4 rounded-xl border-2 transition-colors text-left
            ${
              isDarkMode
                ? "border-orange-500 bg-orange-900/20"
                : "border-orange-500 bg-orange-50"
            }`}
        >
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-orange-500 text-white">
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
        </motion.div>
      ))}
    </div>
  );
};
