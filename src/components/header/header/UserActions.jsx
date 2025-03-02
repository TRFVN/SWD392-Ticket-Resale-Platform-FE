import React from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

const ActionButton = ({ action, onClick }) => {
  return (
    <button
      onClick={() => onClick(action.path)}
      className="relative p-2.5 rounded-full bg-gray-100/80 dark:bg-gray-800/80
                text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700
                hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-300
                focus:outline-none focus:ring-2 focus:ring-orange-500/30 dark:focus:ring-orange-400/30"
      aria-label={action.label}
    >
      <action.icon size={18} />

      {/* Badge for notifications, cart items, etc. */}
      {action.badge && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute -top-1 -right-1 min-w-5 h-5 flex items-center justify-center
                    px-1 text-xs font-medium text-white bg-gradient-to-r from-orange-500 to-red-500
                    rounded-full shadow-sm border border-white/20 dark:border-gray-900/50"
        >
          {action.badge}
        </motion.span>
      )}
    </button>
  );
};

const CreateButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl 
                bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700
                text-white font-medium shadow-sm hover:shadow-md transition-all duration-300
                focus:outline-none focus:ring-2 focus:ring-orange-500/50"
    >
      <Plus size={16} />
      <span className="text-sm">Tạo Vé</span>
    </button>
  );
};

const UserActions = ({ userActions, onActionClick, onCreateClick }) => {
  return (
    <div className="hidden md:flex items-center gap-2">
      {userActions.map((action) => (
        <ActionButton
          key={action.path}
          action={action}
          onClick={onActionClick}
        />
      ))}
      <CreateButton onClick={() => onActionClick("/create-ticket")} />
    </div>
  );
};

export default UserActions;
