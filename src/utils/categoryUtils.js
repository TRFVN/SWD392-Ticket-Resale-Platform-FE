// Utility function to get category badge color
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
