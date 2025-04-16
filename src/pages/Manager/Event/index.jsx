import React, { useState, useEffect } from "react";
import { getEvent } from "../../../services/manager"; // assuming your API call
import {
  Table,
  LayoutList,
  Search,
  CalendarDays,
  Clock3,
  MapPinned,
} from "lucide-react"; // or any icon
import { format } from "date-fns";
import EventLoading from "../components/EventLoading";
import Detail from "./Detail";
const Event = () => {
  const [events, setEvents] = useState([]);
  const [viewMode, setViewMode] = useState("table"); // 'table' | 'card'
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 6;
  const [isEventLoading, setIsEventLoading] = useState(true);
  const [isShowDetail, setIsShowDetail] = useState(false);
  const [eventDetail, setEventDetail] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getEvent();
        setEvents(data);
        setIsEventLoading(false);
      } catch (err) {
        console.error("Lỗi khi lấy event", err);
      }
    };
    fetchData();
  }, []);

  const filteredEvents = events.filter((event) =>
    event.eventName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const indexOfLast = currentPage * eventsPerPage;
  const indexOfFirst = indexOfLast - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  const handleShowDetail = (detail) => {
    setEventDetail(detail);
    setIsShowDetail(true);
  };
  return (
    <main className="flex flex-col gap-12 p-6">
      {!isShowDetail ? (
        <>
          <section className="text-white text-3xl font-bold">Event</section>
          {isEventLoading ? (
            <EventLoading />
          ) : (
            <>
              <div className="flex flex-col gap-6">
                {/* Section 1: Search + View Toggle */}
                <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="relative w-full md:w-1/3">
                    <Search
                      className="absolute top-2.5 left-3 text-gray-400"
                      size={20}
                    />
                    <input
                      type="text"
                      placeholder="Search event..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-lg bg-manager-secondary text-white border border-gray-600 focus:outline-none"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setViewMode("table")}
                      className={`p-2 rounded-md shadow-md ${
                        viewMode === "table"
                          ? "bg-indigo-600 shadow-indigo-600/50 text-white"
                          : "bg-gray-800 shadow-gray-800/50 text-gray-300"
                      }`}
                    >
                      <Table className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode("card")}
                      className={`p-2 rounded-md shadow-md ${
                        viewMode === "card"
                          ? "bg-indigo-600 shadow-indigo-600/50 text-white"
                          : "bg-gray-800 shadow-gray-800/50 text-gray-300"
                      }`}
                    >
                      <LayoutList className="w-5 h-5" />
                    </button>
                  </div>
                </section>

                {/* Section 2: Table or Card View */}
                <section className="mb-6">
                  {viewMode === "table" ? (
                    <div className="overflow-x-auto rounded-2xl border border-gray-700">
                      <table className="min-w-full divide-y divide-gray-700 text-white overflow-hidden">
                        <thead className="bg-manager-secondary">
                          <tr>
                            <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">
                              No.
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">
                              Image
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">
                              Name
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">
                              Time
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">
                              Location
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-gray-900 divide-y divide-gray-700">
                          {currentEvents.map((event, index) => (
                            <tr
                              key={event.eventId}
                              className="hover:bg-gray-800 transition cursor-pointer"
                              onClick={() => handleShowDetail(event)}
                            >
                              <td className="px-6 py-4 text-sm">
                                {(currentPage - 1) * eventsPerPage + index + 1}
                              </td>
                              <td className="px-6 py-4 text-sm">
                                <img
                                  src={event.eventImage}
                                  alt={event.eventName}
                                  className="w-16 h-16 rounded object-cover"
                                />
                              </td>
                              <td className="px-6 py-4 text-sm">
                                {event.eventName}
                              </td>
                              <td className="px-6 py-4 text-sm">
                                {format(
                                  new Date(event.eventDate),
                                  "dd/MM/yyyy",
                                )}
                              </td>
                              <td className="px-6 py-4 text-sm">
                                {format(new Date(event.eventDate), "HH:mm")}
                              </td>
                              <td className="px-6 py-4 text-sm">
                                {event.location}
                              </td>
                              <td className="px-6 py-4 text-sm">
                                <span
                                  className={`px-2 py-1 rounded-md font-semibold border shadow-md ${
                                    new Date(event.eventDate).toDateString() ===
                                    new Date().toDateString()
                                      ? "bg-blue-500/10 text-blue-500 border-blue-500 shadow-blue-500/50"
                                      : new Date(event.eventDate) > new Date()
                                      ? "bg-yellow-500/10 text-yellow-500 border-yellow-500 shadow-yellow-500/50"
                                      : "bg-gray-500/10 text-gray-400 border-gray-500 shadow-gray-500/50"
                                  }`}
                                >
                                  {new Date(event.eventDate).toDateString() ===
                                  new Date().toDateString()
                                    ? "Ongoing"
                                    : new Date(event.eventDate) > new Date()
                                    ? "Upcoming"
                                    : "Ended"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                      {currentEvents.map((event) => (
                        <div
                          key={event.eventId}
                          className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:scale-105 transition cursor-pointer"
                          onClick={() => handleShowDetail(event)}
                        >
                          <img
                            src={event.eventImage}
                            alt={event.eventName}
                            className="w-full h-64 object-cover border-b border-gray-700"
                          />
                          <div className="p-4">
                            <h3 className="text-xl font-bold text-primary mb-4 text-shadow">
                              {event.eventName}
                            </h3>
                            <span className="flex items-center gap-3 text-sm text-gray-400 mb-2">
                              <CalendarDays className="size-4" />
                              {format(new Date(event.eventDate), "dd/MM/yyyy")}
                            </span>
                            <span className="flex items-center gap-3 text-sm text-gray-400 mb-2">
                              <Clock3 className="size-4" />
                              {format(new Date(event.eventDate), "HH:mm")}
                            </span>
                            <span className="flex items-center gap-3 text-sm text-gray-300 italic">
                              <MapPinned className="size-4 flex-shrink-0" />
                              {event.location}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                {/* Section 3: Pagination */}
                <section className="flex justify-center items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    className="px-3 py-1 rounded-md bg-gray-700 text-white disabled:opacity-30"
                  >
                    Prev
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === i + 1
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className="px-3 py-1 rounded-md bg-gray-700 text-white disabled:opacity-30"
                  >
                    Next
                  </button>
                </section>
              </div>
            </>
          )}
        </>
      ) : (
        <Detail event={eventDetail} setIsShowDetail={setIsShowDetail} />
      )}
    </main>
  );
};

export default Event;
