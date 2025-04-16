import React, { useEffect, useState } from "react";
import { getEvent, getTicket } from "../../../services/manager";
import { Search, RotateCcw, PieChart, BarChart } from "lucide-react";
import TicketLoading from "../components/TicketLoading";
import {
  Bar,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
const Ticket = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [selectedRank, setSelectedRank] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isEventLoading, setIsEventLoading] = useState(true);
  const [isRotating, setIsRotating] = useState(false);
  const [event, setEvent] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 7;

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await getEvent();
        if (response) setIsEventLoading(false);
        setEvent(response);
      } catch (error) {
        console.log("Lỗi khi lấy event", error);
      }
    };
    const fetchTickets = async () => {
      try {
        const data = await getTicket();
        setTickets(data.data);
        setFilteredTickets(data.data);
      } catch (error) {
        console.error("Lỗi khi lấy ticket:", error);
      }
    };

    fetchEvent();
    fetchTickets();
  }, []);

  useEffect(() => {
    let filtered = [...tickets];

    if (selectedRank) {
      filtered = filtered.filter(
        (t) => t.rank.toLowerCase() === selectedRank.toLowerCase(),
      );
    }

    if (selectedEvent) {
      filtered = filtered.filter((t) => t.eventId === selectedEvent);
    }

    if (searchTerm) {
      filtered = filtered.filter((t) =>
        t.ticketName.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setFilteredTickets(filtered);
    setCurrentPage(1);
  }, [selectedRank, selectedEvent, searchTerm, tickets]);

  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = filteredTickets.slice(
    indexOfFirstTicket,
    indexOfLastTicket,
  );
  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);

  const getEventName = (eventId, events) => {
    const event = events.find((e) => e.eventId === eventId);
    return event ? event.eventName : "Unknown";
  };

  const uniqueRanks = [...new Set(tickets.map((ticket) => ticket.rank))];
  const uniqueEvents = [...new Set(tickets.map((ticket) => ticket.eventId))];

  const handleReset = () => {
    setIsRotating(true);
    setSearchTerm("");
    setSelectedEvent("");
    setSelectedRank("");
    setTimeout(() => setIsRotating(false), 500);
  };
  return (
    <div className="flex flex-col gap-12 p-6">
      <section className="text-white text-3xl font-bold">Ticket</section>
      {isEventLoading ? (
        <TicketLoading />
      ) : (
        <>
          <div className="flex flex-col gap-6">
            <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="relative w-full md:w-1/3">
                <Search
                  className="absolute top-2.5 left-3 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Tìm tên vé..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-manager-secondary text-white border border-gray-600 focus:outline-none"
                />
              </div>
              <div className="flex flex-wrap gap-3 ">
                <div
                  className="bg-indigo-600 border border-gray-600 text-white rounded p-2 cursor-pointer"
                  onClick={handleReset}
                >
                  <RotateCcw
                    className={`transition-transform ${
                      isRotating ? "animate-[spinOnce_0.5s_linear]" : ""
                    }`}
                  />
                </div>

                <select
                  value={selectedRank}
                  onChange={(e) => setSelectedRank(e.target.value)}
                  className="bg-gray-800 border border-gray-600 text-white rounded px-4 py-2 cursor-pointer"
                >
                  <option value="">All Rank</option>
                  {uniqueRanks.map((rank, index) => (
                    <option key={index} value={rank}>
                      {rank}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedEvent}
                  onChange={(e) => setSelectedEvent(e.target.value)}
                  className="bg-gray-800 border border-gray-600 text-white rounded px-4 py-2 cursor-pointer"
                >
                  <option value="">All Event</option>
                  {uniqueEvents.map((eventId, index) => {
                    const eventName = getEventName(eventId, event);
                    return (
                      <option key={index} value={eventId}>
                        {eventName}
                      </option>
                    );
                  })}
                </select>
              </div>
            </section>

            {/* Section 2: Table */}
            <section className="overflow-x-auto rounded-2xl border border-gray-700">
              <table className="min-w-full divide-y divide-gray-700 text-white">
                <thead className="bg-manager-secondary overflow-y-hidden">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">
                      No.
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">
                      Cost
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">
                      Total Quantity
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">
                      Available Quantity
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">
                      Event
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-900 divide-y divide-gray-700">
                  {currentTickets.map((ticket, index) => {
                    const eventName = getEventName(ticket.eventId, event);

                    return (
                      <tr
                        key={ticket.ticketTemplateId}
                        className="hover:bg-gray-800 transition"
                      >
                        <td className="px-6 py-4 text-sm">
                          {(currentPage - 1) * ticketsPerPage + index + 1}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {ticket.ticketName}
                        </td>
                        <td className="px-6 py-4 text-sm">{ticket.rank}</td>
                        <td className="px-6 py-4 text-sm">
                          {ticket.ticketPrice.toLocaleString("vi-VN")} ₫
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {ticket.totalQuantity}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {ticket.availableQuantity}
                        </td>
                        <td className="px-6 py-4 text-sm">{eventName}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
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
    </div>
  );
};

export default Ticket;
