// components/chat/MessageInput.jsx
import React, { useState } from "react";
import { FaPaperPlane, FaTicketAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const MessageInput = ({ onSendMessage, onSendNegotiation }) => {
  const [message, setMessage] = useState("");
  const [isNegotiating, setIsNegotiating] = useState(false);
  const [price, setPrice] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isNegotiating) {
      if (!price.trim()) return;
      onSendNegotiation(Number(price));
      setPrice("");
      setIsNegotiating(false);
    } else {
      if (!message.trim()) return;
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <div className="p-4 border-t dark:border-gray-800">
      <form onSubmit={handleSubmit}>
        <div className="flex items-end space-x-2">
          <div className="flex-1 space-y-2">
            {isNegotiating ? (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="relative"
              >
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-orange-50 dark:bg-orange-900/10
                           text-orange-600 dark:text-orange-400 
                           placeholder-orange-300 dark:placeholder-orange-700
                           border-2 border-orange-200 dark:border-orange-800
                           focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Nhập giá đề xuất"
                  min="0"
                  step="1000"
                  autoFocus
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-400 text-sm font-medium">
                  VNĐ
                </span>
              </motion.div>
            ) : (
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-2 rounded-lg
                         bg-gray-100 dark:bg-gray-800 
                         text-gray-900 dark:text-gray-100
                         placeholder-gray-500 dark:placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Nhập tin nhắn..."
              />
            )}
          </div>

          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setIsNegotiating(!isNegotiating)}
              className={`p-2 rounded-lg transition-colors
                       ${
                         isNegotiating
                           ? "bg-orange-500 text-white"
                           : "bg-gray-100 dark:bg-gray-800 text-orange-500"
                       }`}
            >
              <FaTicketAlt className="w-5 h-5" />
            </button>
            <button
              type="submit"
              disabled={isNegotiating ? !price : !message}
              className="p-2 rounded-lg bg-orange-500 text-white
                       disabled:opacity-50 disabled:cursor-not-allowed
                       hover:bg-orange-600 transition-colors"
            >
              <FaPaperPlane className="w-5 h-5" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;
