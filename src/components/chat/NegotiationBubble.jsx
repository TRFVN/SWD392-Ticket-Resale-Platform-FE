// components/chat/NegotiationBubble.jsx
import React from "react";
import { motion } from "framer-motion";

const NegotiationBubble = ({
  price,
  status = "pending",
  onAccept,
  onReject,
  isOwn,
}) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "accepted":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "";
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`flex ${isOwn ? "justify-end" : "justify-start"} my-2`}
    >
      <div
        className={`rounded-lg p-3 max-w-[280px] ${
          isOwn
            ? "bg-orange-50 dark:bg-orange-900/10"
            : "bg-gray-50 dark:bg-gray-800"
        }`}
      >
        <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">
          Đề xuất giá vé
        </div>

        <div className="text-xl font-semibold text-orange-600 dark:text-orange-400 mb-2">
          {formatPrice(price)}
        </div>

        <div className="flex items-center justify-between">
          <span
            className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
              status,
            )}`}
          >
            {status === "pending"
              ? "Đang chờ"
              : status === "accepted"
              ? "Đã chấp nhận"
              : "Đã từ chối"}
          </span>

          {status === "pending" && !isOwn && (
            <div className="flex space-x-2">
              <button
                onClick={onAccept}
                className="px-3 py-1 text-xs rounded-lg bg-green-500 text-white 
                         hover:bg-green-600 transition-colors"
              >
                Đồng ý
              </button>
              <button
                onClick={onReject}
                className="px-3 py-1 text-xs rounded-lg bg-red-500 text-white
                         hover:bg-red-600 transition-colors"
              >
                Từ chối
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default NegotiationBubble;
