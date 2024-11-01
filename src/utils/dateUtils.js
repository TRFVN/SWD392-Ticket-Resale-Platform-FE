// src/utils/dateUtils.js
export const formatDate = (dateString) => {
  try {
    // Check if dateString is valid
    if (!dateString || dateString === "0001-01-01T00:00:00") {
      return "Not specified";
    }

    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }

    return new Intl.DateTimeFormat("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch (error) {
    console.error("Date formatting error:", error);
    return "Invalid date";
  }
};
