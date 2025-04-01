import React, { useState, useEffect, useContext } from "react";

import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BookMarkedIcon, PencilIcon, PlusIcon } from "lucide-react";
import { getEventByUserID } from "../../services/eventApi";
import { AuthContext } from "../../context/AuthContext";

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openTicketDialog, setOpenTicketDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [ticketForm, setTicketForm] = useState({
    name: "",
    price: "",
    quantity: "",
    type: "STANDARD",
    description: "",
  });

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    try {
      setLoading(true);
      const response = await getEventByUserID(user.id);
      console.log("API response:", response.data);

      if (response.data) {
        if (Array.isArray(response.data)) {
          setEvents(response.data);
        } else if (
          response.data.events &&
          Array.isArray(response.data.events)
        ) {
          setEvents(response.data.events);
        } else if (response.data.data && Array.isArray(response.data.data)) {
          setEvents(response.data.data);
        } else {
          console.error("Unexpected API response format:", response.data);
          setEvents([]);
        }
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to load your events");
      setEvents([]); // Ensure events is an empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleOpenTicketDialog = (event) => {
    setSelectedEvent(event);
    setOpenTicketDialog(true);
  };

  const handleCloseTicketDialog = () => {
    setOpenTicketDialog(false);
    setTicketForm({
      name: "",
      price: "",
      quantity: "",
      type: "STANDARD",
      description: "",
    });
  };

  const handleTicketFormChange = (e) => {
    const { name, value } = e.target;
    setTicketForm({
      ...ticketForm,
      [name]: value,
    });
  };

  const handleCreateTicket = async () => {
    try {
      // Replace with your actual API endpoint
      await axios.post(`/api/events/${selectedEvent.id}/tickets`, ticketForm);
      toast.success("Ticket created successfully");
      handleCloseTicketDialog();
      fetchMyEvents(); // Refresh events to show new ticket
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast.error("Failed to create ticket");
    }
  };

  const handleEditEvent = (eventId) => {
    navigate(`/edit-event/${eventId}`);
  };

  const handleViewTickets = (eventId) => {
    navigate(`/event-tickets/${eventId}`);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">My Events</h1>

      <button
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center mb-6"
        onClick={() => navigate("/create-event")}
      >
        <PlusIcon className="h-5 w-5 mr-2" />
        Create New Event
      </button>

      {loading ? (
        <p className="text-gray-600">Loading your events...</p>
      ) : events.length === 0 ? (
        <p className="text-gray-600">You haven't created any events yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Ensure events is an array before mapping */}
          {Array.isArray(events) &&
            events.map((event) => (
              <div
                key={event.id}
                className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200"
              >
                <img
                  className="w-full h-48 object-cover"
                  src={event.imageUrl || "https://via.placeholder.com/300x140"}
                  alt={event.name}
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{event.name}</h2>
                  <p className="text-gray-600 text-sm mb-1">
                    {new Date(event.startDate).toLocaleDateString()} -{" "}
                    {new Date(event.endDate).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600 text-sm mb-1">
                    Location: {event.location}
                  </p>
                  <p className="text-gray-600 text-sm mb-3">
                    Status:
                    <span
                      className={`ml-1 ${
                        event.status === "ACTIVE"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {event.status}
                    </span>
                  </p>

                  <div className="flex gap-2 mt-4">
                    <button
                      className="flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
                      onClick={() => handleEditEvent(event.id)}
                    >
                      <PencilIcon className="h-4 w-4 mr-1" />
                      Edit
                    </button>
                    <button
                      className="flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
                      onClick={() => handleViewTickets(event.id)}
                    >
                      View Tickets
                    </button>
                    <button
                      className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 ml-auto"
                      onClick={() => handleOpenTicketDialog(event)}
                    >
                      <PlusIcon className="h-4 w-4 mr-1" />
                      Add Tickets
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Ticket Dialog */}
      {openTicketDialog && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Create New Ticket Type for {selectedEvent?.name}
              </h2>
              <button
                onClick={handleCloseTicketDialog}
                className="text-gray-400 hover:text-gray-500"
              >
                <BookMarkedIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="name"
                >
                  Ticket Name*
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={ticketForm.name}
                  onChange={handleTicketFormChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="price"
                >
                  Price*
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={ticketForm.price}
                  onChange={handleTicketFormChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="quantity"
                >
                  Quantity Available*
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={ticketForm.quantity}
                  onChange={handleTicketFormChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="type"
                >
                  Ticket Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={ticketForm.type}
                  onChange={handleTicketFormChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="STANDARD">Standard</option>
                  <option value="VIP">VIP</option>
                  <option value="EARLY_BIRD">Early Bird</option>
                  <option value="GROUP">Group</option>
                </select>
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="description"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={ticketForm.description}
                  onChange={handleTicketFormChange}
                  rows="4"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleCloseTicketDialog}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTicket}
                className={`px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium ${
                  !ticketForm.name || !ticketForm.price || !ticketForm.quantity
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-blue-700"
                }`}
                disabled={
                  !ticketForm.name || !ticketForm.price || !ticketForm.quantity
                }
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyEvents;
