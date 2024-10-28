import { Filter, Search, Ticket } from "lucide-react";
import TicketCard from "./TicketCard";

const TicketGrid = ({ tickets, onAction }) => {
  if (!tickets?.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="rounded-full bg-orange-100 dark:bg-orange-900/20 p-6">
          <Ticket className="w-12 h-12 text-orange-500" />
        </div>
        <span className="text-gray-500 dark:text-gray-400 text-lg font-medium">
          No tickets found
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch">
        <div className="relative flex-1">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Search for tickets..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-orange-500 dark:focus:border-orange-400 transition-all duration-200"
          />
        </div>
        <button className="px-6 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/10 text-gray-700 dark:text-gray-200 transition-all duration-200 flex items-center justify-center gap-2 font-medium">
          <Filter className="w-5 h-5" />
          <span>Filters</span>
        </button>
      </div>

      {/* Tickets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
        {tickets.map((ticket) => (
          <TicketCard
            key={ticket.ticketId}
            ticket={ticket}
            onAction={onAction}
          />
        ))}
      </div>
    </div>
  );
};

export default TicketGrid;
