import React, { useEffect, useState } from "react";
import { getEvent } from "../../../services/manager";
import { format } from "date-fns";

const EventPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [view, setView] = useState("grid");

  const eventsPerPage = 6;

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      try {
        const result = await getEvent();
        setEvents(result);
      } catch (err) {
        setError("Failed to load events. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  // Get unique locations for filter dropdown
  const locations = [
    ...new Set(
      events.map((event) => {
        const locationParts = event.location.split(",");
        return locationParts.length > 0
          ? locationParts[locationParts.length - 1].trim()
          : event.location;
      }),
    ),
  ];

  // Filter events based on search term and location
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.eventDescription.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLocation =
      selectedLocation === "" || event.location.includes(selectedLocation);

    return matchesSearch && matchesLocation;
  });

  // Sort events by date (nearest first)
  const sortedEvents = [...filteredEvents].sort(
    (a, b) => new Date(a.eventDate) - new Date(b.eventDate),
  );

  // Calculate pagination
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = sortedEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(sortedEvents.length / eventsPerPage);

  // Format date
  const formatEventDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "MMM dd, yyyy • h:mm a");
  };

  // Extract location city
  const getLocationCity = (location) => {
    const parts = location.split(",");
    return parts.length > 1 ? parts[parts.length - 1].trim() : location;
  };

  // Handle page changes
  const goToPage = (pageNumber) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCurrentPage(pageNumber);
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedLocation("");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen text-white">
      <div className="mx-auto px-4 pt-6 pb-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-2xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
            Event
          </h1>
          {/* <p className="text-gray-400 text-lg mb-6">
            Discover and book tickets for the best events happening near you
          </p> */}

          {/* Search and filter bar */}
          <div className="bg-gray-800 bg-opacity-60 backdrop-blur-lg rounded-2xl p-4 md:p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search events..."
                    className="w-full bg-gray-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <svg
                    className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </div>
              </div>

              <div className="md:w-60">
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full bg-gray-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer"
                >
                  <option value="">All Locations</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={resetFilters}
                  className="bg-gray-700 hover:bg-gray-600 rounded-xl p-3 text-gray-300 focus:outline-none"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    ></path>
                  </svg>
                </button>

                <div className="flex bg-gray-700 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setView("grid")}
                    className={`p-3 ${
                      view === "grid" ? "bg-purple-600" : "hover:bg-gray-600"
                    }`}
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                      ></path>
                    </svg>
                  </button>
                  <button
                    onClick={() => setView("list")}
                    className={`p-3 ${
                      view === "list" ? "bg-purple-600" : "hover:bg-gray-600"
                    }`}
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div
            className={`grid ${
              view === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1"
            } gap-6`}
          >
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-gray-800 bg-opacity-40 rounded-2xl p-4 animate-pulse"
              >
                <div className="h-48 w-full bg-gray-700 rounded-xl mb-4"></div>
                <div className="h-6 w-3/4 bg-gray-700 rounded mb-3"></div>
                <div className="h-4 w-1/2 bg-gray-700 rounded mb-2"></div>
                <div className="h-4 w-2/3 bg-gray-700 rounded mb-2"></div>
                <div className="h-4 w-1/2 bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="bg-red-900 bg-opacity-20 border border-red-500 rounded-xl p-6 text-center">
            <svg
              className="h-12 w-12 mx-auto text-red-500 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <p className="text-xl font-medium text-red-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg"
            >
              Try Again
            </button>
          </div>
        )}

        {/* No results state */}
        {!loading && !error && filteredEvents.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-gray-600 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <p className="text-xl text-gray-400 mb-4">
              No events match your search criteria
            </p>
            <button
              onClick={resetFilters}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Event list */}
        {!loading && !error && filteredEvents.length > 0 && (
          <>
            <div className="mb-4 text-gray-400">
              Showing {indexOfFirstEvent + 1}-
              {Math.min(indexOfLastEvent, sortedEvents.length)} of{" "}
              {sortedEvents.length} events
            </div>

            {view === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {currentEvents.map((event) => (
                  <div
                    key={event.eventId}
                    className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700 hover:border-purple-500 transition-all duration-300 group transform hover:-translate-y-1"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={event.eventImage}
                        alt={event.eventName}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://via.placeholder.com/300x150?text=Event+Image";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                      <div className="absolute top-3 right-3">
                        <span className="bg-purple-600 text-xs font-bold px-2 py-1 rounded-full">
                          {new Date(event.eventDate) > new Date()
                            ? "Upcoming"
                            : "Past"}
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex items-center text-xs text-gray-400 mb-2">
                        <svg
                          className="h-4 w-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          ></path>
                        </svg>
                        {formatEventDate(event.eventDate)}
                      </div>

                      <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-purple-400 transition-colors line-clamp-1">
                        {event.eventName}
                      </h3>

                      <div className="flex items-start mb-3">
                        <svg
                          className="h-4 w-4 text-gray-400 mr-1 mt-0.5 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          ></path>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          ></path>
                        </svg>
                        <span className="text-sm text-gray-400 line-clamp-1">
                          {getLocationCity(event.location)}
                        </span>
                      </div>

                      <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                        {event.eventDescription}
                      </p>

                      <button className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm font-medium">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-4 mb-10">
                {currentEvents.map((event) => (
                  <div
                    key={event.eventId}
                    className="flex flex-col md:flex-row bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700 hover:border-purple-500 transition-all duration-300 group"
                  >
                    <div className="md:w-64 relative">
                      <img
                        src={event.eventImage}
                        alt={event.eventName}
                        className="w-full h-full object-cover transition-transform duration-500 min-h-[200px]"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://via.placeholder.com/300x150?text=Event+Image";
                        }}
                      />
                      <div className="absolute top-3 right-3">
                        <span className="bg-purple-600 text-xs font-bold px-2 py-1 rounded-full">
                          {new Date(event.eventDate) > new Date()
                            ? "Upcoming"
                            : "Past"}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 p-5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center text-xs text-gray-400 mb-2">
                          <svg
                            className="h-4 w-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            ></path>
                          </svg>
                          {formatEventDate(event.eventDate)}
                        </div>

                        <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-purple-400 transition-colors">
                          {event.eventName}
                        </h3>

                        <div className="flex items-start mb-3">
                          <svg
                            className="h-4 w-4 text-gray-400 mr-1 mt-0.5 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            ></path>
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            ></path>
                          </svg>
                          <span className="text-sm text-gray-400">
                            {getLocationCity(event.location)}
                          </span>
                        </div>

                        <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                          {event.eventDescription}
                        </p>
                      </div>

                      <div className="flex justify-end">
                        <button className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm font-medium">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-10">
                <div className="flex items-center bg-gray-800 bg-opacity-60 rounded-full p-1">
                  <button
                    onClick={() => goToPage(1)}
                    disabled={currentPage === 1}
                    className="flex items-center justify-center h-8 w-8 rounded-full disabled:opacity-50 disabled:cursor-not-allowed enabled:hover:bg-gray-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center justify-center h-8 w-8 rounded-full disabled:opacity-50 disabled:cursor-not-allowed enabled:hover:bg-gray-700 ml-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {/* Page numbers */}
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i;
                    } else {
                      pageNumber = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => goToPage(pageNumber)}
                        className={`flex items-center justify-center h-8 w-8 rounded-full mx-1 text-sm ${
                          currentPage === pageNumber
                            ? "bg-purple-600 text-white"
                            : "text-gray-300 hover:bg-gray-700"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center justify-center h-8 w-8 rounded-full disabled:opacity-50 disabled:cursor-not-allowed enabled:hover:bg-gray-700 ml-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  <button
                    onClick={() => goToPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="flex items-center justify-center h-8 w-8 rounded-full disabled:opacity-50 disabled:cursor-not-allowed enabled:hover:bg-gray-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 6.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0zm6 0a1 1 0 010-1.414L14.586 10l-4.293-3.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EventPage;
