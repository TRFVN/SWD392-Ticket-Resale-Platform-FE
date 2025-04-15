import React, { useState, useEffect } from "react";
import { getEvent } from "../../../services/manager"; // assuming your API call
import { Table, LayoutList } from "lucide-react"; // or any icon
import { format } from "date-fns";

const EventPage = () => {
  const [events, setEvents] = useState([]);
  const [viewMode, setViewMode] = useState("table"); // 'table' | 'card'
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 6;
  const [isEventLoading, setIsEventLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getEvent();
        setEvents(data);
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

  return (
    <main className="flex flex-col gap-12 p-6">
      <section className="text-white text-3xl font-bold">Event</section>
      {/* Section 1: Search + View Toggle */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Tìm kiếm sự kiện..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-1/2 px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring"
        />
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("table")}
            className={`p-2 rounded-md border ${
              viewMode === "table"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-300"
            }`}
          >
            <Table className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode("card")}
            className={`p-2 rounded-md border ${
              viewMode === "card"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-300"
            }`}
          >
            <LayoutList className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Section 2: Table or Card View */}
      <section className="mb-6">
        {viewMode === "table" ? (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse bg-gray-800 rounded-md">
              <thead className="bg-gray-700 text-gray-300">
                <tr>
                  <th className="p-3 text-left">Ảnh</th>
                  <th className="p-3 text-left">Tên sự kiện</th>
                  <th className="p-3 text-left">Ngày</th>
                  <th className="p-3 text-left">Địa điểm</th>
                </tr>
              </thead>
              <tbody>
                {currentEvents.map((event) => (
                  <tr
                    key={event.eventId}
                    className="border-b border-gray-700 hover:bg-gray-700"
                  >
                    <td className="p-3">
                      <img
                        src={event.eventImage}
                        alt={event.eventName}
                        className="w-16 h-16 rounded object-cover"
                      />
                    </td>
                    <td className="p-3">{event.eventName}</td>
                    <td className="p-3">
                      {format(new Date(event.eventDate), "dd/MM/yyyy HH:mm")}
                    </td>
                    <td className="p-3">{event.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {currentEvents.map((event) => (
              <div
                key={event.eventId}
                className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:shadow-lg transition"
              >
                <img
                  src={event.eventImage}
                  alt={event.eventName}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{event.eventName}</h3>
                  <p className="text-sm text-gray-400 mb-2">
                    {format(new Date(event.eventDate), "dd/MM/yyyy HH:mm")}
                  </p>
                  <p className="text-sm text-gray-300">{event.location}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Section 3: Pagination */}
      <section className="flex justify-center items-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded-md ${
              currentPage === i + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </section>
    </main>
  );
};

export default EventPage;
