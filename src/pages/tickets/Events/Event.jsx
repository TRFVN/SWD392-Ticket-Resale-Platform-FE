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

  return (
    <div
      onClick={() => onClick(event)}
      className={`group cursor-pointer rounded-xl overflow-hidden border transition-all duration-300
        ${
          isDarkMode
            ? "bg-gray-800/50 border-gray-700 hover:border-gray-600"
            : "bg-white border-gray-200 hover:border-orange-200"
        }`}
    >
      <div className="p-6">
        {/* Event Header */}
        <div className="flex justify-between items-start mb-4">
          <h3
            className={`text-xl font-bold group-hover:text-orange-500 transition-colors
            ${isDarkMode ? "text-white" : "text-gray-900"}`}
          >
            {event.eventName}
          </h3>
          <span
            className={`px-3 py-1 rounded-full text-sm ${
              event.status === 1
                ? "bg-green-100 text-green-700 dark:bg-green-700/20 dark:text-green-400"
                : "bg-red-100 text-red-700 dark:bg-red-700/20 dark:text-red-400"
            }`}
          >
            {event.status === 1 ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Event Description */}
        <p
          className={`mb-4 line-clamp-2 ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {event.eventDescription}
        </p>

        {/* Event Details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Calendar className="w-4 h-4 text-orange-500" />
            <span>{formatDate(event.eventDate)}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <MapPin className="w-4 h-4 text-orange-500" />
            <span>{`${event.address}, ${event.district}, ${event.city}`}</span>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div
        className={`px-6 py-4 border-t flex justify-end items-center
        ${isDarkMode ? "border-gray-700" : "border-gray-100"}`}
      >
        <button
          className="flex items-center gap-2 text-orange-500 font-medium 
          group-hover:gap-3 transition-all"
        >
          View Details
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isDarkMode = useSelector((state) => state.theme?.isDarkMode);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/api/Event", {
        params: {
          pageNumber: 1,
          pageSize: 10,
        },
      });

      if (response.data.isSuccess) {
        setEvents(response.data.result);
      } else {
        throw new Error(response.data.message);
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
        <p className={`mt-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          Loading events...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="p-6 bg-red-500/10 rounded-full mb-4">
          <AlertCircle className="w-12 h-12 text-red-500" />
        </div>
        <h3
          className={`text-xl font-medium mb-2 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Oops! Something went wrong
        </h3>
        <p
          className={`text-center mb-6 ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {error}
        </p>
        <div className="flex gap-4">
          <button
            onClick={fetchEvents}
            className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!events.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <div
          className={`p-6 rounded-full mb-6 ${
            isDarkMode ? "bg-gray-800" : "bg-gray-100"
          }`}
        >
          <Calendar className="w-12 h-12 text-orange-500" />
        </div>
        <h3
          className={`text-xl font-medium mb-2 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          No events available
        </h3>
        <p
          className={`text-center mb-6 ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Check back later for upcoming events
        </p>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div
              className={`p-3 rounded-lg ${
                isDarkMode ? "bg-orange-500/10" : "bg-orange-100"
              }`}
            >
              <Calendar className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h1
                className={`text-2xl font-bold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Events
              </h1>
              <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                {events.length} events found
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div
            className={`rounded-xl p-4 ${
              isDarkMode ? "bg-gray-800/50" : "bg-white/50"
            }`}
          >
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-orange-500" />
              <p
                className={`${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                } text-sm`}
              >
                Upcoming Events
              </p>
            </div>
            <p
              className={`text-2xl font-bold mt-2 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {events.filter((e) => new Date(e.eventDate) > new Date()).length}
            </p>
          </div>

          <div
            className={`rounded-xl p-4 ${
              isDarkMode ? "bg-gray-800/50" : "bg-white/50"
            }`}
          >
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-orange-500" />
              <p
                className={`${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                } text-sm`}
              >
                Locations
              </p>
            </div>
            <p
              className={`text-2xl font-bold mt-2 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {new Set(events.map((e) => e.city)).size}
            </p>
          </div>

          <div
            className={`rounded-xl p-4 ${
              isDarkMode ? "bg-gray-800/50" : "bg-white/50"
            }`}
          >
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-orange-500" />
              <p
                className={`${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                } text-sm`}
              >
                Active Events
              </p>
            </div>
            <p
              className={`text-2xl font-bold mt-2 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {events.filter((e) => e.status === 1).length}
            </p>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => (
            <EventCard
              key={event.eventId}
              event={event}
              onClick={handleEventClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
