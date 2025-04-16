import React, { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock3,
  MapPinned,
  Ticket,
  ChevronsLeft,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { getTicketByEventId } from "../../../services/manager";

const Detail = ({ event, setIsShowDetail }) => {
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [tickets, setTickets] = useState([]);
  const rankStyle = {
    vip: "text-yellow-300 font-bold bg-yellow-300/20 border border-yellow-300 p-1 rounded-md",
    normal:
      "text-green-300 font-bold bg-green-300/20 border border-green-300 p-1 rounded-md",
    premium:
      "text-purple-400 font-bold bg-purple-400/20 border border-purple-400 p-1 rounded-md",
    deluxe:
      "text-pink-300 font-bold bg-pink-300/20 border border-pink-300 p-1 rounded-md",
    economy:
      "text-blue-300 font-bold bg-blue-300/20 border border-blue-300 p-1 rounded-md",
    standard:
      "text-gray-300 font-bold bg-gray-300/20 border border-gray-300 p-1 rounded-md",
    other:
      "text-white font-bold bg-white/20 border border-white p-1 rounded-md",
  };

  const capitalizeWords = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const result = await getTicketByEventId(event.eventId);
        setTickets(result);
      } catch (error) {
        setTickets([]);
      }
    };
    fetchTickets();
  }, [event.eventId]);

  return (
    <>
      <section className="flex flex-col">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-bold text-primary-dark">
            {event?.eventName}
          </h1>
          <ChevronsLeft
            className="size-14 text-primary-dark p-2 rounded-md cursor-pointer 
      hover:bg-primary/20 hover:scale-105 hover:shadow-lg 
      transition-all duration-200 ease-in-out"
            onClick={() => setIsShowDetail(false)}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-8  text-white">
          {/* LEFT SIDE */}
          <div className="flex-1 bg-gray-800 rounded-2xl border border-gray-700 p-6 shadow-lg max-h-max">
            <img
              src={event?.eventImage}
              alt={event?.eventName}
              className="w-full xs:h-64 lg:h-[500px] object-fill rounded-xl mb-6 border border-gray-700 cursor-pointer hover:opacity-80 transition-all"
              onClick={() => setShowImagePopup(true)}
            />
            <div className="flex flex-col gap-3 text-gray-300 text-sm">
              <div className="flex items-center gap-3">
                <CalendarDays className="w-5 h-5 text-gray-400" />
                {event?.eventDate &&
                  format(new Date(event.eventDate), "dd/MM/yyyy")}
              </div>
              <div className="flex items-center gap-3">
                <Clock3 className="w-5 h-5 text-gray-400" />
                {event?.eventDate && format(new Date(event.eventDate), "HH:mm")}
              </div>
              <div className="flex items-center gap-3">
                <MapPinned className="w-5 h-5 text-gray-400" />
                {event?.location}
              </div>
              <div>
                <strong>Description:</strong>
                <p className="text-gray-400 mt-1">
                  {event?.eventDescription || "No description provided."}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="w-full lg:w-[35%] flex flex-col gap-4">
            <h2 className="text-2xl font-semibold">Tickets</h2>
            {tickets.length === 0 ? (
              <div className="text-center text-gray-400 italic py-10">
                <Ticket className="w-6 h-6 mx-auto mb-2 text-gray-500" />
                This event currently has no available tickets.
              </div>
            ) : (
              tickets.map((ticket) => (
                <div
                  key={ticket.ticketTemplateId}
                  className="bg-gray-800 rounded-lg border border-gray-700 p-4 flex gap-4 items-center cursor-pointer"
                >
                  <img
                    src={ticket.imageTicket}
                    alt={ticket.ticketName}
                    className="w-24 h-24 object-cover rounded border border-gray-600"
                  />
                  <div className="flex flex-col gap-1">
                    <h3 className="font-semibold text-lg text-primary">
                      {ticket.ticketName}
                    </h3>
                    <span className="flex">
                      <span
                        className={`flex items-center gap-1 text-xs p-1 ${
                          rankStyle[ticket.rank?.toLowerCase()] ||
                          rankStyle.other
                        }`}
                      >
                        <Ticket className="inline-block w-4 h-4" />
                        {capitalizeWords(ticket.rank)}
                      </span>
                    </span>
                    <p className="text-sm text-gray-300">
                      Cost: {ticket.ticketPrice.toLocaleString()} VND
                    </p>
                    <p className="text-sm text-gray-400">
                      {ticket.availableQuantity}/{ticket.totalQuantity}{" "}
                      available
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
      {showImagePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <button
            className="absolute top-6 right-6 text-white bg-gray-700 p-2 rounded-full hover:bg-orange-600 transition"
            onClick={() => setShowImagePopup(false)}
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={event?.eventImage}
            alt="Zoomed Event"
            className="max-w-[90%] max-h-[90%] rounded-xl border border-white shadow-2xl"
          />
        </div>
      )}
    </>
  );
};

export default Detail;
