import React, { useEffect, useState, useMemo } from "react";
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
import axiosInstance from "../../config/axiosConfig";
import { toast } from "react-toastify";
import { notifyCartUpdated } from "../../utils/cartEvents";

// Notification Toast Component
const Toast = ({ message, type }) => (
  <div
    className={`fixed bottom-4 right-4 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg backdrop-blur-sm z-50
    ${type === "success" ? "bg-green-500/90" : "bg-red-500/90"} text-white`}
  >
    <div className="w-5 h-5" />
    <p className="font-medium">{message}</p>
  </div>
);

// Enhanced Ticket Card Component
const TicketCard = ({ ticket, onAction, onAddToCart, isDarkMode }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

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
        {/* Category Badge */}
        <div className="flex justify-between items-start mb-4">
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium 
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
            {formatPrice(ticket.ticketPrice)}
          </div>
        </div>

        {/* Ticket Info */}
        <h3
          className={`text-lg font-bold mb-2 group-hover:text-orange-500 transition-colors line-clamp-2
          ${isDarkMode ? "text-white" : "text-gray-900"}`}
        >
          {ticket.ticketName}
        </h3>

        <p
          className={`mb-4 text-sm ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {ticket.eventName}
        </p>

        {/* Details */}
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
              {ticket.quantity} vé còn lại
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
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
          Xem chi tiết
        </button>
        <div
          className={`w-px ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}
        ></div>
        <button
          onClick={() => onAddToCart(ticket)}
          className="flex-1 py-3 text-sm font-medium text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 
            transition-colors flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-4 h-4" />
          Thêm vào giỏ
        </button>
      </div>
    </div>
  );
};

// Main Component
const TicketsPage = () => {
  // States
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const [totalItems, setTotalItems] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const isDarkMode = useSelector((state) => state.theme?.isDarkMode);
  const navigate = useNavigate();

  // Derived states
  const categories = useMemo(() => {
    return tickets && tickets.length > 0
      ? [...new Set(tickets.map((t) => t.categoryName))]
      : [];
  }, [tickets]);

  const priceStats = useMemo(() => {
    if (!tickets || tickets.length === 0) return { min: 0, max: 0 };
    return {
      min: Math.min(...tickets.map((t) => t.ticketPrice)),
      max: Math.max(...tickets.map((t) => t.ticketPrice)),
    };
  }, [tickets]);

  // Effects
  useEffect(() => {
    fetchTickets(currentPage, pageSize);
  }, [currentPage, pageSize]);

  useEffect(() => {
    if (tickets && tickets.length > 0) {
      filterTickets();
    }
  }, [searchTerm, priceRange, selectedCategories, tickets]);

  // Data fetching
  const fetchTickets = async (page, size) => {
    try {
      setLoading(true);
      const result = await getAllTicketsApi(page, size);
      setTickets(result.data);
      setFilteredTickets(result.data);
      setTotalItems(result.pagination.totalItems);
      if (result.data.length > 0) {
        setPriceRange(Math.max(...result.data.map((t) => t.ticketPrice)));
      }
    } catch (err) {
      setError(err.message || "Không thể tải danh sách vé");
      toast.error("Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  // Filtering logic
  const filterTickets = () => {
    if (!tickets) return;

    let filtered = [...tickets];

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (ticket) =>
          ticket.ticketName.toLowerCase().includes(searchLower) ||
          ticket.eventName.toLowerCase().includes(searchLower) ||
          ticket.city.toLowerCase().includes(searchLower),
      );
    }

    if (priceRange > priceStats.min) {
      filtered = filtered.filter((ticket) => ticket.ticketPrice <= priceRange);
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((ticket) =>
        selectedCategories.includes(ticket.categoryName),
      );
    }

    setFilteredTickets(filtered);
  };

  // Pagination
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Event handlers
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddToCart = async (ticket) => {
    try {
      await axiosInstance.post("api/Cart/AddToCart", {
        ticketTemplateId: ticket.ticketTemplateId,
        quantity: 1, // Default to 1 ticket
      });
      toast.success(`Đã thêm ${ticket.ticketName} vào giỏ hàng`);

      // Notify about cart update
      notifyCartUpdated();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Không thể thêm vé vào giỏ hàng",
      );
    }
  };

  const handleViewDetails = (ticket) => {
    navigate(`/tickets/${ticket.ticketId}`, { state: { ticket } });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
        <p className={`mt-4 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
          Đang tải danh sách vé...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h3
          className={`text-2xl font-medium mb-2 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Đã xảy ra lỗi!
        </h3>
        <p
          className={`text-center mb-6 ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {error}
        </p>
        <button
          onClick={() => fetchTickets(currentPage, pageSize)}
          className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors"
        >
          Thử lại
        </button>
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
        {/* Header */}
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
                Danh sách vé
              </h1>
              <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                {filteredTickets.length} vé được tìm thấy
              </p>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 
                ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm vé..."
                className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2
                  ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-700 text-white focus:ring-orange-500/50"
                      : "bg-white border-gray-200 text-gray-900 focus:ring-orange-500/30"
                  }`}
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
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

        {/* Content */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters */}
          {showFilters && (
            <div className="w-full md:w-64 space-y-4">
              {/* Price Range Filter */}
              <div
                className={`p-5 rounded-2xl ${
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
                <input
                  type="range"
                  min={priceStats.min}
                  max={priceStats.max}
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <div className="flex justify-between mt-2 text-sm">
                  <span
                    className={isDarkMode ? "text-gray-400" : "text-gray-600"}
                  >
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(priceStats.min)}
                  </span>
                  <span
                    className={isDarkMode ? "text-gray-400" : "text-gray-600"}
                  >
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(priceRange)}
                  </span>
                </div>
              </div>

              {/* Category Filter */}
              <div
                className={`p-5 rounded-2xl ${
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
                    <label key={category} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => {
                          setSelectedCategories((prev) =>
                            prev.includes(category)
                              ? prev.filter((c) => c !== category)
                              : [...prev, category],
                          );
                        }}
                        className="w-4 h-4 text-orange-500 rounded border-gray-300 focus:ring-orange-500"
                      />
                      <span
                        className={`ml-2 ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {category}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tickets Grid */}
          <div className="flex-1">
            {filteredTickets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredTickets.map((ticket) => (
                  <TicketCard
                    key={ticket.ticketId}
                    ticket={ticket}
                    onAction={handleViewDetails}
                    onAddToCart={handleAddToCart}
                    isDarkMode={isDarkMode}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16">
                <Search className="w-16 h-16 text-orange-500 mb-4" />
                <h3
                  className={`text-xl font-medium mb-2 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Không tìm thấy vé nào
                </h3>
                <p
                  className={`text-center mb-6 ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setPriceRange(priceStats.max);
                    setSelectedCategories([]);
                  }}
                  className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors"
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}

            {/* Pagination */}
            {filteredTickets.length > 0 && (
              <div className="flex justify-between items-center mt-8">
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
                  <option value={6}>6 vé/trang</option>
                  <option value={9}>9 vé/trang</option>
                  <option value={12}>12 vé/trang</option>
                </select>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      handlePageChange(Math.max(1, currentPage - 1))
                    }
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg ${
                      currentPage === 1
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <span
                    className={isDarkMode ? "text-gray-300" : "text-gray-700"}
                  >
                    Trang {currentPage} / {totalPages}
                  </span>

                  <button
                    onClick={() =>
                      handlePageChange(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg ${
                      currentPage === totalPages
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketsPage;
