// Component: TabMenu.jsx
const TabMenu = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="bg-white dark:bg-dark-secondary rounded-xl shadow-sm mb-8">
      <div className="flex overflow-x-auto hide-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center px-6 py-4 whitespace-nowrap border-b-2 transition-all ${
              activeTab === tab.id
                ? "border-primary-DEFAULT text-primary-DEFAULT font-semibold"
                : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
            }`}
          >
            <tab.icon className="mr-2" size={16} />
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};
export default TabMenu;
