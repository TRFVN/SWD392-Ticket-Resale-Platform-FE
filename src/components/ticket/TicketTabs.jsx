import React from "react";
import { Ticket, MessageSquare, Tag } from "lucide-react"; // Import icons

const TicketTabs = ({ activeTab, onTabChange, counts }) => {
  const tabs = [
    {
      id: "purchased",
      label: "Purchased",
      icon: Ticket,
      count: counts?.purchased,
    },
    {
      id: "negotiating",
      label: "Negotiating",
      icon: MessageSquare,
      count: counts?.negotiating,
    },
    { id: "selling", label: "Selling", icon: Tag, count: counts?.selling },
  ];

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <nav className="flex space-x-8 px-6" aria-label="Tabs">
        {tabs.map(({ id, label, icon: Icon, count }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
              ${
                activeTab === id
                  ? "border-orange-500 text-orange-600 dark:text-orange-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
          >
            <Icon size={18} />
            <span>{label}</span>
            {count > 0 && (
              <span className="ml-2 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full text-xs">
                {count}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default TicketTabs;
