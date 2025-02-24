import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  Calendar,
  MapPin,
  Clock,
  Info,
  Ticket,
  Users,
} from "lucide-react";

const EventDetails = () => {
  const [event, setEvent] = useState(null);
  const isDarkMode = false; // Replace with your theme state

  useEffect(() => {
    // Get event from location state or fetch it
    const currentEvent = window.history.state?.usr?.event;
    if (currentEvent) {
      setEvent(currentEvent);
    }
  }, []);

  if (!event) return null;

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
      className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
    >
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className={`mb-6 flex items-center gap-2 px-4 py-2 rounded-xl ${
            isDarkMode
              ? "bg-gray-800 hover:bg-gray-700 text-gray-200"
              : "bg-white hover:bg-gray-100 text-gray-700"
          } transition-colors`}
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back to Events</span>
        </button>

        {/* Event Header */}
        <div
          className={`p-6 rounded-2xl ${
            isDarkMode ? "bg-gray-800/50" : "bg-white"
          } mb-6`}
        >
          <div className="flex justify-between items-start mb-4">
            <h1
              className={`text-2xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {event.eventName}
            </h1>
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

          {/* Event Time */}
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-orange-500" />
            <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
              {formatDate(event.eventDate)}
            </span>
          </div>

          {/* Event Location */}
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-orange-500" />
            <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
              {`${event.address}, ${event.district}, ${event.city}`}
            </span>
          </div>
        </div>

        {/* Event Description */}
        <div
          className={`p-6 rounded-2xl ${
            isDarkMode ? "bg-gray-800/50" : "bg-white"
          } mb-6`}
        >
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-orange-500" />
            <h2
              className={`text-lg font-semibold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Event Description
            </h2>
          </div>
          <p
            className={`${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            } whitespace-pre-wrap`}
          >
            {event.eventDescription}
          </p>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Event Status */}
          <div
            className={`p-6 rounded-2xl ${
              isDarkMode ? "bg-gray-800/50" : "bg-white"
            }`}
          >
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-orange-500" />
              <h2
                className={`text-lg font-semibold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Event Status
              </h2>
            </div>
            <div
              className={`flex items-center gap-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              <span
                className={`inline-block w-2 h-2 rounded-full ${
                  event.status === 1 ? "bg-green-500" : "bg-red-500"
                }`}
              />
              {event.status === 1
                ? "Event is currently active"
                : "Event is not active"}
            </div>
          </div>

          {/* Event Location Details */}
          <div
            className={`p-6 rounded-2xl ${
              isDarkMode ? "bg-gray-800/50" : "bg-white"
            }`}
          >
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-orange-500" />
              <h2
                className={`text-lg font-semibold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Location Details
              </h2>
            </div>
            <div
              className={`space-y-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              <p>
                <strong>City:</strong> {event.city}
              </p>
              <p>
                <strong>District:</strong> {event.district}
              </p>
              <p>
                <strong>Address:</strong> {event.address}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => (window.location.href = "/tickets")}
            className="flex-1 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Ticket className="w-5 h-5" />
            View Available Tickets
          </button>
          <button
            onClick={() => {
              /* Share functionality */
            }}
            className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-white rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Users className="w-5 h-5" />
            Share Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
