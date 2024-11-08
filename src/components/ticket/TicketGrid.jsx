import { Grid, List, Search } from "lucide-react";
import TicketCard from "./TicketCard";
import { useState } from "react";
import { useSelector } from "react-redux";

const TicketGrid = ({ tickets, onAction, onAddToCart }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState("grid");
  const [sortBy, setSortBy] = useState("date");
  const isDarkMode = useSelector((state) => state.theme?.isDarkMode || false);

  const filteredTickets = tickets
    ?.filter((ticket) => {
      const matchesSearch =
        ticket.ticketName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.eventName?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(a.eventDate) - new Date(b.eventDate);
        case "price":
          return a.ticketPrice - b.ticketPrice;
        case "name":
          return a.ticketName.localeCompare(b.ticketName);
        default:
          return 0;
      }
    });

  return (
    <div className="space-y-6">
      {/* Search Bar and View Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search
            className={`absolute left-4 top-1/2 -translate-y-1/2 ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            } w-5 h-5`}
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tickets..."
            className={`w-full pl-12 pr-4 py-3 ${
              isDarkMode
                ? "bg-gray-800/50 text-white border-gray-700 focus:border-orange-500"
                : "bg-white/50 text-gray-900 border-gray-200 focus:border-orange-500"
            } backdrop-blur rounded-xl border focus:ring-1 focus:ring-orange-500 focus:outline-none transition-colors`}
          />
        </div>

        <div className="flex gap-4 shrink-0">
          {/* View Toggle */}
          <div
            className={`flex ${
              isDarkMode ? "bg-gray-800/50" : "bg-gray-100"
            } backdrop-blur rounded-xl overflow-hidden`}
          >
            <button
              onClick={() => setView("grid")}
              className={`p-3 ${
                view === "grid"
                  ? "bg-orange-500 text-white"
                  : isDarkMode
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              title="Grid view"
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-3 ${
                view === "list"
                  ? "bg-orange-500 text-white"
                  : isDarkMode
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              title="List view"
            >
              <List className="w-5 h-5" />
            </button>
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={`px-4 py-3 ${
              isDarkMode
                ? "bg-gray-800/50 text-white border-gray-700"
                : "bg-white/50 text-gray-900 border-gray-200"
            } backdrop-blur rounded-xl border focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none transition-colors`}
          >
            <option value="date">Sort by Date</option>
            <option value="price">Sort by Price</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>
      </div>

      {/* Tickets Grid/List */}
      {filteredTickets?.length > 0 ? (
        <div
          className={
            view === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {filteredTickets.map((ticket) => (
            <TicketCard
              key={ticket.ticketId}
              ticket={ticket}
              onAction={onAction}
              onAddToCart={onAddToCart}
              view={view}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div
            className={`p-6 ${
              isDarkMode ? "bg-gray-800/50" : "bg-gray-100"
            } backdrop-blur rounded-full`}
          >
            <Search className="w-12 h-12 text-orange-500" />
          </div>
          <h3
            className={`text-xl font-medium ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            No tickets found
          </h3>
          <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
            Try adjusting your search terms
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="text-orange-500 hover:text-orange-600 font-medium"
            >
              Clear search
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TicketGrid;
