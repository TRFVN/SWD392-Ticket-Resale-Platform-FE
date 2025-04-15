import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  Calendar,
  MapPin,
  RefreshCw,
  Download,
  Tag,
  QrCode,
  Clock,
  Info,
} from "lucide-react";
import { getTicketQRCode } from "../../hooks/useTickets";
import { base64ToImageUrl } from "../../utils/imageUtils";

const TicketDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [ticket, setTicket] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [loadingQR, setLoadingQR] = useState(false);
  const [qrError, setQrError] = useState(null);
  const isDarkMode = useSelector((state) => state.theme?.isDarkMode);

  useEffect(() => {
    if (!location.state?.ticket) {
      navigate("/my-tickets");
    } else {
      setTicket(location.state.ticket);
    }
  }, [location.state, navigate]);

  // Load QR code on page load
  useEffect(() => {
    const fetchQRCode = async () => {
      if (!ticket || loadingQR) return;

      try {
        setLoadingQR(true);
        setQrError(null);

        // Use the serialNumberId or ticketId as needed by your API
        const serialNumberId = ticket.serialNumberId || ticket.ticketId;
        const qrCodeUrl = await getTicketQRCode(
          ticket.ticketId,
          serialNumberId,
        );

        setQrCode(qrCodeUrl);
      } catch (error) {
        console.error("Failed to load QR code:", error);
        setQrError("Could not load QR code. Please try again.");
      } finally {
        setLoadingQR(false);
      }
    };

    fetchQRCode();
  }, [ticket]);

  if (!ticket) return null;

  const formatDate = (dateString) => {
    try {
      // Check if date string is valid
      if (!dateString) return "Date not available";

      const date = new Date(dateString);

      // Check if date is valid
      if (isNaN(date.getTime())) return "Invalid date";

      return new Intl.DateTimeFormat("vi-VN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      }).format(date);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Date formatting error";
    }
  };

  // Format currency
  const formatCurrency = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price || 0);
  };

  // Handle QR code download
  const downloadQRCode = () => {
    if (!qrCode) return;

    const link = document.createElement("a");
    link.href = qrCode;
    link.download = `${ticket.eventName}-ticket-${ticket.ticketId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle QR code refresh
  const refreshQRCode = async () => {
    if (loadingQR) return;

    try {
      setLoadingQR(true);
      setQrError(null);

      const serialNumberId = ticket.serialNumberId || ticket.ticketId;
      const qrCodeUrl = await getTicketQRCode(ticket.ticketId, serialNumberId);

      setQrCode(qrCodeUrl);
    } catch (error) {
      console.error("Failed to refresh QR code:", error);
      setQrError("Could not refresh QR code. Please try again.");
    } finally {
      setLoadingQR(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className={`mb-6 flex items-center gap-2 px-4 py-2 rounded-xl ${
            isDarkMode
              ? "bg-gray-800 hover:bg-gray-700 text-gray-200"
              : "bg-white hover:bg-gray-100 text-gray-700"
          } transition-colors shadow-sm`}
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back to My Tickets</span>
        </button>

        {/* Ticket Header Card */}
        <div
          className={`p-6 rounded-2xl mb-6 ${
            isDarkMode
              ? "bg-gradient-to-br from-gray-800 to-gray-800/70"
              : "bg-white"
          } shadow-sm border ${
            isDarkMode ? "border-gray-700" : "border-gray-100"
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Tag className="w-4 h-4 text-orange-500" />
                <span
                  className={`text-sm font-medium ${
                    isDarkMode ? "text-orange-400" : "text-orange-600"
                  }`}
                >
                  {ticket.rank || "Standard"}
                </span>
              </div>
              <h1 className="text-xl font-bold mb-2">{ticket.ticketName}</h1>
              <p
                className={`${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                } mb-4`}
              >
                {ticket.eventName}
              </p>
            </div>
            <div className="text-right">
              <div
                className={`text-lg font-bold ${
                  isDarkMode ? "text-orange-400" : "text-orange-600"
                }`}
              >
                {formatCurrency(ticket.ticketPrice)}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Serial: #{ticket.serialNumberId || ticket.ticketId}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-500 flex-shrink-0" />
              <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                {formatDate(ticket.eventDate)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-orange-500 flex-shrink-0" />
              <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                {ticket.city || ticket.address || "Location not available"}
              </span>
            </div>
          </div>
        </div>

        {/* QR Code Section */}
        <div
          className={`p-6 rounded-2xl ${
            isDarkMode
              ? "bg-gradient-to-br from-gray-800 to-gray-800/70"
              : "bg-white"
          } mb-6 shadow-sm border ${
            isDarkMode ? "border-gray-700" : "border-gray-100"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <QrCode className="w-5 h-5 text-orange-500" />
              Entry QR Code
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={refreshQRCode}
                disabled={loadingQR}
                className={`p-2 rounded-full ${
                  isDarkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                } transition-colors ${
                  loadingQR ? "opacity-50 cursor-not-allowed" : ""
                }`}
                title="Refresh QR Code"
              >
                <RefreshCw
                  className={`w-4 h-4 ${loadingQR ? "animate-spin" : ""}`}
                />
              </button>
              {qrCode && !loadingQR && !qrError && (
                <button
                  onClick={downloadQRCode}
                  className={`p-2 rounded-full ${
                    isDarkMode
                      ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  } transition-colors`}
                  title="Download QR Code"
                >
                  <Download className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="relative aspect-square w-full max-w-xs mx-auto bg-white p-6 rounded-xl">
              {loadingQR && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10 rounded-xl">
                  <div className="w-10 h-10 border-4 border-t-orange-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                </div>
              )}

              {qrError && !loadingQR && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-80 z-10 rounded-xl">
                  <Info className="w-8 h-8 text-red-500 mb-2" />
                  <p className="text-red-500 text-sm text-center mb-2">
                    {qrError}
                  </p>
                  <button
                    onClick={refreshQRCode}
                    className="px-3 py-1 bg-orange-500 text-white rounded-md text-sm hover:bg-orange-600 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {qrCode && !loadingQR && !qrError ? (
                <img
                  src={qrCode}
                  alt="Ticket QR Code"
                  className="w-full h-full object-contain"
                  onError={() => setQrError("Failed to load QR code image")}
                />
              ) : !loadingQR && !qrError ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                  <QrCode className="w-16 h-16 mb-4 opacity-30" />
                  <p className="text-center text-sm">QR code not available</p>
                </div>
              ) : null}
            </div>

            <p className="mt-4 text-center text-sm max-w-md">
              Please show this QR code at the event entrance for check-in. The
              QR code contains your unique ticket information.
            </p>
          </div>
        </div>

        {/* Additional Event Info */}
        <div
          className={`p-6 rounded-2xl ${
            isDarkMode
              ? "bg-gradient-to-br from-gray-800 to-gray-800/70"
              : "bg-white"
          } shadow-sm border ${
            isDarkMode ? "border-gray-700" : "border-gray-100"
          }`}
        >
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-orange-500" />
            Event Location & Details
          </h2>

          <div
            className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            <div>
              <h3 className="font-medium text-sm mb-2 text-gray-500 dark:text-gray-400">
                Location
              </h3>
              <p>{ticket.city || "N/A"}</p>
              <p>{ticket.district || ""}</p>
              <p>{ticket.address || "Address not available"}</p>
            </div>

            <div>
              <h3 className="font-medium text-sm mb-2 text-gray-500 dark:text-gray-400">
                Ticket Information
              </h3>
              <div className="flex items-center gap-2 mb-1">
                <Tag className="w-4 h-4" />
                <span>
                  Category: {ticket.categoryName || ticket.rank || "Standard"}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4" />
                <span>Valid until: {formatDate(ticket.eventDate)}</span>
              </div>
            </div>
          </div>

          {ticket.ticketDescription && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-sm mb-2 text-gray-500 dark:text-gray-400">
                Description
              </h3>
              <p className="text-sm">{ticket.ticketDescription}</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TicketDetails;
