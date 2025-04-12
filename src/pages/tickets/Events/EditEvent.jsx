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
} from "lucide-react";
import { toast } from "react-toastify";
import { createTicketTemplate } from "../../../services/ticketApi";
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
      const serialNumber = `${prefix}-${random}-${Date.now()}`;

      handleSerialNumberChange(serialNumber);
    };

    return (
      <div className={`border ${borderColor} rounded-xl overflow-hidden`}>
        {/* Header */}
        <div
          className={`p-4 ${bgElevated} border-b ${borderColor} cursor-pointer`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center`}
              >
                <Ticket className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <h3 className={`font-medium ${textPrimary}`}>
                  {localTicket.ticketName || "Loại vé mới"}
                </h3>
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

  // Theme colors
  const bgBase = isDarkMode ? "bg-gray-900" : "bg-gray-50";
  const bgElevated = isDarkMode ? "bg-gray-800" : "bg-white";
  const textPrimary = isDarkMode ? "text-white" : "text-gray-900";
  const textSecondary = isDarkMode ? "text-gray-300" : "text-gray-700";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-200";

  useEffect(() => {
    // Use the provided event data
    setEvent({
      eventId: "1582cc5d-b586-42a6-b78b-4a3856796f14",
      eventName: "ronaldo ra mắt clb hà nội",
      eventDate: "2026-02-20T05:20:00Z",
      eventDescription: "anh 8 hết thời\n",
      eventImage:
        "https://storage.googleapis.com/tickethub-af919.appspot.com/EventImages/faaf5002-7b98-401f-b7bc-f4b9ef0bfe00_images.jpg",
      location: "HCM, Quận Ba Đình, Thành phố Hà Nội",
      status: 1,
      categoryId: "841d3c6e-ee0e-49fc-97cf-9620c9d66768",
    });
  }, [eventId]);

  const handleAddTicket = () => {
    // Generate a random UUID for new ticket
    const uuid = crypto.randomUUID
      ? crypto.randomUUID()
      : "3fa85f64-5717-4562-b3fc-2c963f66afa6";

    const newTicket = {
      ticketTemplateId: uuid,
      ticketName: "",
      eventId: eventId,
      imageTicket: "",
      ticketPrice: 0,
      totalQuantity: 0,
      availableQuantity: 0,
      rank: "",
      serialNumber: "",
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

  const handleDeleteTicket = (ticket) => {
    setTicketTemplates((tickets) =>
      tickets.filter((t) => t.ticketTemplateId !== ticket.ticketTemplateId),
    );
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
      throw new Error("Failed to submit serial number");
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      // Validate tickets before saving
      if (ticketTemplates.length === 0) {
        toast.error("Vui lòng thêm ít nhất một loại vé");
        setLoading(false);
        return;
      }

      const invalidTickets = ticketTemplates.filter(
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

      // Validate serial numbers
      const missingSerialNumbers = ticketTemplates.filter(
        (ticket) => !ticket.serialNumber,
      );

      if (missingSerialNumbers.length > 0) {
        toast.error("Vui lòng nhập mã số vé cho mỗi loại vé");
        setLoading(false);
        return;
      }

      // Save each ticket template first
      const savePromises = ticketTemplates.map((ticket) =>
        createTicketTemplate({
          ...ticket,
          eventId: eventId,
        }),
      );

      const savedTickets = await Promise.all(savePromises);

      // Then submit serial numbers for each ticket
      const serialPromises = ticketTemplates.map((ticket) =>
        submitSerialNumbers(ticket),
      );

      await Promise.all(serialPromises);

      toast.success("Đã lưu thông tin vé thành công");
      navigate("/my-events");
    } catch (error) {
      console.error("Error saving tickets:", error);
      toast.error(error.message || "Có lỗi xảy ra khi lưu thông tin vé");
    } finally {
      setLoading(false);
    }
  };

  if (!event) return null;

  return (
    <div className={`min-h-screen ${bgBase} py-8`}>
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className={`text-2xl font-bold ${textPrimary}`}>
            Chỉnh sửa sự kiện
          </h1>
          <button
            onClick={handleSave}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Đang lưu...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>Lưu thay đổi</span>
              </>
            )}
          </button>
        </div>

        {/* Event info preview */}
        <div
          className={`p-6 rounded-2xl ${bgElevated} border ${borderColor} mb-6`}
        >
          <div className="flex items-start gap-4">
            <img
              src={event.eventImage}
              alt={event.eventName}
              className="w-24 h-24 rounded-xl object-cover"
            />
            <div>
              <h2 className={`text-xl font-medium ${textPrimary}`}>
                {event.eventName}
              </h2>
              <div className="flex items-center gap-4 mt-2 text-sm">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-orange-500" />
                  <span className={textSecondary}>
                    {new Date(event.eventDate).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span className={textSecondary}>
                    {new Date(event.eventDate).toLocaleTimeString("vi-VN")}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  <span className={textSecondary}>{event.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Add Create Ticket Template Button */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`font-medium ${textPrimary}`}>
                  Quản lý vé sự kiện
                </h3>
                <p className={`text-sm ${textSecondary}`}>
                  {ticketTemplates.length === 0
                    ? "Chưa có loại vé nào được tạo"
                    : `Đã tạo ${ticketTemplates.length} loại vé`}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => navigate(`/events/${eventId}/tickets`)}
                  className={`flex items-center gap-2 px-4 py-2 border ${borderColor} rounded-xl ${textSecondary} hover:bg-gray-100 dark:hover:bg-gray-700`}
                >
                  <Ticket size={18} />
                  <span>Xem danh sách vé</span>
                </button>
                <button
                  onClick={handleAddTicket}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600"
                >
                  <Plus size={18} />
                  <span>Tạo loại vé mới</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Ticket templates section */}
        {ticketTemplates.length > 0 && (
          <div
            className={`p-6 rounded-2xl ${bgElevated} border ${borderColor}`}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className={`text-xl font-medium ${textPrimary}`}>
                  Danh sách loại vé
                </h2>
                <p className={`mt-1 text-sm ${textSecondary}`}>
                  Quản lý thông tin các loại vé của sự kiện
                </p>
              </div>
              <button
                onClick={handleAddTicket}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600"
              >
                <Plus size={18} />
                <span>Thêm loại vé</span>
              </button>
            </div>

            <div className="space-y-4">
              {ticketTemplates.map((ticket) => (
                <TicketTemplateForm
                  key={ticket.ticketTemplateId}
                  ticket={ticket}
                  onUpdate={handleUpdateTicket}
                  onDelete={handleDeleteTicket}
                  isDarkMode={isDarkMode}
                />
              ))}
            </div>

            {/* Save button */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleSave}
                disabled={loading}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang lưu thông tin vé...</span>
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    <span>Lưu tất cả thay đổi</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(EditEvent);
