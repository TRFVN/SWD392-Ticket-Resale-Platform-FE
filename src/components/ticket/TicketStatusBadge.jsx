import React from "react";
const TicketStatusBadge = ({ status }) => {
  const statusConfig = {
    1: {
      label: "Available",
      className: "bg-gradient-to-r from-green-500 to-emerald-500",
    },
    2: {
      label: "In Negotiation",
      className: "bg-gradient-to-r from-yellow-500 to-orange-500",
    },
    3: {
      label: "Sold",
      className: "bg-gradient-to-r from-gray-500 to-gray-600",
    },
  };

  const config = statusConfig[status] || statusConfig[1];

  return (
    <span
      className={`${config.className} px-3 py-1 rounded-full text-xs font-medium text-white shadow-sm`}
    >
      {config.label}
    </span>
  );
};
export default TicketStatusBadge;
