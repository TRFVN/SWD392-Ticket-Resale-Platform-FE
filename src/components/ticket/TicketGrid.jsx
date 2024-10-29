import { Filter, Search, Ticket } from "lucide-react";
import TicketCard from "./TicketCard";
import { useState } from "react";

const TicketGrid = ({ tickets, onAction, onAddToCart }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState("grid"); // grid or list view

  const filteredTickets = tickets?.filter(
    (ticket) =>
      ticket.ticketName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.ticketDescription.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tickets by name or description..."
            className="w-full pl-12 pr-4 py-3 bg-gray-800/50 backdrop-blur text-white rounded-xl border border-gray-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none transition-colors"
          />
        </div>
        <button className="px-6 py-3 bg-gray-800/50 backdrop-blur hover:bg-gray-700 text-white rounded-xl flex items-center gap-2 border border-gray-700 transition-colors">
          <Filter className="w-5 h-5" />
          <span>Filters</span>
        </button>
      </div>

      {/* Tickets Grid */}
      {filteredTickets?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTickets.map((ticket) => (
            <TicketCard
              key={ticket.ticketId}
              ticket={ticket}
              onAction={onAction}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="p-6 bg-gray-800/50 backdrop-blur rounded-full">
            <Ticket className="w-12 h-12 text-orange-500" />
          </div>
          <h3 className="text-xl font-medium text-white">No tickets found</h3>
          <p className="text-gray-400">
            {searchTerm
              ? "Try adjusting your search terms"
              : "Check back later for new tickets"}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="text-orange-500 hover:text-orange-400 font-medium"
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
