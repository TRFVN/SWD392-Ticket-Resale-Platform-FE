import React from "react";
import { FaEdit } from "react-icons/fa";

const Interests = () => (
  <div className="space-y-8">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
        Interests
      </h2>
      <button
        className="flex items-center space-x-2 px-4 py-2 text-orange-500 hover:bg-orange-50 
                        dark:hover:bg-orange-900/20 rounded-lg transition-colors duration-200"
      >
        <FaEdit size={16} />
        <span>Edit</span>
      </button>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {["Travel", "Reading", "Sports", "Music", "Cooking", "Gaming"].map(
        (interest) => (
          <div
            key={interest}
            className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 
                    dark:border-gray-700 text-center hover:border-orange-300 
                    dark:hover:border-orange-500 transition-all duration-300 
                    hover:shadow-lg group cursor-pointer"
          >
            <span
              className="text-gray-800 dark:text-gray-200 group-hover:text-orange-500 
                          transition-colors duration-200"
            >
              {interest}
            </span>
          </div>
        ),
      )}
    </div>
  </div>
);

export default Interests;
