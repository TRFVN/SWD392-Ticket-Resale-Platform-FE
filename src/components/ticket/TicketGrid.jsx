import {
  Filter,
  Grid,
  List,
  Search,
  SlidersHorizontal,
  Calendar,
  CreditCard,
} from "lucide-react";
import TicketCard from "./TicketCard";
import { useState } from "react";

const TicketGrid = ({ tickets, onAction, onAddToCart }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState("grid");
  const [sortBy, setSortBy] = useState("date"); // date, price, name
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000000]);

  // Get unique categories
  const categories = [
    ...new Set(tickets?.map((ticket) => ticket.categoryName)),
  ];

  const filteredTickets = tickets
    ?.filter((ticket) => {
      const matchesSearch =
        ticket.ticketName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.ticketDescription
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        ticket.eventName?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        !selectedCategory || ticket.categoryName === selectedCategory;
      const matchesPrice =
        ticket.ticketPrice >= priceRange[0] &&
        ticket.ticketPrice <= priceRange[1];

      return matchesSearch && matchesCategory && matchesPrice;
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
      {/* Search Bar and View Toggle */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, event, or description..."
              className="w-full pl-12 pr-4 py-3 bg-gray-800/50 backdrop-blur text-white rounded-xl border border-gray-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none transition-colors"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-3 backdrop-blur rounded-xl flex items-center gap-2 transition-colors ${
              showFilters
                ? "bg-orange-500 text-white"
                : "bg-gray-800/50 text-white border border-gray-700 hover:bg-gray-700"
            }`}
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>

        {/* View Toggle and Sort */}
        <div className="flex gap-4">
          <div className="flex bg-gray-800/50 backdrop-blur rounded-xl overflow-hidden">
            <button
              onClick={() => setView("grid")}
              className={`p-3 ${
                view === "grid"
                  ? "bg-orange-500 text-white"
                  : "text-gray-400 hover:text-white"
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
                  : "text-gray-400 hover:text-white"
              }`}
              title="List view"
            >
              <List className="w-5 h-5" />
            </button>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 bg-gray-800/50 backdrop-blur text-white rounded-xl border border-gray-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none transition-colors"
          >
            <option value="date">Sort by Date</option>
            <option value="price">Sort by Price</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="p-6 bg-gray-800/50 backdrop-blur rounded-xl border border-gray-700 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-gray-300 text-sm font-medium">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700/50 text-white rounded-lg border border-gray-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div className="space-y-2">
              <label className="text-gray-300 text-sm font-medium">
                Price Range
              </label>
              <div className="flex gap-4 items-center">
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) =>
                    setPriceRange([+e.target.value, priceRange[1]])
                  }
                  className="w-full px-4 py-2 bg-gray-700/50 text-white rounded-lg border border-gray-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  placeholder="Min"
                />
                <span className="text-gray-400">to</span>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], +e.target.value])
                  }
                  className="w-full px-4 py-2 bg-gray-700/50 text-white rounded-lg border border-gray-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  placeholder="Max"
                />
              </div>
            </div>
          </div>
        </div>
      )}

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
          <div className="p-6 bg-gray-800/50 backdrop-blur rounded-full">
            <Filter className="w-12 h-12 text-orange-500" />
          </div>
          <h3 className="text-xl font-medium text-white">No tickets found</h3>
          <p className="text-gray-400">
            {searchTerm
              ? "Try adjusting your search terms or filters"
              : "Check back later for new tickets"}
          </p>
          {(searchTerm ||
            selectedCategory ||
            priceRange[0] > 0 ||
            priceRange[1] < 10000000) && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("");
                setPriceRange([0, 10000000]);
              }}
              className="text-orange-500 hover:text-orange-400 font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Quick Stats */}
      {filteredTickets?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <div className="bg-gray-800/50 backdrop-blur rounded-xl p-4 flex items-center gap-4">
            <div className="p-3 bg-orange-500/10 rounded-lg">
              <Filter className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Results</p>
              <p className="text-white font-medium">
                {filteredTickets.length} tickets
              </p>
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur rounded-xl p-4 flex items-center gap-4">
            <div className="p-3 bg-orange-500/10 rounded-lg">
              <Calendar className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Next Event</p>
              <p className="text-white font-medium">
                {new Date(
                  Math.min(
                    ...filteredTickets.map((t) => new Date(t.eventDate)),
                  ),
                ).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur rounded-xl p-4 flex items-center gap-4">
            <div className="p-3 bg-orange-500/10 rounded-lg">
              <CreditCard className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Price Range</p>
              <p className="text-white font-medium">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(
                  Math.min(...filteredTickets.map((t) => t.ticketPrice)),
                )}{" "}
                -
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(
                  Math.max(...filteredTickets.map((t) => t.ticketPrice)),
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketGrid;
