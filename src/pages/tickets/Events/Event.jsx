import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Loader2,
  AlertCircle,
  ChevronRight,
  Users,
  Clock,
  Search,
  Filter,
  ChevronLeft,
  ArrowUpRight,
  CalendarDays,
} from "lucide-react";
import axiosInstance from "../../../config/axiosConfig";

const EventCard = ({ event, onClick }) => {
  const isDarkMode = useSelector((state) => state.theme?.isDarkMode);

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(new Date(date));
  };

  // Extract date parts for more visual presentation
  const eventDate = new Date(event.eventDate);
  const day = eventDate.getDate();
  const month = eventDate.toLocaleString("vi-VN", { month: "short" });

  return (
    <div
      onClick={() => onClick(event)}
      className={`group cursor-pointer rounded-2xl overflow-hidden border shadow-sm hover:shadow-md transition-all duration-300
        ${
          isDarkMode
            ? "bg-gray-800/80 border-gray-700 hover:border-orange-500/50"
            : "bg-white border-gray-200 hover:border-orange-300"
        }`}
    >
      <div className="flex flex-col h-full">
        {/* Date Badge - Top Left */}
        <div className="relative">
          {/* Add event image if available */}
          {event.eventImage &&
            !event.eventImage.includes("Tp.") &&
            !event.eventImage.includes("Việt Nam") && (
              <div className="w-full h-48 bg-gray-200 overflow-hidden">
                <img
                  src={event.eventImage}
                  alt={event.eventName}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

          <div
            className={`absolute top-4 left-4 w-16 h-16 rounded-xl flex flex-col items-center justify-center 
            ${isDarkMode ? "bg-gray-900" : "bg-orange-50"} shadow-sm border 
            ${isDarkMode ? "border-gray-700" : "border-orange-100"}`}
          >
            <span
              className={`text-2xl font-bold ${
                isDarkMode ? "text-white" : "text-orange-500"
              }`}
            >
              {day}
            </span>
            <span
              className={`text-xs uppercase ${
                isDarkMode ? "text-gray-400" : "text-orange-600"
              }`}
            >
              {month}
            </span>
          </div>

          {/* Status Badge - Top Right */}
          <div className="absolute top-4 right-4">
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                event.status === 1
                  ? "bg-green-100 text-green-700 dark:bg-green-800/30 dark:text-green-400"
                  : "bg-red-100 text-red-700 dark:bg-red-800/30 dark:text-red-400"
              }`}
            >
              {event.status === 1 ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        {/* Event Content */}
        <div className="p-6 pt-16 flex-grow">
          {/* Event Title */}
          <h3
            className={`text-xl font-bold mb-3 group-hover:text-orange-500 transition-colors line-clamp-2
            ${isDarkMode ? "text-white" : "text-gray-900"}`}
          >
            {event.eventName}
          </h3>

          {/* Event Description */}
          <p
            className={`mb-5 line-clamp-2 ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {event.eventDescription}
          </p>

          {/* Event Details */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
              <CalendarDays className="w-4 h-4 text-orange-500" />
              <span className="text-sm">{formatDate(event.eventDate)}</span>
            </div>
            <div className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
              <MapPin className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm line-clamp-1">{event.location}</span>
            </div>
          </div>

          {/* Ticket Info (Optional) */}
          {event.ticketTemplates && event.ticketTemplates.length > 0 && (
            <div className="mt-3">
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {event.ticketTemplates.length} loại vé từ{" "}
                {new Intl.NumberFormat("vi-VN").format(
                  Math.min(...event.ticketTemplates.map((t) => t.ticketPrice)),
                )}
                đ
              </p>
            </div>
          )}
        </div>

        {/* Card Footer */}
        <div
          className={`px-6 py-4 border-t flex justify-end items-center mt-auto
          ${isDarkMode ? "border-gray-700" : "border-gray-100"}`}
        >
          <button
            className="flex items-center gap-2 text-orange-500 font-medium 
            group-hover:gap-3 transition-all"
          >
            Chi tiết
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
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

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  const isDarkMode = useSelector((state) => state.theme?.isDarkMode);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    // Filter events based on search term
    if (events.length) {
      const filtered = events.filter(
        (event) =>
          event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.eventDescription
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (event.location &&
            event.location.toLowerCase().includes(searchTerm.toLowerCase())),
      );

      setFilteredEvents(filtered);
      setTotalPages(Math.max(1, Math.ceil(filtered.length / pageSize)));
      setCurrentPage(1); // Reset to first page when filtering
    }
  }, [searchTerm, events, pageSize]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/api/Event");

      if (response.data.isSuccess) {
        setEvents(response.data.result);
        setFilteredEvents(response.data.result);
        setTotalPages(
          Math.max(1, Math.ceil(response.data.result.length / pageSize)),
        );
      } else {
        throw new Error(response.data.message || "Failed to fetch events");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  const handleEventClick = (event) => {
    navigate(`/events/${event.eventId}`, { state: { event } });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top of events section
    document
      .getElementById("events-grid")
      .scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Get current page events
  const getCurrentPageEvents = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredEvents.slice(startIndex, endIndex);
  };

  // Count unique cities from event locations
  const getUniqueLocationsCount = () => {
    if (!events.length) return 0;

    // Extract city names from location strings
    const cityRegex = /([^,]+)$/;
    const cities = events
      .map((event) => {
        if (!event.location) return null;
        const match = event.location.match(cityRegex);
        return match ? match[1].trim() : event.location;
      })
      .filter(Boolean);

    return new Set(cities).size;
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
          Đang tải sự kiện...
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
            onClick={fetchEvents}
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

  if (!events.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
        <div
          className={`p-8 rounded-full mb-8 ${
            isDarkMode ? "bg-gray-800" : "bg-orange-50"
          }`}
        >
          <Calendar className="w-16 h-16 text-orange-500" />
        </div>
        <h3
          className={`text-2xl font-medium mb-3 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Không có sự kiện nào
        </h3>
        <p
          className={`text-center mb-8 max-w-md ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Vui lòng quay lại sau để xem các sự kiện sắp tới
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors font-medium"
        >
          Về trang chủ
        </button>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
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
              <Calendar className="w-7 h-7 text-orange-500" />
            </div>
            <div>
              <h1
                className={`text-3xl font-bold mb-1 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Sự kiện
              </h1>
              <p
                className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                Đã tìm thấy {filteredEvents.length} sự kiện
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="w-full lg:w-auto">
            <div className={`relative flex items-center w-full max-w-md`}>
              <Search
                className={`absolute left-3 w-5 h-5 ${
                  isDarkMode ? "text-gray-500" : "text-gray-400"
                }`}
              />
              <input
                type="text"
                placeholder="Tìm kiếm sự kiện..."
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
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div
            className={`rounded-2xl p-6 ${
              isDarkMode ? "bg-gray-800/70" : "bg-white"
            } shadow-sm`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-xl ${
                  isDarkMode ? "bg-blue-500/10" : "bg-blue-50"
                }`}
              >
                <Clock className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p
                  className={`${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  } text-sm mb-1`}
                >
                  Sự kiện sắp tới
                </p>
                <p
                  className={`text-2xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {
                    events.filter((e) => new Date(e.eventDate) > new Date())
                      .length
                  }
                </p>
              </div>
            </div>
          </div>

          <div
            className={`rounded-2xl p-6 ${
              isDarkMode ? "bg-gray-800/70" : "bg-white"
            } shadow-sm`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-xl ${
                  isDarkMode ? "bg-green-500/10" : "bg-green-50"
                }`}
              >
                <MapPin className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p
                  className={`${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  } text-sm mb-1`}
                >
                  Địa điểm
                </p>
                <p
                  className={`text-2xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {getUniqueLocationsCount()}
                </p>
              </div>
            </div>
          </div>

          <div
            className={`rounded-2xl p-6 ${
              isDarkMode ? "bg-gray-800/70" : "bg-white"
            } shadow-sm`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-xl ${
                  isDarkMode ? "bg-purple-500/10" : "bg-purple-50"
                }`}
              >
                <Users className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p
                  className={`${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  } text-sm mb-1`}
                >
                  Sự kiện đang hoạt động
                </p>
                <p
                  className={`text-2xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {events.filter((e) => e.status === 1).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className={`flex justify-between items-center mb-8`}>
          <h2
            className={`text-xl font-semibold ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Tất cả sự kiện
          </h2>

          <div className="flex items-center gap-3">
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

            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border 
                ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                    : "bg-white border-gray-200 text-gray-800 hover:bg-gray-50"
                }`}
            >
              <Filter className="w-4 h-4" />
              <span>Bộ lọc</span>
            </button>
          </div>
        </div>

        {/* Events Grid */}
        <div
          id="events-grid"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {getCurrentPageEvents().map((event) => (
            <EventCard
              key={event.eventId}
              event={event}
              onClick={handleEventClick}
            />
          ))}
        </div>

        {/* No results message */}
        {filteredEvents.length === 0 && (
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
              Không tìm thấy sự kiện nào khớp với "{searchTerm}". Hãy thử tìm
              kiếm với từ khóa khác.
            </p>
            <button
              onClick={() => setSearchTerm("")}
              className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors"
            >
              Xóa bộ lọc
            </button>
          </div>
        )}

        {/* Pagination */}
        {filteredEvents.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            isDarkMode={isDarkMode}
          />
        )}
      </div>
    </div>
  );
};

export default EventsPage;
