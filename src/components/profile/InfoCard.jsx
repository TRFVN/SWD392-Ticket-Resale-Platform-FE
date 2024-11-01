import React from "react";

const InfoCard = ({ icon: Icon, label, value }) => (
  <div
    className="group p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 
                  hover:shadow-lg transition-all duration-300 hover:border-orange-300 dark:hover:border-orange-500"
  >
    <div className="flex items-start space-x-4">
      <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-900/20 text-orange-500">
        <Icon size={20} />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {label}
        </p>
        <p className="mt-1 font-semibold text-gray-900 dark:text-white">
          {value}
        </p>
      </div>
    </div>
  </div>
);
export default InfoCard;
