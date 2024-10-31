// src/components/chat/MessageInput.jsx
import { memo, useState, useCallback } from "react";
import { Send, DollarSign, X } from "lucide-react";

const MessageInput = memo(
  ({ onSendMessage, onSendNegotiation, disabled = false }) => {
    const [message, setMessage] = useState("");
    const [isNegotiating, setIsNegotiating] = useState(false);
    const [price, setPrice] = useState("");

    const handleSubmit = useCallback(
      (e) => {
        e.preventDefault();

        if (disabled) return;

        if (isNegotiating) {
          if (!price.trim()) return;
          const numericPrice = Number(price.replace(/[^0-9]/g, ""));
          if (numericPrice > 0) {
            onSendNegotiation(numericPrice);
            setPrice("");
            setIsNegotiating(false);
          }
        } else {
          if (!message.trim()) return;
          onSendMessage(message.trim());
          setMessage("");
        }
      },
      [
        disabled,
        isNegotiating,
        message,
        price,
        onSendMessage,
        onSendNegotiation,
      ],
    );

    const handlePriceChange = useCallback((e) => {
      const value = e.target.value;
      // Only allow numbers
      if (/^\d*$/.test(value)) {
        setPrice(value);
      }
    }, []);

    const toggleNegotiation = useCallback(() => {
      setIsNegotiating((prev) => !prev);
      setPrice("");
    }, []);

    return (
      <div className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="flex items-end space-x-2">
            <div className="flex-1">
              {isNegotiating ? (
                <div className="relative">
                  <input
                    type="text"
                    value={price}
                    onChange={handlePriceChange}
                    className="w-full px-4 py-2 pr-16 rounded-lg
                           bg-orange-50 dark:bg-orange-900/10
                           text-orange-600 dark:text-orange-400 
                           placeholder-orange-300 dark:placeholder-orange-700
                           border-2 border-orange-200 dark:border-orange-800
                           focus:outline-none focus:ring-2 focus:ring-orange-500
                           disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Nhập giá đề xuất"
                    disabled={disabled}
                    autoFocus
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <span className="text-orange-400 text-sm font-medium">
                      VNĐ
                    </span>
                    <button
                      type="button"
                      onClick={toggleNegotiation}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg
                         bg-gray-100 dark:bg-gray-800 
                         text-gray-900 dark:text-gray-100
                         placeholder-gray-500 dark:placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-orange-500
                         disabled:opacity-50 disabled:cursor-not-allowed
                         border border-transparent dark:border-gray-700"
                  placeholder={
                    disabled
                      ? "Select a chat room to start messaging"
                      : "Nhập tin nhắn..."
                  }
                  disabled={disabled}
                />
              )}
            </div>

            <div className="flex space-x-2">
              <button
                type="button"
                onClick={toggleNegotiation}
                disabled={disabled}
                className={`p-2 rounded-lg transition-colors
                       ${
                         isNegotiating
                           ? "bg-orange-500 text-white"
                           : "bg-gray-100 dark:bg-gray-800 text-orange-500"
                       }
                       disabled:opacity-50 disabled:cursor-not-allowed
                       hover:bg-orange-600 hover:text-white`}
              >
                <DollarSign className="w-5 h-5" />
              </button>
              <button
                type="submit"
                disabled={disabled || (isNegotiating ? !price : !message)}
                className="p-2 rounded-lg bg-orange-500 text-white
                       disabled:opacity-50 disabled:cursor-not-allowed
                       hover:bg-orange-600 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  },
);

MessageInput.displayName = "MessageInput";

export default MessageInput;
