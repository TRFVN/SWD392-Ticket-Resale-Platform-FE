import { useState } from "react";

// src/components/chat/ChatInput.jsx
const ChatInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    onSendMessage(message);
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="border-t dark:border-gray-700 p-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 rounded-lg
                   bg-gray-100 dark:bg-gray-700
                   text-gray-900 dark:text-gray-100
                   placeholder-gray-500 dark:placeholder-gray-400
                   focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-orange-500 text-white rounded-lg
                   hover:bg-orange-600 transition-colors
                   disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!message.trim()}
        >
          Send
        </button>
      </div>
    </form>
  );
};
export default ChatInput;
