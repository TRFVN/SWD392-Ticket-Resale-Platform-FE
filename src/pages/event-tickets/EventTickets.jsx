import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  ArrowLeftIcon,
  XIcon,
  TicketIcon,
} from "lucide-react";
import { getEventByIdApi } from "../../services/eventApi";
import {
  getTicketTemplatesByEventId,
  updateTicketTemplate,
  deleteTicketTemplate,
  createTicketTemplate,
} from "../../services/ticketApi";

const EventTickets = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openTicketDialog, setOpenTicketDialog] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [ticketForm, setTicketForm] = useState({
    ticketName: "",
    ticketPrice: "",
    totalQuantity: "",
    rank: "STANDARD",
    imageTicket: "",
    isVisible: true,
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState(null);

  useEffect(() => {
    if (eventId) {
      fetchEventDetails();
      fetchEventTickets();
    }
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      const response = await getEventByIdApi(eventId);
      if (response) {
        setEvent(response);
      }
    } catch (error) {
      console.error("Error fetching event details:", error);
      toast.error("Failed to load event details");
    }
  };

  const fetchEventTickets = async () => {
    try {
      setLoading(true);
      const response = await getTicketTemplatesByEventId(eventId);
      if (response && Array.isArray(response.data)) {
        setTickets(response.data);
      } else if (response && Array.isArray(response)) {
        setTickets(response);
      } else {
        setTickets([]);
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
      toast.error("Failed to load tickets");
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateDialog = () => {
    setEditingTicket(null);
    setTicketForm({
      ticketName: "",
      ticketPrice: "",
      totalQuantity: "",
      rank: "STANDARD",
      imageTicket: "",
      isVisible: true,
    });
    setOpenTicketDialog(true);
  };

  const handleOpenEditDialog = (ticket) => {
    setEditingTicket(ticket);
    setTicketForm({
      ticketTemplateId: ticket.ticketTemplateId,
      ticketName: ticket.ticketName,
      ticketPrice: ticket.ticketPrice,
      totalQuantity: ticket.totalQuantity,
      rank: ticket.rank || "STANDARD",
      imageTicket: ticket.imageTicket || ticket.ticketImage || "",
      isVisible: ticket.isVisible !== undefined ? ticket.isVisible : true,
    });
    setOpenTicketDialog(true);
  };

  const handleCloseTicketDialog = () => {
    setOpenTicketDialog(false);
    setEditingTicket(null);
  };

  const handleTicketFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTicketForm({
      ...ticketForm,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSaveTicket = async () => {
    try {
      if (editingTicket) {
        // Update existing ticket
        await updateTicketTemplate({
          ticketTemplateId: editingTicket.ticketTemplateId,
          ticketName: ticketForm.ticketName,
          eventId: eventId,
          ticketPrice: Number(ticketForm.ticketPrice),
          totalQuantity: Number(ticketForm.totalQuantity),
          rank: ticketForm.rank,
          ticketImage: ticketForm.imageTicket,
          isVisible: ticketForm.isVisible,
        });
        toast.success("Ticket updated successfully");
      } else {
        // Create new ticket
        await createTicketTemplate({
          ticketName: ticketForm.ticketName,
          eventId: eventId,
          ticketPrice: Number(ticketForm.ticketPrice),
          totalQuantity: Number(ticketForm.totalQuantity),
          availableQuantity: Number(ticketForm.totalQuantity),
          rank: ticketForm.rank,
          imageTicket: ticketForm.imageTicket || "",
        });
        toast.success("Ticket created successfully");
      }

      handleCloseTicketDialog();
      fetchEventTickets(); // Refresh tickets
    } catch (error) {
      console.error("Error saving ticket:", error);
      toast.error(error.message || "Failed to save ticket");
    }
  };

  const handleConfirmDelete = (ticket) => {
    setTicketToDelete(ticket);
    setShowDeleteConfirm(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setTicketToDelete(null);
  };

  const handleDeleteTicket = async () => {
    try {
      if (!ticketToDelete?.ticketTemplateId) return;

      await deleteTicketTemplate(ticketToDelete.ticketTemplateId);
      toast.success("Ticket deleted successfully");
      setShowDeleteConfirm(false);
      setTicketToDelete(null);
      fetchEventTickets(); // Refresh tickets
    } catch (error) {
      console.error("Error deleting ticket:", error);
      toast.error(error.message || "Failed to delete ticket");
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6 flex items-center">
        <button
          onClick={() => navigate("/my-events")}
          className="mr-4 flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-1" />
          Back
        </button>
        <h1 className="text-3xl font-bold">{event?.name} - Tickets</h1>
      </div>

      <button
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center mb-6"
        onClick={handleOpenCreateDialog}
      >
        <PlusIcon className="h-5 w-5 mr-2" />
        Create New Ticket
      </button>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : tickets.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow-md">
          <TicketIcon className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-4 text-gray-600 text-lg">
            No tickets found for this event
          </p>
          <p className="text-gray-500">Create a ticket to get started!</p>
        </div>
      ) : (
        <div className="overflow-hidden bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Ticket Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Price
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Quantity
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Rank
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tickets.map((ticket) => (
                <tr key={ticket.ticketTemplateId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {ticket.imageTicket || ticket.ticketImage ? (
                        <img
                          src={ticket.imageTicket || ticket.ticketImage}
                          alt={ticket.ticketName}
                          className="h-10 w-10 rounded-full mr-3 object-cover"
                        />
                      ) : (
                        <TicketIcon className="h-10 w-10 text-gray-400 mr-3" />
                      )}
                      <div className="text-sm font-medium text-gray-900">
                        {ticket.ticketName}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      ${parseFloat(ticket.ticketPrice).toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {ticket.availableQuantity !== undefined
                        ? `${ticket.availableQuantity}/${ticket.totalQuantity}`
                        : ticket.totalQuantity}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${
                        ticket.rank === "VIP"
                          ? "bg-purple-100 text-purple-800"
                          : ticket.rank === "EARLY_BIRD"
                          ? "bg-yellow-100 text-yellow-800"
                          : ticket.rank === "GROUP"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {ticket.rank || "STANDARD"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${
                        ticket.isVisible === false
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {ticket.isVisible === false ? "Hidden" : "Visible"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleOpenEditDialog(ticket)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleConfirmDelete(ticket)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create/Edit Ticket Dialog */}
      {openTicketDialog && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editingTicket ? "Edit Ticket" : "Create New Ticket"}
              </h2>
              <button
                onClick={handleCloseTicketDialog}
                className="text-gray-400 hover:text-gray-500"
              >
                <XIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="ticketName"
                >
                  Ticket Name*
                </label>
                <input
                  type="text"
                  id="ticketName"
                  name="ticketName"
                  value={ticketForm.ticketName}
                  onChange={handleTicketFormChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="ticketPrice"
                >
                  Price*
                </label>
                <input
                  type="number"
                  id="ticketPrice"
                  name="ticketPrice"
                  value={ticketForm.ticketPrice}
                  onChange={handleTicketFormChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="totalQuantity"
                >
                  Total Quantity*
                </label>
                <input
                  type="number"
                  id="totalQuantity"
                  name="totalQuantity"
                  value={ticketForm.totalQuantity}
                  onChange={handleTicketFormChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="rank"
                >
                  Ticket Rank
                </label>
                <select
                  id="rank"
                  name="rank"
                  value={ticketForm.rank}
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
                  htmlFor="imageTicket"
                >
                  Ticket Image URL
                </label>
                <input
                  type="text"
                  id="imageTicket"
                  name="imageTicket"
                  value={ticketForm.imageTicket}
                  onChange={handleTicketFormChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {editingTicket && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isVisible"
                    name="isVisible"
                    checked={ticketForm.isVisible}
                    onChange={handleTicketFormChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="isVisible"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Visible to customers
                  </label>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleCloseTicketDialog}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTicket}
                className={`px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium ${
                  !ticketForm.ticketName ||
                  !ticketForm.ticketPrice ||
                  !ticketForm.totalQuantity
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-blue-700"
                }`}
                disabled={
                  !ticketForm.ticketName ||
                  !ticketForm.ticketPrice ||
                  !ticketForm.totalQuantity
                }
              >
                {editingTicket ? "Save Changes" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="text-center">
              <TrashIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Delete Ticket
              </h3>
              <p className="text-sm text-gray-500">
                Are you sure you want to delete this ticket? This action cannot
                be undone.
              </p>
              <p className="mt-2 font-medium">{ticketToDelete?.ticketName}</p>
            </div>

            <div className="flex justify-center gap-3 mt-6">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTicket}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventTickets;
