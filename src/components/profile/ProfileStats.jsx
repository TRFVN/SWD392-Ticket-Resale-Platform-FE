// Component: ProfileStats.jsx
const ProfileStats = ({ title, value, trend, trendUp }) => {
  return (
    <div className="bg-white dark:bg-dark-secondary rounded-xl p-6 shadow-sm">
      <p className="text-gray-600 dark:text-gray-400 text-sm">{title}</p>
      <h3 className="text-3xl font-bold text-gray-800 dark:text-white mt-1">
        {value}
      </h3>
      {trend && (
        <p
          className={`text-sm mt-2 flex items-center ${
            trendUp === true
              ? "text-green-600"
              : trendUp === false
              ? "text-red-600"
              : "text-gray-600 dark:text-gray-400"
          }`}
        >
          {trendUp === true && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                clipRule="evenodd"
              />
            </svg>
          )}
          {trendUp === false && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12 13a1 1 0 110 2H7a1 1 0 01-1-1v-5a1 1 0 112 0v2.586l4.293-4.293a1 1 0 011.414 0L16 9.586V7a1 1 0 112 0v5a1 1 0 01-1 1h-5z"
                clipRule="evenodd"
              />
            </svg>
          )}
          {trend}
        </p>
      )}
    </div>
  );
};
export default ProfileStats;
