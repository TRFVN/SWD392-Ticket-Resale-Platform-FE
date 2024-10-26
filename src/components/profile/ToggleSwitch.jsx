import React from "react";

const ToggleSwitch = ({
  icon: Icon,
  label,
  description,
  checked,
  onChange,
}) => (
  <div
    className="group p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 
                  hover:shadow-lg transition-all duration-300"
  >
    <div className="flex items-start justify-between">
      <div className="flex items-start space-x-4">
        <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-900/20 text-orange-500">
          <Icon size={20} />
        </div>
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{label}</p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        </div>
      </div>

      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={onChange}
        />
        <div
          className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
                      peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer 
                      dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:bg-orange-400 
                      after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white 
                      after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600"
        ></div>
      </label>
    </div>
  </div>
);

export default ToggleSwitch;
