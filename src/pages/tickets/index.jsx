import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Ticket,
  AlertCircle,
  Loader2,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Tag,
  Map,
  CreditCard,
  Calendar,
} from "lucide-react";
import { getAllTicketsApi } from "../../services/ticket";
import { useNavigate } from "react-router-dom";
import TicketGrid from "../../components/ticket/TicketGrid";
import axiosInstance from "../../config/axiosConfig";

// Toast Notification Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-4 right-4 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg backdrop-blur-sm transition-all duration-300 z-50
      ${type === "success" ? "bg-green-500/90" : "bg-red-500/90"} text-white`}
    >
      {type === "success" ? (
        <CheckCircle className="w-5 h-5" />
      ) : (
        <XCircle className="w-5 h-5" />
      )}
      <p className="font-medium">{message}</p>
    </div>
  );
};

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange, isDarkMode }) => {
  const renderPageNumbers = () => {
    const pages = [];

    // Always show first page
    pages.push(
      <button
        key={1}
        onClick={() => onPageChange(1)}
        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors
          ${
            currentPage === 1
              ? isDarkMode
                ? "bg-orange-500 text-white"
                : "bg-orange-500 text-white"
              : isDarkMode
              ? "text-gray-400 hover:bg-gray-800"
              : "text-gray-700 hover:bg-orange-50"
          }`}
      >
        1
      </button>,
    );

    // Show dots if not on first pages
    if (currentPage > 3) {
      pages.push(
        <span key="dots-1" className="px-2 text-gray-500">
          ...
        </span>,
      );
    }

    // Show current page and adjacent pages
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (i <= 1 || i >= totalPages) continue;

      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors
            ${
              currentPage === i
                ? isDarkMode
                  ? "bg-orange-500 text-white"
                  : "bg-orange-500 text-white"
                : isDarkMode
                ? "text-gray-400 hover:bg-gray-800"
                : "text-gray-700 hover:bg-orange-50"
            }`}
        >
          {i}
        </button>,
      );
    }

    // Show dots if not on last pages
    if (currentPage < totalPages - 2) {
      pages.push(
        <span key="dots-2" className="px-2 text-gray-500">
          ...
        </span>,
      );
    }

    // Always show last page if there are at least 2 pages
    if (totalPages > 1) {
      pages.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors
            ${
              currentPage === totalPages
                ? isDarkMode
                  ? "bg-orange-500 text-white"
                  : "bg-orange-500 text-white"
                : isDarkMode
                ? "text-gray-400 hover:bg-gray-800"
                : "text-gray-700 hover:bg-orange-50"
            }`}
        >
          {totalPages}
        </button>,
      );
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`w-10 h-10 rounded-lg flex items-center justify-center
          ${
            isDarkMode
              ? currentPage === 1
                ? "text-gray-600"
                : "text-gray-400 hover:bg-gray-800"
              : currentPage === 1
              ? "text-gray-400"
              : "text-gray-700 hover:bg-orange-50"
          }`}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {renderPageNumbers()}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`w-10 h-10 rounded-lg flex items-center justify-center
          ${
            isDarkMode
              ? currentPage === totalPages
                ? "text-gray-600"
                : "text-gray-400 hover:bg-gray-800"
              : currentPage === totalPages
              ? "text-gray-400"
              : "text-gray-700 hover:bg-orange-50"
          }`}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

