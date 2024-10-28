import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TicketTabs from "../../components/ticket/TicketTabs";
import TicketGrid from "../../components/ticket/TicketGrid";
import { getAllTicketsApi } from "../../services/ticket";
const TicketsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("purchased");
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const data = await getAllTicketsApi();
        setTickets(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const filterTickets = () => {
    switch (activeTab) {
      case "purchased":
        return tickets.filter((ticket) => ticket.status === 1);
      case "negotiating":
        return tickets.filter((ticket) => ticket.status === 2);
      case "selling":
        return tickets.filter((ticket) => ticket.status === 3);
      default:
        return [];
    }
  };

  const getCounts = () => ({
    purchased: tickets.filter((t) => t.status === 1).length,
    negotiating: tickets.filter((t) => t.status === 2).length,
    selling: tickets.filter((t) => t.status === 3).length,
  });

  const handleAction = (ticket) => {
    switch (activeTab) {
      case "purchased":
        navigate(`/tickets/${ticket.ticketId}`);
        break;
      case "negotiating":
        navigate(`/chats?ticketId=${ticket.ticketId}`);
        break;
      case "selling":
        navigate(`/tickets/${ticket.ticketId}/edit`);
        break;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-500 text-center mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-medium transition-all duration-200"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              My Tickets
            </h1>
            <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-medium transition-all duration-200">
              Add New Ticket
            </button>
          </div>
          <TicketTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            counts={getCounts()}
          />
          <TicketGrid
            tickets={filterTickets()}
            onAction={handleAction}
            actionType={
              activeTab === "purchased"
                ? "view"
                : activeTab === "negotiating"
                ? "negotiate"
                : "sell"
            }
          />
        </div>
      </div>
    </div>
  );
};

export default TicketsPage;
