/**
 * Format price to Vietnamese currency
 */
export const formatCurrency = (price, compact = false) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: compact ? 1 : 0,
  }).format(price || 0);
};

/**
 * Calculate statistics from tickets
 */
export const calculateTicketStats = (tickets) => {
  // Total spent
  const totalSpent = tickets.reduce((sum, t) => sum + (t.ticketPrice || 0), 0);

  // Group by category
  const categoryData = {};
  tickets.forEach((ticket) => {
    const category = ticket.categoryName || "Uncategorized";
    if (!categoryData[category]) {
      categoryData[category] = {
        count: 0,
        total: 0,
      };
    }
    categoryData[category].count++;
    categoryData[category].total += ticket.ticketPrice || 0;
  });

  // Format to percentage for visualization
  const categoryPercentages = Object.entries(categoryData).map(
    ([name, data]) => ({
      name,
      percentage: Math.round((data.count / tickets.length) * 100),
      count: data.count,
      total: data.total,
      spendingPercentage: Math.round((data.total / totalSpent) * 100),
    }),
  );

  // Get unique cities
  const cities = [...new Set(tickets.map((t) => t.city).filter(Boolean))];

  // Group tickets by city
  const ticketsByCity = {};
  tickets.forEach((ticket) => {
    if (!ticket.city) return;

    if (!ticketsByCity[ticket.city]) {
      ticketsByCity[ticket.city] = [];
    }

    ticketsByCity[ticket.city].push(ticket);
  });

  // Calculate upcoming and past tickets
  const upcomingTickets = tickets.filter(
    (t) => new Date(t.eventDate) > new Date(),
  );

  const pastTickets = tickets.filter(
    (t) => new Date(t.eventDate) <= new Date(),
  );

  return {
    totalSpent,
    categoryPercentages,
    cities,
    ticketsByCity,
    upcomingTickets,
    pastTickets,
    averagePrice: tickets.length ? totalSpent / tickets.length : 0,
  };
};

/**
 * Filter tickets by search, categories, cities, etc.
 */
export const filterTickets = (tickets, filters) => {
  if (!tickets) return [];

  const { activeTab, searchTerm, selectedCategories, selectedCities, sortBy } =
    filters;

  let filtered = [...tickets];

  // Filter by tab
  if (activeTab === "upcoming") {
    filtered = filtered.filter(
      (ticket) => new Date(ticket.eventDate) > new Date(),
    );
  } else if (activeTab === "past") {
    filtered = filtered.filter(
      (ticket) => new Date(ticket.eventDate) <= new Date(),
    );
  }

  // Filter by search term
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(
      (ticket) =>
        (ticket.ticketName && ticket.ticketName.toLowerCase().includes(term)) ||
        (ticket.eventName && ticket.eventName.toLowerCase().includes(term)) ||
        (ticket.city && ticket.city.toLowerCase().includes(term)),
    );
  }

  // Filter by categories
  if (selectedCategories.length > 0) {
    filtered = filtered.filter((ticket) =>
      selectedCategories.includes(ticket.categoryName),
    );
  }

  // Filter by cities
  if (selectedCities.length > 0) {
    filtered = filtered.filter((ticket) =>
      selectedCities.includes(ticket.city),
    );
  }

  // Sort tickets
  switch (sortBy) {
    case "date-asc":
      filtered.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
      break;
    case "date-desc":
      filtered.sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate));
      break;
    case "price-asc":
      filtered.sort((a, b) => a.ticketPrice - b.ticketPrice);
      break;
    case "price-desc":
      filtered.sort((a, b) => b.ticketPrice - a.ticketPrice);
      break;
    case "name-asc":
      filtered.sort((a, b) =>
        (a.ticketName || a.eventName || "").localeCompare(
          b.ticketName || b.eventName || "",
        ),
      );
      break;
    case "name-desc":
      filtered.sort((a, b) =>
        (b.ticketName || b.eventName || "").localeCompare(
          a.ticketName || a.eventName || "",
        ),
      );
      break;
    default:
      break;
  }

  return filtered;
};
