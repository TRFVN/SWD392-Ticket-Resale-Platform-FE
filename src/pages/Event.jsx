import React, { useEffect, useState } from "react";
import {
  Calendar,
  MapPin,
  Loader2,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import axiosInstance from "../config/axiosConfig";

const EventCard = ({ event, onClick }) => {
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
      className="group cursor-pointer bg-white dark:bg-gray-800/50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
    >
      {/* Event Header */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-orange-500 transition-colors">
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

        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
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
      <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700/50 flex justify-end">
        <button className="flex items-center gap-2 text-orange-500 font-medium group-hover:gap-3 transition-all">
          View Details
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Create event service
const eventService = {
  getAllEvents: async (pageNumber = 1, pageSize = 10) => {
    const response = await axiosInstance.get("/api/Event", {
      params: { pageNumber, pageSize },
    });
    return response.data;
  },
};

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await eventService.getAllEvents();
      if (data.isSuccess) {
        setEvents(data.result);
      } else {
        throw new Error(data.message || "Failed to fetch events");
      }
    } catch (err) {
      console.error("Error fetching events:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to fetch events",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEventClick = (event) => {
    window.location.href = `/events/${event.eventId}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
        <p className="mt-4 text-gray-400">Loading events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="p-6 bg-red-500/10 rounded-full mb-4">
          <AlertCircle className="w-12 h-12 text-red-500" />
        </div>
        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
          Oops! Something went wrong
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-center mb-6">
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
            onClick={() => (window.location.href = "/")}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-500/10 rounded-lg">
              <Calendar className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Upcoming Events
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                {events.length} events found
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 shadow-sm">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Total Events
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {events.length}
            </p>
          </div>
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 shadow-sm">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Locations
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {new Set(events.map((e) => e.city)).size}
            </p>
          </div>
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 shadow-sm">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Active Events
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
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
