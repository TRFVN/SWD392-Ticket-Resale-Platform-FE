import { useState } from "react";
import { Send, Paperclip, Smile } from "lucide-react";

const ChatInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    onSendMessage(message);
    setMessage("");
  };

  return (
    <div className="border-t dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-xl p-2 shadow-sm">
          <button
            type="button"
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Add attachment"
          >
            <Paperclip className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>

          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Nhập tin nhắn của bạn..."
            className="flex-1 bg-transparent border-none text-gray-900 dark:text-gray-100 
                     placeholder-gray-500 dark:placeholder-gray-400 text-base
                     focus:outline-none focus:ring-0"
          />

          <button
            type="button"
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Add emoji"
          >
            <Smile className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>

          <button
            type="submit"
            disabled={!message.trim()}
            className="p-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 
                     dark:disabled:bg-gray-700 rounded-lg transition-colors
                     disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
