/**
 * Format a date string to a readable format
 */
export const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  } catch (e) {
    return dateString || "No date";
  }
};

/**
 * Calculate days remaining until a date
 */
export const getDaysRemaining = (dateString) => {
  if (!dateString) return null;

  const eventDate = new Date(dateString);
  const today = new Date();

  // Reset time to get accurate day difference
  eventDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = eventDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays > 0 ? diffDays : null;
};

/**
 * Group tickets by month
 */
export const groupTicketsByMonth = (tickets) => {
  const ticketsByMonth = {};

  tickets.forEach((ticket) => {
    if (!ticket.eventDate) return;

    const date = new Date(ticket.eventDate);
    const month = date.getMonth();
    const year = date.getFullYear();
    const key = `${year}-${month}`;

    if (!ticketsByMonth[key]) {
      ticketsByMonth[key] = [];
    }

    ticketsByMonth[key].push(ticket);
  });

  return ticketsByMonth;
};

/**
 * Group tickets by date
 */
export const groupTicketsByDate = (tickets) => {
  const ticketsByDate = {};

  tickets.forEach((ticket) => {
    if (!ticket.eventDate) return;

    const date = new Date(ticket.eventDate);
    const dateStr = date.toISOString().split("T")[0];

    if (!ticketsByDate[dateStr]) {
      ticketsByDate[dateStr] = [];
    }

    ticketsByDate[dateStr].push(ticket);
  });

  return ticketsByDate;
};

/**
 * Get calendar data for current month
 */
export const getCalendarData = () => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get first day of month and total days in month
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Day names
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Generate days array
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Add empty cells for days before first day of month
  const emptyCells = Array.from({ length: firstDay }, (_, i) => null);
  const allCells = [...emptyCells, ...days];

  // Calculate rows (weeks)
  const rows = [];
  for (let i = 0; i < allCells.length; i += 7) {
    rows.push(allCells.slice(i, i + 7));
  }

  return {
    currentMonth,
    currentYear,
    rows,
    dayNames,
    monthName: new Date().toLocaleString("default", { month: "long" }),
  };
};

/**
 * Generate next 6 months data
 */
export const getNextSixMonths = () => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const months = [];
  // Generate 6 months starting from current month
  for (let i = 0; i < 6; i++) {
    const month = (currentMonth + i) % 12;
    const year = currentYear + Math.floor((currentMonth + i) / 12);
    months.push({ month, year });
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return { months, monthNames };
};
