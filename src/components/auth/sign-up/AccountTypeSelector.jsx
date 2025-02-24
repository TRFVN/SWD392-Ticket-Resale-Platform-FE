import React from "react";
import { motion } from "framer-motion";
import { User, Building2 } from "lucide-react";
import { ACCOUNT_TYPES } from "./constants";

export const AccountTypeSelector = ({ selectedType, onChange }) => {
  const types = [
    {
      id: ACCOUNT_TYPES.INDIVIDUAL,
      icon: User,
      title: "Individual",
      description: "Personal account for individual use",
    },
    {
      id: ACCOUNT_TYPES.ORGANIZATION,
      icon: Building2,
      title: "Organization",
      description: "Business account for organizations",
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
                ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                : "border-gray-200 dark:border-gray-700 hover:border-orange-200 dark:hover:border-orange-800"
            }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`p-2 rounded-lg 
              ${
                selectedType === id
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                {title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
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
