import React, { useState, useEffect, memo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Calendar,
  MapPin,
  Clock,
  Plus,
  X,
  Save,
  Image as ImageIcon,
  Ticket,
  DollarSign,
  Users,
  Star,
  ChevronUp,
  ChevronDown,
  Hash,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  createTicketTemplate,
  getTicketTemplatesByEventId,
  updateTicketTemplate,
  deleteTicketTemplate,
} from "../../../services/ticketApi";
import { postEventTicket } from "../../../services/ticket";
import { getEventByIdApi } from "../../../services/eventApi";
import axiosInstance from "../../../config/axiosConfig";

const TicketTemplateForm = memo(
  ({ ticket, onUpdate, onDelete, isDarkMode }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [localTicket, setLocalTicket] = useState(ticket);
    const [serialNumberInput, setSerialNumberInput] = useState(
      ticket.serialNumber || "",
    );

    const textPrimary = isDarkMode ? "text-white" : "text-gray-900";
    const textSecondary = isDarkMode ? "text-gray-300" : "text-gray-700";
    const borderColor = isDarkMode ? "border-gray-700" : "border-gray-200";
    const bgElevated = isDarkMode ? "bg-gray-800" : "bg-white";

    // Determine if this is a new ticket
    const isNewTicket =
      ticket.isNew ||
      ticket.ticketTemplateId === "3fa85f64-5717-4562-b3fc-2c963f66afa6";

    // Update local state when parent prop changes
    useEffect(() => {
      setLocalTicket(ticket);
      setSerialNumberInput(ticket.serialNumber || "");
    }, [ticket]);

    const handleChange = (field, value) => {
      const updated = { ...localTicket, [field]: value };
      setLocalTicket(updated);
      onUpdate(updated);
    };

    const handleSerialNumberChange = (value) => {
      setSerialNumberInput(value);
      const updated = { ...localTicket, serialNumber: value };
      setLocalTicket(updated);
      onUpdate(updated);
    };

    const generateSerialNumber = () => {
      // Generate a unique serial number with prefix based on ticket name
      const prefix = localTicket.ticketName
        ? localTicket.ticketName.substring(0, 3).toUpperCase()
        : "TKT";

      const random = Math.random().toString(36).substring(2, 10).toUpperCase();
      const serialNumber = "skdjashkldjksahdkajshdasjkhdk";

      handleSerialNumberChange(serialNumber);
    };

    return (
      <div
        className={`border ${borderColor} rounded-xl overflow-hidden ${
          isNewTicket ? "border-orange-500 border-opacity-50" : ""
        }`}
      >
        {/* Header */}
        <div
          className={`p-4 ${bgElevated} border-b ${borderColor} cursor-pointer ${
            isNewTicket
              ? "bg-orange-50 dark:bg-orange-900 dark:bg-opacity-20"
              : ""
          }`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-lg ${
                  isNewTicket ? "bg-orange-500/20" : "bg-orange-500/10"
                } flex items-center justify-center`}
              >
                <Ticket className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className={`font-medium ${textPrimary}`}>
                    {localTicket.ticketName || "Loại vé mới"}
                  </h3>
                  {isNewTicket && (
                    <span className="px-2 py-0.5 text-xs bg-orange-100 text-orange-700 dark:bg-orange-900 dark:bg-opacity-50 dark:text-orange-400 rounded-full">
                      Mới
                    </span>
                  )}
                </div>
                <p className={`text-sm ${textSecondary}`}>
                  {new Intl.NumberFormat("vi-VN").format(
                    localTicket.ticketPrice || 0,
                  )}
                  đ
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(localTicket);
                }}
                className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"
              >
                <X size={18} />
              </button>
              {isExpanded ? (
                <ChevronUp size={18} className={textSecondary} />
              ) : (
                <ChevronDown size={18} className={textSecondary} />
              )}
            </div>
          </div>
        </div>

        {/* Form fields */}
        {isExpanded && (
          <div className="p-4 space-y-4">
            {/* Ticket name */}
            <div>
              <label
                className={`block text-sm font-medium mb-1 ${textSecondary}`}
              >
                Tên loại vé
              </label>
              <input
                type="text"
                value={localTicket.ticketName || ""}
                onChange={(e) => handleChange("ticketName", e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border ${borderColor} bg-transparent ${textPrimary}`}
                placeholder="VIP, Thường, ..."
              />
            </div>

            {/* Price and Rank */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${textSecondary}`}
                >
                  Giá vé
                </label>
                <div className="relative">
                  <DollarSign
                    size={16}
                    className={`absolute left-3 top-1/2 -translate-y-1/2 ${textSecondary}`}
                  />
                  <input
                    type="number"
                    value={localTicket.ticketPrice || ""}
                    onChange={(e) =>
                      handleChange("ticketPrice", Number(e.target.value))
                    }
                    className={`w-full pl-9 pr-3 py-2 rounded-lg border ${borderColor} bg-transparent ${textPrimary}`}
                    placeholder="0"
                  />
                </div>
              </div>
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${textSecondary}`}
                >
                  Hạng vé
                </label>
                <div className="relative">
                  <Star
                    size={16}
                    className={`absolute left-3 top-1/2 -translate-y-1/2 ${textSecondary}`}
                  />
                  <input
                    type="text"
                    value={localTicket.rank || ""}
                    onChange={(e) => handleChange("rank", e.target.value)}
                    className={`w-full pl-9 pr-3 py-2 rounded-lg border ${borderColor} bg-transparent ${textPrimary}`}
                    placeholder="VIP, Normal"
                  />
                </div>
              </div>
            </div>

            {/* Quantities */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${textSecondary}`}
                >
                  Tổng số vé
                </label>
                <div className="relative">
                  <Users
                    size={16}
                    className={`absolute left-3 top-1/2 -translate-y-1/2 ${textSecondary}`}
                  />
                  <input
                    type="number"
                    value={localTicket.totalQuantity || ""}
                    onChange={(e) =>
                      handleChange("totalQuantity", Number(e.target.value))
                    }
                    className={`w-full pl-9 pr-3 py-2 rounded-lg border ${borderColor} bg-transparent ${textPrimary}`}
                    placeholder="0"
                  />
                </div>
              </div>
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${textSecondary}`}
                >
                  Số vé còn lại
                </label>
                <div className="relative">
                  <Ticket
                    size={16}
                    className={`absolute left-3 top-1/2 -translate-y-1/2 ${textSecondary}`}
                  />
                  <input
                    type="number"
                    value={localTicket.availableQuantity || ""}
                    onChange={(e) =>
                      handleChange("availableQuantity", Number(e.target.value))
                    }
                    className={`w-full pl-9 pr-3 py-2 rounded-lg border ${borderColor} bg-transparent ${textPrimary}`}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label
                className={`block text-sm font-medium mb-1 ${textSecondary}`}
              >
                Hình ảnh vé (URL)
              </label>
              <div className="relative">
                <ImageIcon
                  size={16}
                  className={`absolute left-3 top-1/2 -translate-y-1/2 ${textSecondary}`}
                />
                <input
                  type="text"
                  value={localTicket.imageTicket || ""}
                  onChange={(e) => handleChange("imageTicket", e.target.value)}
                  className={`w-full pl-9 pr-3 py-2 rounded-lg border ${borderColor} bg-transparent ${textPrimary}`}
                  placeholder="https://..."
                />
              </div>
            </div>

            {/* Serial Number (Simplified) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className={`text-sm font-medium ${textSecondary}`}>
                  Mã số vé (Serial Number)
                </label>
                <button
                  onClick={generateSerialNumber}
                  type="button"
                  className="text-xs text-orange-500 hover:text-orange-600"
                >
                  Tạo tự động
                </button>
              </div>

              <div className="relative">
                <Hash
                  size={16}
                  className={`absolute left-3 top-1/2 -translate-y-1/2 ${textSecondary}`}
                />
                <input
                  type="text"
                  value={serialNumberInput}
                  onChange={(e) => handleSerialNumberChange(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2 rounded-lg border ${borderColor} bg-transparent ${textPrimary}`}
                  placeholder="Nhập mã số vé..."
                />
              </div>
              <p className={`mt-1 text-xs ${textSecondary}`}>
                Một mã serial sẽ được sử dụng cho tất cả vé của loại này
              </p>
            </div>
          </div>
        )}
      </div>
    );
  },
);

TicketTemplateForm.displayName = "TicketTemplateForm";

const EditEvent = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const isDarkMode = useSelector((state) => state.theme?.isDarkMode);
  const [event, setEvent] = useState(null);
  const [ticketTemplates, setTicketTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);

  // Theme colors
  const bgBase = isDarkMode ? "bg-gray-900" : "bg-gray-50";
  const bgElevated = isDarkMode ? "bg-gray-800" : "bg-white";
  const textPrimary = isDarkMode ? "text-white" : "text-gray-900";
  const textSecondary = isDarkMode ? "text-gray-300" : "text-gray-700";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-200";

  // Fetch event and ticket templates data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetchLoading(true);
        setError(null);

        // Fetch event data
        const eventResponse = await getEventByIdApi(eventId);
        setEvent(eventResponse);

        // Fetch ticket templates
        const ticketsResponse = await getTicketTemplatesByEventId(eventId);
        if (Array.isArray(ticketsResponse)) {
          setTicketTemplates(ticketsResponse);
        } else if (ticketsResponse && Array.isArray(ticketsResponse.result)) {
          setTicketTemplates(ticketsResponse.result);
        } else {
          setTicketTemplates([]);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "Không thể tải dữ liệu, vui lòng thử lại sau");
        toast.error("Không thể tải dữ liệu, vui lòng thử lại sau");
      } finally {
        setFetchLoading(false);
      }
    };

    if (eventId) {
      fetchData();
    }
  }, [eventId]);

  const handleAddTicket = () => {
    // Use the default ticketTemplateId as requested
    const newTicket = {
      ticketTemplateId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      ticketName: "",
      eventId: eventId,
      imageTicket: "",
      ticketPrice: 0,
      totalQuantity: 0,
      availableQuantity: 0,
      rank: "",
      serialNumber: "",
      isNew: true, // Flag to identify new tickets
    };
    setTicketTemplates([...ticketTemplates, newTicket]);
  };

  const handleUpdateTicket = (updatedTicket) => {
    setTicketTemplates((tickets) =>
      tickets.map((t) =>
        t.ticketTemplateId === updatedTicket.ticketTemplateId
          ? updatedTicket
          : t,
      ),
    );
  };

  const handleDeleteTicket = async (ticket) => {
    // If it's a new ticket that hasn't been saved yet, just remove it from state
    if (ticket.isNew) {
      setTicketTemplates((tickets) =>
        tickets.filter((t) => t.ticketTemplateId !== ticket.ticketTemplateId),
      );
      return;
    }

    try {
      setLoading(true);
      // Delete the ticket from the API
      await deleteTicketTemplate(ticket.ticketTemplateId);

      // Remove from state
      setTicketTemplates((tickets) =>
        tickets.filter((t) => t.ticketTemplateId !== ticket.ticketTemplateId),
      );

      toast.success("Đã xóa loại vé thành công");
    } catch (error) {
      console.error("Error deleting ticket:", error);
      toast.error("Không thể xóa loại vé, vui lòng thử lại sau");
    } finally {
      setLoading(false);
    }
  };

  const submitSerialNumbers = async (ticket) => {
    if (!ticket.serialNumber) {
      return null;
    }

    try {
      // Create a single object with ticketTemplateId and serialNumber
      const serialNumberPayload = {
        ticketTemplateId: ticket.ticketTemplateId,
        serialNumber: ticket.serialNumber,
      };

      // Submit just one serial number per ticket template
      const response = await axiosInstance.post(
        "api/ticket-serial-number",
        [serialNumberPayload], // Wrap in array as API expects an array
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error("Error submitting serial number:", error);
      throw new Error("Không thể lưu mã số vé");
    }
  };

  const handleSaveNewTickets = async () => {
    try {
      setLoading(true);

      // Get only new tickets
      const newTickets = ticketTemplates.filter(
        (ticket) =>
          ticket.isNew ||
          ticket.ticketTemplateId === "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      );

      if (newTickets.length === 0) {
        toast.info("Không có vé mới để tạo");
        setLoading(false);
        return;
      }

      // Validate new tickets before saving
      const invalidTickets = newTickets.filter(
        (ticket) =>
          !ticket.ticketName ||
          !ticket.ticketPrice ||
          !ticket.rank ||
          !ticket.totalQuantity ||
          ticket.totalQuantity < ticket.availableQuantity,
      );

      if (invalidTickets.length > 0) {
        toast.error("Vui lòng điền đầy đủ thông tin vé và kiểm tra số lượng");
        setLoading(false);
        return;
      }

      // Format new tickets according to API requirements
      const formattedNewTickets = newTickets.map((ticket) => ({
        ticketTemplateId: ticket.ticketTemplateId,
        ticketName: ticket.ticketName,
        eventId: eventId,
        imageTicket: ticket.imageTicket || "",
        ticketPrice: ticket.ticketPrice,
        totalQuantity: ticket.totalQuantity,
        availableQuantity: ticket.availableQuantity,
        rank: ticket.rank,
        isValid: true,
      }));

      // Create new tickets
      const response = await postEventTicket(formattedNewTickets);
      const createdTickets = response || [];

      // Update the ticketTemplates state with the new IDs from response
      if (Array.isArray(createdTickets) && createdTickets.length > 0) {
        const updatedTicketTemplates = [...ticketTemplates];

        // Replace temporary IDs with the new ones and submit serial numbers immediately
        for (let i = 0; i < createdTickets.length; i++) {
          const createdTicket = createdTickets[i];
          const index = updatedTicketTemplates.findIndex(
            (t) =>
              t.ticketName === createdTicket.ticketName &&
              (t.isNew ||
                t.ticketTemplateId === "3fa85f64-5717-4562-b3fc-2c963f66afa6"),
          );

          if (index !== -1) {
            // Update state with new ID
            updatedTicketTemplates[index] = {
              ...updatedTicketTemplates[index],
              ticketTemplateId: createdTicket.ticketTemplateId,
              isNew: false,
            };

            // Submit serial number immediately if one exists
            if (updatedTicketTemplates[index].serialNumber) {
              try {
                await submitSerialNumbers({
                  ...updatedTicketTemplates[index],
                  ticketTemplateId: createdTicket.ticketTemplateId,
                });
              } catch (error) {
                console.error("Error submitting serial number:", error);
                toast.error(
                  `Lỗi khi tạo mã số vé cho "${createdTicket.ticketName}"`,
                );
              }
            }
          }
        }

        setTicketTemplates(updatedTicketTemplates);
        toast.success("Đã tạo vé mới thành công");
      }
    } catch (error) {
      console.error("Error creating new tickets:", error);
      toast.error(error.message || "Có lỗi xảy ra khi tạo vé mới");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateExistingTickets = async () => {
    try {
      setLoading(true);

      // Get only existing tickets
      const existingTickets = ticketTemplates.filter(
        (ticket) =>
          !ticket.isNew &&
          ticket.ticketTemplateId !== "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      );

      if (existingTickets.length === 0) {
        toast.info("Không có vé hiện tại để cập nhật");
        setLoading(false);
        return;
      }

      // Validate existing tickets
      const invalidTickets = existingTickets.filter(
        (ticket) =>
          !ticket.ticketName ||
          !ticket.ticketPrice ||
          !ticket.rank ||
          !ticket.totalQuantity ||
          ticket.totalQuantity < ticket.availableQuantity,
      );

      if (invalidTickets.length > 0) {
        toast.error("Vui lòng điền đầy đủ thông tin vé và kiểm tra số lượng");
        setLoading(false);
        return;
      }

      // Update existing tickets and collect serial number promises
      const updatePromises = [];
      const serialPromises = [];

      for (const ticket of existingTickets) {
        // Add update promise
        updatePromises.push(
          updateTicketTemplate({
            ticketTemplateId: ticket.ticketTemplateId,
            ticketName: ticket.ticketName,
            eventId: eventId,
            imageTicket: ticket.imageTicket || "",
            ticketPrice: ticket.ticketPrice,
            totalQuantity: ticket.totalQuantity,
            availableQuantity: ticket.availableQuantity,
            rank: ticket.rank,
            isValid: true,
          }),
        );

        // If ticket has serial number, add to serial promises
        if (ticket.serialNumber) {
          serialPromises.push(submitSerialNumbers(ticket));
        }
      }

      // Wait for updates to complete
      await Promise.all(updatePromises);

      // Then submit serial numbers for updated tickets
      if (serialPromises.length > 0) {
        await Promise.all(serialPromises);
      }

      toast.success("Đã cập nhật vé thành công");
    } catch (error) {
      console.error("Error updating existing tickets:", error);
      toast.error(error.message || "Có lỗi xảy ra khi cập nhật vé");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAll = async () => {
    try {
      setLoading(true);

      // First save new tickets
      const newTickets = ticketTemplates.filter(
        (ticket) =>
          ticket.isNew ||
          ticket.ticketTemplateId === "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      );

      if (newTickets.length > 0) {
        // Validate new tickets
        const invalidNewTickets = newTickets.filter(
          (ticket) =>
            !ticket.ticketName ||
            !ticket.ticketPrice ||
            !ticket.rank ||
            !ticket.totalQuantity ||
            ticket.totalQuantity < ticket.availableQuantity,
        );

        if (invalidNewTickets.length > 0) {
          toast.error(
            "Vui lòng điền đầy đủ thông tin vé mới và kiểm tra số lượng",
          );
          setLoading(false);
          return;
        }

        const formattedNewTickets = newTickets.map((ticket) => ({
          ticketTemplateId: ticket.ticketTemplateId,
          ticketName: ticket.ticketName,
          eventId: eventId,
          imageTicket: ticket.imageTicket || "",
          ticketPrice: ticket.ticketPrice,
          totalQuantity: ticket.totalQuantity,
          availableQuantity: ticket.availableQuantity,
          rank: ticket.rank,
          isValid: true,
        }));

        // Create new tickets
        const response = await postEventTicket(formattedNewTickets);
        const createdTickets = response || [];

        // Update ticket states with new IDs and submit serial numbers
        if (Array.isArray(createdTickets) && createdTickets.length > 0) {
          const updatedTicketTemplates = [...ticketTemplates];

          // Replace temporary IDs and submit serial numbers
          for (let i = 0; i < createdTickets.length; i++) {
            const createdTicket = createdTickets[i];
            const index = updatedTicketTemplates.findIndex(
              (t) =>
                t.ticketName === createdTicket.ticketName &&
                (t.isNew ||
                  t.ticketTemplateId ===
                    "3fa85f64-5717-4562-b3fc-2c963f66afa6"),
            );

            if (index !== -1) {
              // Update state with new ID
              updatedTicketTemplates[index] = {
                ...updatedTicketTemplates[index],
                ticketTemplateId: createdTicket.ticketTemplateId,
                isNew: false,
              };

              // Submit serial number immediately
              if (updatedTicketTemplates[index].serialNumber) {
                try {
                  await submitSerialNumbers({
                    ...updatedTicketTemplates[index],
                    ticketTemplateId: createdTicket.ticketTemplateId,
                  });
                } catch (error) {
                  console.error("Error submitting serial number:", error);
                  toast.error(
                    `Lỗi khi tạo mã số vé cho "${createdTicket.ticketName}"`,
                  );
                }
              }
            }
          }

          // Update state with new tickets
          setTicketTemplates(updatedTicketTemplates);
        }
      }

      // Then update existing tickets
      const existingTickets = ticketTemplates.filter(
        (ticket) =>
          !ticket.isNew &&
          ticket.ticketTemplateId !== "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      );

      if (existingTickets.length > 0) {
        // Validate existing tickets
        const invalidExistingTickets = existingTickets.filter(
          (ticket) =>
            !ticket.ticketName ||
            !ticket.ticketPrice ||
            !ticket.rank ||
            !ticket.totalQuantity ||
            ticket.totalQuantity < ticket.availableQuantity,
        );

        if (invalidExistingTickets.length > 0) {
          toast.error(
            "Vui lòng điền đầy đủ thông tin vé hiện có và kiểm tra số lượng",
          );
          setLoading(false);
          return;
        }

        // Update existing tickets
        const updatePromises = [];
        const serialPromises = [];

        for (const ticket of existingTickets) {
          updatePromises.push(
            updateTicketTemplate({
              ticketTemplateId: ticket.ticketTemplateId,
              ticketName: ticket.ticketName,
              eventId: eventId,
              imageTicket: ticket.imageTicket || "",
              ticketPrice: ticket.ticketPrice,
              totalQuantity: ticket.totalQuantity,
              availableQuantity: ticket.availableQuantity,
              rank: ticket.rank,
              isValid: true,
            }),
          );

          if (ticket.serialNumber) {
            serialPromises.push(submitSerialNumbers(ticket));
          }
        }

        await Promise.all(updatePromises);

        if (serialPromises.length > 0) {
          await Promise.all(serialPromises);
        }
      }

      toast.success("Đã lưu tất cả vé thành công");
      navigate("/my-events");
    } catch (error) {
      console.error("Error saving all tickets:", error);
      toast.error(error.message || "Có lỗi xảy ra khi lưu vé");
    } finally {
      setLoading(false);
    }
  };

  // Main save function now just redirects to the right handler
  const handleSave = async () => {
    // Check if we have any tickets
    if (ticketTemplates.length === 0) {
      toast.error("Vui lòng thêm ít nhất một loại vé");
      return;
    }

    // Check if we have new tickets
    const hasNewTickets = ticketTemplates.some(
      (ticket) =>
        ticket.isNew ||
        ticket.ticketTemplateId === "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    );

    // Check if we have existing tickets
    const hasExistingTickets = ticketTemplates.some(
      (ticket) =>
        !ticket.isNew &&
        ticket.ticketTemplateId !== "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    );

    // If we have both types, suggest using the specific buttons
    if (hasNewTickets && hasExistingTickets) {
      toast.info(
        "Vui lòng sử dụng nút riêng để tạo vé mới hoặc cập nhật vé hiện có",
      );
    }
    // If we only have new tickets
    else if (hasNewTickets) {
      await handleSaveNewTickets();
    }
    // If we only have existing tickets
    else if (hasExistingTickets) {
      await handleUpdateExistingTickets();
    }
  };

  if (fetchLoading) {
    return (
      <div
        className={`min-h-screen ${bgBase} flex items-center justify-center`}
      >
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-t-2 border-r-2 border-orange-500 rounded-full animate-spin mb-4"></div>
          <p className={textSecondary}>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`min-h-screen ${bgBase} flex items-center justify-center p-4`}
      >
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className={`${textPrimary} text-xl font-bold mb-2`}>
            Có lỗi xảy ra
          </h2>
          <p className={textSecondary}>{error}</p>
          <button
            onClick={() => navigate("/my-events")}
            className="mt-6 px-4 py-2 bg-orange-500 text-white rounded-lg flex items-center gap-2 mx-auto"
          >
            <ArrowLeft size={18} />
            <span>Quay lại danh sách sự kiện</span>
          </button>
        </div>
      </div>
    );
  }

  if (!event) return null;

  return !event ? null : (
    <div className={`min-h-screen ${bgBase}`}>
      {/* Top navigation bar */}
      <div
        className={`sticky top-0 z-10 border-b ${borderColor} ${bgElevated}`}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/my-events")}
              className={`p-2 rounded-lg ${borderColor} border hover:bg-gray-100 dark:hover:bg-gray-700`}
            >
              <ArrowLeft size={18} className={textSecondary} />
            </button>
            <h1 className={`text-xl font-bold ${textPrimary}`}>
              {event.eventName}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(`/events/${eventId}/tickets`)}
              className={`flex items-center gap-2 px-3 py-1.5 border ${borderColor} rounded-lg ${textSecondary} hover:bg-gray-100 dark:hover:bg-gray-700 text-sm`}
            >
              <Ticket size={16} />
              <span>Xem vé</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Event info and quick actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Event card */}
            <div
              className={`rounded-xl ${bgElevated} border ${borderColor} overflow-hidden sticky top-20`}
            >
              <div className="relative h-40 overflow-hidden">
                <img
                  src={
                    event.eventImage ||
                    "https://via.placeholder.com/800x400?text=Event+Image"
                  }
                  alt={event.eventName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/800x400?text=No+Image";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4">
                  <span className="px-2 py-1 bg-orange-500 text-white text-xs font-medium rounded-full">
                    Quản lý vé
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h2 className={`text-lg font-medium ${textPrimary}`}>
                  {event.eventName}
                </h2>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-orange-500" />
                    </div>
                    <div>
                      <p className={`text-xs ${textSecondary}`}>Ngày & Giờ</p>
                      <p className={`text-sm ${textPrimary}`}>
                        {new Date(event.eventDate).toLocaleDateString("vi-VN")}{" "}
                        -{" "}
                        {new Date(event.eventDate).toLocaleTimeString("vi-VN")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-orange-500" />
                    </div>
                    <div>
                      <p className={`text-xs ${textSecondary}`}>Địa điểm</p>
                      <p className={`text-sm ${textPrimary}`}>
                        {event.location}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick help */}
            <div
              className={`rounded-xl ${bgElevated} border ${borderColor} p-4`}
            >
              <h3 className={`font-medium ${textPrimary} mb-3`}>
                Hướng dẫn nhanh
              </h3>
              <ul className={`${textSecondary} text-sm space-y-2`}>
                <li className="flex gap-2">
                  <div className="w-5 h-5 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs text-orange-500">1</span>
                  </div>
                  <span>Tạo nhiều loại vé khác nhau cho sự kiện của bạn</span>
                </li>
                <li className="flex gap-2">
                  <div className="w-5 h-5 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs text-orange-500">2</span>
                  </div>
                  <span>Thiết lập số lượng và giá vé cho từng loại</span>
                </li>
                <li className="flex gap-2">
                  <div className="w-5 h-5 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs text-orange-500">3</span>
                  </div>
                  <span>Lưu loại vé mới hoặc cập nhật vé hiện có</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right column - Ticket Management */}
          <div className="lg:col-span-2">
            {/* Header with badge */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <h2 className={`text-xl font-bold ${textPrimary}`}>Loại vé</h2>
                {ticketTemplates.length > 0 && (
                  <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs font-medium rounded-full">
                    {ticketTemplates.length}
                  </span>
                )}
              </div>
              <button
                onClick={handleAddTicket}
                className="flex items-center gap-2 px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition text-sm shadow-sm"
              >
                <Plus size={16} />
                <span>Thêm loại vé</span>
              </button>
            </div>

            {/* Empty state */}
            {ticketTemplates.length === 0 && (
              <div
                className={`${bgElevated} rounded-xl border ${borderColor} p-8 flex flex-col items-center justify-center text-center`}
              >
                <div className="p-4 rounded-full bg-orange-100 dark:bg-orange-900/30 mb-4">
                  <Ticket className="w-10 h-10 text-orange-500" />
                </div>
                <h3 className={`text-lg font-medium ${textPrimary} mb-2`}>
                  Chưa có loại vé nào
                </h3>
                <p className={`text-sm ${textSecondary} mb-6 max-w-md`}>
                  Tạo các loại vé khác nhau cho sự kiện của bạn, chẳng hạn như
                  vé VIP, vé thường hoặc vé ưu đãi để người tham dự có nhiều lựa
                  chọn.
                </p>
                <button
                  onClick={handleAddTicket}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition shadow-sm"
                >
                  <Plus size={18} />
                  <span>Tạo loại vé đầu tiên</span>
                </button>
              </div>
            )}

            {/* Ticket tabs if we have tickets */}
            {ticketTemplates.length > 0 && (
              <div className="space-y-6">
                {/* Tab navigation for ticket types */}
                <div className={`border-b ${borderColor} mb-4`}>
                  <div className="flex space-x-4">
                    {/* New tickets tab */}
                    {ticketTemplates.some(
                      (ticket) =>
                        ticket.isNew ||
                        ticket.ticketTemplateId ===
                          "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                    ) && (
                      <div
                        className={`px-4 py-2 border-b-2 border-orange-500 text-orange-500 font-medium flex items-center gap-1`}
                      >
                        <Plus size={16} />
                        <span>Vé mới</span>
                        <span className="ml-1 w-5 h-5 rounded-full bg-orange-100 text-orange-500 text-xs flex items-center justify-center">
                          {
                            ticketTemplates.filter(
                              (ticket) =>
                                ticket.isNew ||
                                ticket.ticketTemplateId ===
                                  "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                            ).length
                          }
                        </span>
                      </div>
                    )}

                    {/* Existing tickets tab */}
                    {ticketTemplates.some(
                      (ticket) =>
                        !ticket.isNew &&
                        ticket.ticketTemplateId !==
                          "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                    ) && (
                      <div
                        className={`px-4 py-2 border-b-2 border-blue-500 text-blue-500 font-medium flex items-center gap-1`}
                      >
                        <Ticket size={16} />
                        <span>Vé hiện có</span>
                        <span className="ml-1 w-5 h-5 rounded-full bg-blue-100 text-blue-500 text-xs flex items-center justify-center">
                          {
                            ticketTemplates.filter(
                              (ticket) =>
                                !ticket.isNew &&
                                ticket.ticketTemplateId !==
                                  "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                            ).length
                          }
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* New Tickets Section */}
                {ticketTemplates.some(
                  (ticket) =>
                    ticket.isNew ||
                    ticket.ticketTemplateId ===
                      "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                ) && (
                  <div
                    className={`p-5 rounded-xl ${bgElevated} border ${borderColor} border-orange-200 dark:border-orange-900/30`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3
                        className={`font-medium ${textPrimary} flex items-center gap-2`}
                      >
                        <div className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                          <Plus className="w-3 h-3 text-orange-500" />
                        </div>
                        Vé mới chờ tạo
                      </h3>

                      <button
                        onClick={handleSaveNewTickets}
                        disabled={loading}
                        className={`flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition text-sm ${
                          loading ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                      >
                        {loading ? (
                          <>
                            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Đang tạo...</span>
                          </>
                        ) : (
                          <>
                            <Save size={14} />
                            <span>Tạo vé mới</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="space-y-3">
                      {ticketTemplates
                        .filter(
                          (ticket) =>
                            ticket.isNew ||
                            ticket.ticketTemplateId ===
                              "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                        )
                        .map((ticket) => (
                          <TicketTemplateForm
                            key={ticket.ticketTemplateId}
                            ticket={ticket}
                            onUpdate={handleUpdateTicket}
                            onDelete={handleDeleteTicket}
                            isDarkMode={isDarkMode}
                          />
                        ))}
                    </div>
                  </div>
                )}

                {/* Existing Tickets Section */}
                {ticketTemplates.some(
                  (ticket) =>
                    !ticket.isNew &&
                    ticket.ticketTemplateId !==
                      "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                ) && (
                  <div
                    className={`p-5 rounded-xl ${bgElevated} border ${borderColor} border-blue-200 dark:border-blue-900/30`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3
                        className={`font-medium ${textPrimary} flex items-center gap-2`}
                      >
                        <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <Ticket className="w-3 h-3 text-blue-500" />
                        </div>
                        Vé hiện có
                      </h3>

                      <button
                        onClick={handleUpdateExistingTickets}
                        disabled={loading}
                        className={`flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm ${
                          loading ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                      >
                        {loading ? (
                          <>
                            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Đang cập nhật...</span>
                          </>
                        ) : (
                          <>
                            <Save size={14} />
                            <span>Cập nhật vé</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="space-y-3">
                      {ticketTemplates
                        .filter(
                          (ticket) =>
                            !ticket.isNew &&
                            ticket.ticketTemplateId !==
                              "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                        )
                        .map((ticket) => (
                          <TicketTemplateForm
                            key={ticket.ticketTemplateId}
                            ticket={ticket}
                            onUpdate={handleUpdateTicket}
                            onDelete={handleDeleteTicket}
                            isDarkMode={isDarkMode}
                          />
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Combined save button - floating at bottom */}
            {ticketTemplates.some(
              (ticket) =>
                ticket.isNew ||
                ticket.ticketTemplateId ===
                  "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            ) &&
              ticketTemplates.some(
                (ticket) =>
                  !ticket.isNew &&
                  ticket.ticketTemplateId !==
                    "3fa85f64-5717-4562-b3fc-2c963f66afa6",
              ) && (
                <div className="fixed bottom-8 right-8 z-10">
                  <button
                    onClick={handleSaveAll}
                    disabled={loading}
                    className={`flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-orange-500 to-blue-500 text-white rounded-full shadow-lg hover:shadow-xl transition ${
                      loading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Đang xử lý...</span>
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        <span className="font-medium">Lưu tất cả</span>
                      </>
                    )}
                  </button>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(EditEvent);
