/**
 * Get category badge color based on category name
 */
export const getCategoryBadgeColor = (categoryName, isDarkMode) => {
  if (!categoryName) return "";

  switch (categoryName) {
    case "VIP":
      return isDarkMode
        ? "bg-purple-800/30 text-purple-400"
        : "bg-purple-100 text-purple-600";
    case "Standard":
      return isDarkMode
        ? "bg-blue-800/30 text-blue-400"
        : "bg-blue-100 text-blue-600";
    default:
      return isDarkMode
        ? "bg-green-800/30 text-green-400"
        : "bg-green-100 text-green-600";
  }
};

/**
 * Get background gradient based on ticket type
 */
export const getBackgroundGradient = (categoryName) => {
  if (!categoryName) return "from-gray-800 to-gray-900";

  switch (categoryName) {
    case "VIP":
      return "from-purple-600 to-purple-900";
    case "Standard":
      return "from-blue-600 to-blue-900";
    default:
      return "from-green-600 to-teal-800";
  }
};

/**
 * Get color for category visualization
 */
export const getCategoryColor = (category) => {
  switch (category) {
    case "VIP":
      return "bg-purple-500";
    case "Standard":
      return "bg-blue-500";
    default:
      return "bg-green-500";
  }
};

/**
 * Extract unique categories from tickets
 */
export const getUniqueCategories = (tickets) => {
  if (!tickets || !tickets.length) return [];
  return [...new Set(tickets.map((t) => t.categoryName).filter(Boolean))];
};