// Price Range Filter Component
const PriceRangeFilter = ({
  minPrice,
  maxPrice,
  priceRange,
  setPriceRange,
  isDarkMode,
}) => {
  return (
    <div
      className={`p-5 rounded-2xl mb-4 ${
        isDarkMode ? "bg-gray-800" : "bg-white"
      } shadow-sm`}
    >
      <h3
        className={`font-semibold mb-4 ${
          isDarkMode ? "text-white" : "text-gray-800"
        }`}
      >
        Lọc theo giá
      </h3>

      <div className="relative mb-2">
        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          step={(maxPrice - minPrice) / 100}
          value={priceRange}
          onChange={(e) => setPriceRange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
        />
      </div>

      <div className="flex justify-between items-center">
        <span
          className={`text-sm ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(minPrice)}
        </span>
        <span
          className={`text-sm font-medium ${
            isDarkMode ? "text-white" : "text-gray-800"
          }`}
        >
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(priceRange)}
        </span>
        <span
          className={`text-sm ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(maxPrice)}
        </span>
      </div>
    </div>
  );
};

// Category Filter Component
const CategoryFilter = ({
  categories,
  selectedCategories,
  setSelectedCategories,
  isDarkMode,
}) => {
  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  return (
    <div
      className={`p-5 rounded-2xl mb-4 ${
        isDarkMode ? "bg-gray-800" : "bg-white"
      } shadow-sm`}
    >
      <h3
        className={`font-semibold mb-4 ${
          isDarkMode ? "text-white" : "text-gray-800"
        }`}
      >
        Loại vé
      </h3>

      <div className="space-y-2">
        {categories.map((category) => (
          <div key={category} className="flex items-center">
            <input
              id={`category-${category}`}
              type="checkbox"
              checked={selectedCategories.includes(category)}
              onChange={() => toggleCategory(category)}
              className="w-4 h-4 text-orange-500 rounded border-gray-300 focus:ring-orange-500"
            />
            <label
              htmlFor={`category-${category}`}
              className={`ml-2 text-sm ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {category}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

// Enhanced Ticket Card Component
const EnhancedTicketCard = ({ ticket, onAction, onAddToCart, isDarkMode }) => {
  return (
    <div
      className={`group rounded-2xl overflow-hidden border shadow-sm hover:shadow-md transition-all duration-300
        ${
          isDarkMode
            ? "bg-gray-800/80 border-gray-700"
            : "bg-white border-gray-200"
        }`}
    >
      <div className="p-5">
        {/* Ticket Header */}
        <div className="flex justify-between items-start mb-4">
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium bg-opacity-20
              ${
                ticket.categoryName === "VIP"
                  ? "bg-purple-100 text-purple-600 dark:bg-purple-800/30 dark:text-purple-400"
                  : ticket.categoryName === "Standard"
                  ? "bg-blue-100 text-blue-600 dark:bg-blue-800/30 dark:text-blue-400"
                  : "bg-green-100 text-green-600 dark:bg-green-800/30 dark:text-green-400"
              }`}
          >
            {ticket.categoryName}
          </div>
          <div
            className={`font-bold text-lg ${
              isDarkMode ? "text-orange-400" : "text-orange-500"
            }`}
          >
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(ticket.ticketPrice)}
          </div>
        </div>

        {/* Ticket Name */}
        <h3
          className={`text-lg font-bold mb-2 group-hover:text-orange-500 transition-colors line-clamp-2
            ${isDarkMode ? "text-white" : "text-gray-900"}`}
        >
          {ticket.ticketName}
        </h3>

        {/* Event Name */}
        <p
          className={`mb-4 text-sm ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {ticket.eventName}
        </p>

        {/* Ticket Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Map
              className={`w-4 h-4 ${
                isDarkMode ? "text-gray-500" : "text-gray-400"
              }`}
            />
            <span
              className={`line-clamp-1 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {ticket.city}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Tag
              className={`w-4 h-4 ${
                isDarkMode ? "text-gray-500" : "text-gray-400"
              }`}
            />
            <span
              className={`${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
            >
              {ticket.quantity} available
            </span>
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div
        className={`flex border-t ${
          isDarkMode ? "border-gray-700" : "border-gray-100"
        }`}
      >
        <button
          onClick={() => onAction(ticket)}
          className={`flex-1 py-3 text-sm font-medium transition-colors
            ${
              isDarkMode
                ? "text-white hover:bg-gray-700"
                : "text-gray-700 hover:bg-gray-50"
            }`}
        >
          View Details
        </button>
        <div
          className={`w-px ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}
        ></div>
        <button
          onClick={() => onAddToCart(ticket)}
          className="flex-1 py-3 text-sm font-medium text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

const TicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState(0);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const isDarkMode = useSelector((state) => state.theme?.isDarkMode);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    // Apply filters when any filter criteria changes
    if (tickets.length) {
      let filtered = [...tickets];

      // Apply search filter
      if (searchTerm.trim()) {
        filtered = filtered.filter(
          (ticket) =>
            ticket.ticketName
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            ticket.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.city.toLowerCase().includes(searchTerm.toLowerCase()),
        );
      }

      // Apply price filter if it's set
      if (priceRange > minPrice) {
        filtered = filtered.filter(
          (ticket) => ticket.ticketPrice <= priceRange,
        );
      }

      // Apply category filter if any categories are selected
      if (selectedCategories.length > 0) {
        filtered = filtered.filter((ticket) =>
          selectedCategories.includes(ticket.categoryName),
        );
      }

      setFilteredTickets(filtered);
      setTotalPages(Math.max(1, Math.ceil(filtered.length / pageSize)));
      setCurrentPage(1); // Reset to first page when filtering
    }
  }, [searchTerm, priceRange, selectedCategories, tickets, pageSize]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllTicketsApi();
      setTickets(data);
      setFilteredTickets(data);

      // Extract price range
      if (data.length) {
        const min = Math.min(...data.map((t) => t.ticketPrice));
        const max = Math.max(...data.map((t) => t.ticketPrice));
        setMinPrice(min);
        setMaxPrice(max);
        setPriceRange(max); // Initial price range is max (show all)

        // Extract unique categories
        const uniqueCategories = [...new Set(data.map((t) => t.categoryName))];
        setCategories(uniqueCategories);
      }

      setTotalPages(Math.max(1, Math.ceil(data.length / pageSize)));
    } catch (err) {
      setError(err.message || "Failed to fetch tickets");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (ticket) => {
    try {
      setToast(null);
      await axiosInstance.post("api/Cart/AddToCart", {
        ticketId: ticket.ticketId,
      });

      setToast({
        type: "success",
        message: `${ticket.ticketName} added to cart successfully!`,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      setToast({
        type: "error",
        message:
          error.response?.data?.message || "Failed to add ticket to cart",
      });
    }
  };

  const handleAction = (ticket) => {
    navigate(`/tickets/${ticket.ticketId}`, { state: { ticket } });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Get current page tickets
  const getCurrentPageTickets = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredTickets.slice(startIndex, endIndex);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setPriceRange(maxPrice);
    setSelectedCategories([]);
    setShowFilters(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div
          className={`p-4 rounded-full ${
            isDarkMode ? "bg-gray-800" : "bg-orange-50"
          }`}
        >
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
        </div>
        <p
          className={`mt-6 text-lg ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Đang tải vé...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="p-6 bg-red-500/10 rounded-full mb-6">
          <AlertCircle className="w-16 h-16 text-red-500" />
        </div>
        <h3
          className={`text-2xl font-medium mb-3 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Đã xảy ra lỗi!
        </h3>
        <p
          className={`text-center mb-8 max-w-md ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {error}
        </p>
        <div className="flex gap-4">
          <button
            onClick={fetchTickets}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors font-medium"
          >
            Thử lại
          </button>
          <button
            onClick={() => navigate("/")}
            className={`px-6 py-3 rounded-xl transition-colors font-medium ${
              isDarkMode
                ? "bg-gray-800 hover:bg-gray-700 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-800"
            }`}
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      } min-h-screen`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div
              className={`p-4 rounded-2xl ${
                isDarkMode ? "bg-orange-500/10" : "bg-orange-100"
              }`}
            >
              <Ticket className="w-7 h-7 text-orange-500" />
            </div>
            <div>
              <h1
                className={`text-3xl font-bold mb-1 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Vé có sẵn
              </h1>
              <p
                className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                Đã tìm thấy {filteredTickets.length} vé
              </p>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-3">
            <div className={`relative flex items-center w-full sm:w-64`}>
              <Search
                className={`absolute left-3 w-5 h-5 ${
                  isDarkMode ? "text-gray-500" : "text-gray-400"
                }`}
              />
              <input
                type="text"
                placeholder="Tìm kiếm vé..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 pr-4 py-3 w-full rounded-xl border focus:outline-none focus:ring-2 
                  ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-700 text-white focus:ring-orange-500/50"
                      : "bg-white border-gray-200 text-gray-900 focus:ring-orange-500/30"
                  }`}
              />
            </div>

            <button
              onClick={toggleFilters}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-colors
                ${
                  isDarkMode
                    ? showFilters
                      ? "bg-orange-500 border-orange-600 text-white"
                      : "bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                    : showFilters
                    ? "bg-orange-500 border-orange-500 text-white"
                    : "bg-white border-gray-200 text-gray-800 hover:bg-gray-50"
                }`}
            >
              {showFilters ? (
                <Filter className="w-4 h-4" />
              ) : (
                <SlidersHorizontal className="w-4 h-4" />
              )}
              <span>{showFilters ? "Ẩn bộ lọc" : "Bộ lọc"}</span>
            </button>
          </div>
        </div>

        {/* Main Content with Filters */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Sidebar - Conditional Rendering */}
          {showFilters && (
            <div className="w-full md:w-64 flex-shrink-0 space-y-4">
              <PriceRangeFilter
                minPrice={minPrice}
                maxPrice={maxPrice}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                isDarkMode={isDarkMode}
              />

              <CategoryFilter
                categories={categories}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                isDarkMode={isDarkMode}
              />

              <button
                onClick={resetFilters}
                className={`w-full py-3 px-4 rounded-xl transition-colors text-sm font-medium
                  ${
                    isDarkMode
                      ? "bg-gray-800 text-white hover:bg-gray-700"
                      : "bg-white text-gray-800 hover:bg-gray-50 border border-gray-200"
                  }`}
              >
                Xóa bộ lọc
              </button>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div
                className={`rounded-2xl p-5 shadow-sm flex items-center gap-4
                ${isDarkMode ? "bg-gray-800/70" : "bg-white"}`}
              >
                <div
                  className={`p-3 rounded-xl ${
                    isDarkMode ? "bg-blue-500/10" : "bg-blue-50"
                  }`}
                >
                  <Calendar className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Sự kiện
                  </p>
                  <p
                    className={`text-lg font-bold ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {new Set(tickets.map((t) => t.eventId)).size}
                  </p>
                </div>
              </div>

              <div
                className={`rounded-2xl p-5 shadow-sm flex items-center gap-4
                ${isDarkMode ? "bg-gray-800/70" : "bg-white"}`}
              >
                <div
                  className={`p-3 rounded-xl ${
                    isDarkMode ? "bg-green-500/10" : "bg-green-50"
                  }`}
                >
                  <Tag className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Loại vé
                  </p>
                  <p
                    className={`text-lg font-bold ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {new Set(tickets.map((t) => t.categoryName)).size}
                  </p>
                </div>
              </div>

              <div
                className={`rounded-2xl p-5 shadow-sm flex items-center gap-4
                ${isDarkMode ? "bg-gray-800/70" : "bg-white"}`}
              >
                <div
                  className={`p-3 rounded-xl ${
                    isDarkMode ? "bg-purple-500/10" : "bg-purple-50"
                  }`}
                >
                  <Map className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Địa điểm
                  </p>
                  <p
                    className={`text-lg font-bold ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {new Set(tickets.map((t) => t.city)).size}
                  </p>
                </div>
              </div>

              <div
                className={`rounded-2xl p-5 shadow-sm flex items-center gap-4
                ${isDarkMode ? "bg-gray-800/70" : "bg-white"}`}
              >
                <div
                  className={`p-3 rounded-xl ${
                    isDarkMode ? "bg-orange-500/10" : "bg-orange-50"
                  }`}
                >
                  <CreditCard className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Khoảng giá
                  </p>
                  <p
                    className={`text-lg font-bold ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                      notation: "compact",
                      maximumFractionDigits: 1,
                    }).format(Math.min(...tickets.map((t) => t.ticketPrice)))}
                    {" - "}
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                      notation: "compact",
                      maximumFractionDigits: 1,
                    }).format(Math.max(...tickets.map((t) => t.ticketPrice)))}
                  </p>
                </div>
              </div>
            </div>

            {/* Results Controls */}
            <div className={`flex justify-between items-center mb-6`}>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className={`px-3 py-2 rounded-lg border 
      ${
        isDarkMode
          ? "bg-gray-800 border-gray-700 text-white"
          : "bg-white border-gray-200 text-gray-900"
      }`}
              >
                <option value={6}>6 mỗi trang</option>
                <option value={9}>9 mỗi trang</option>
                <option value={12}>12 mỗi trang</option>
              </select>

              <div
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Hiển thị{" "}
                {Math.min(
                  filteredTickets.length,
                  (currentPage - 1) * pageSize + 1,
                )}
                -{Math.min(filteredTickets.length, currentPage * pageSize)} của{" "}
                {filteredTickets.length} vé
              </div>
            </div>

            {/* Custom Ticket Grid */}
            {filteredTickets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {getCurrentPageTickets().map((ticket) => (
                  <EnhancedTicketCard
                    key={ticket.ticketId}
                    ticket={ticket}
                    onAction={handleAction}
                    onAddToCart={handleAddToCart}
                    isDarkMode={isDarkMode}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16">
                <div
                  className={`p-6 rounded-full mb-6 ${
                    isDarkMode ? "bg-gray-800" : "bg-orange-50"
                  }`}
                >
                  <Search className="w-10 h-10 text-orange-500" />
                </div>
                <h3
                  className={`text-xl font-medium mb-2 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Không tìm thấy kết quả
                </h3>
                <p
                  className={`text-center mb-6 max-w-md ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Không tìm thấy vé nào phù hợp với các bộ lọc được chọn. Hãy
                  thử với các tiêu chí khác.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors"
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}

            {/* Pagination */}
            {filteredTickets.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                isDarkMode={isDarkMode}
              />
            )}
          </div>
        </div>

        {/* Toast Notification */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
};

export default TicketsPage;
