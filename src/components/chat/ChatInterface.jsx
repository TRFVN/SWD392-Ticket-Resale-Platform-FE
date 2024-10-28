// src/components/chat/ChatInterface.jsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaPaperPlane, FaSpinner } from "react-icons/fa";
import ChatMessage from "./ChatMessage";
import { useChat } from "../../context/ChatContext";
import { debounce } from "lodash";

const ChatInterface = ({
  onClose,
  chatId,
  recipientId,
  recipientName,
  currentUser,
}) => {
  const {
    messages,
    sendMessage,
    joinChat,
    leaveChat,
    sendTypingIndicator,
    typingUsers,
    onlineUsers,
    connectionState,
  } = useChat();

  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  // Debounce the typing indicator
  const debouncedTypingIndicator = useCallback(
    debounce((isTyping) => {
      sendTypingIndicator(chatId, isTyping);
    }, 500),
    [chatId],
  );

  useEffect(() => {
    const initializeChat = async () => {
      try {
        await joinChat(chatId);
        setIsLoading(false);
      } catch (error) {
        console.error("Error initializing chat:", error);
        setIsLoading(false);
      }
    };

    initializeChat();

    return () => {
      leaveChat(chatId);
      debouncedTypingIndicator.cancel();
    };
  }, [chatId, joinChat, leaveChat, debouncedTypingIndicator]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      const { scrollHeight, clientHeight, scrollTop } =
        chatContainerRef.current;
      const shouldAutoScroll = scrollHeight - clientHeight <= scrollTop + 100;

      if (shouldAutoScroll) {
        chatContainerRef.current.scrollTop = scrollHeight;
      }
    }
  }, [messages[chatId]]);

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    debouncedTypingIndicator(e.target.value.length > 0);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || connectionState !== "connected") return;

    const messageData = {
      chatId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      recipientId,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      status: "sending",
    };

    try {
      setNewMessage("");
      debouncedTypingIndicator(false);
      await sendMessage(messageData);
    } catch (error) {
      console.error("Error sending message:", error);
      // You might want to show an error toast here
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const isRecipientTyping = typingUsers[chatId]?.[recipientId];
  const isRecipientOnline = onlineUsers[recipientId];

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="text-white flex flex-col items-center">
          <FaSpinner className="animate-spin h-8 w-8 mb-2" />
          <span>Loading chat...</span>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm z-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="dark:bg-dark-primary bg-white rounded-lg shadow-xl w-full max-w-2xl relative dark:shadow-2xl flex flex-col h-[600px]"
        >
          {/* Chat Header */}
          <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold dark:text-gray-200 text-gray-800">
                {recipientName}
              </h2>
              <div className="flex items-center space-x-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isRecipientOnline ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
                <p className="text-sm dark:text-gray-400 text-gray-600">
                  {isRecipientOnline ? "Online" : "Offline"}
                </p>
              </div>
            </div>
            {connectionState !== "connected" && (
              <div className="flex items-center text-yellow-500 dark:text-yellow-400">
                <FaSpinner className="animate-spin mr-2" />
                <span className="text-sm">Reconnecting...</span>
              </div>
            )}
            <button
              onClick={onClose}
              className="dark:text-gray-400 dark:hover:text-gray-200 text-gray-400 hover:text-gray-600 transition duration-200"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4"
          >
            {messages[chatId]?.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                isOwn={message.senderId === currentUser.id}
              />
            ))}

            {/* Typing Indicator */}
            {isRecipientTyping && (
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <span>{recipientName} is typing...</span>
                <div className="flex space-x-1">
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Message Input */}
          <form
            onSubmit={handleSendMessage}
            className="p-4 border-t dark:border-gray-700"
          >
            <div className="flex space-x-2">
              <textarea
                ref={inputRef}
                rows="1"
                value={newMessage}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 rounded-lg resize-none
                          dark:bg-dark-secondary dark:text-gray-200 dark:placeholder-gray-400 dark:border-gray-600
                          bg-white text-gray-800 placeholder-gray-500
                          focus:outline-none focus:ring-2 focus:ring-orange-400
                          transition-all duration-300
                          border dark:border-gray-600 border-gray-300"
                disabled={connectionState !== "connected"}
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={!newMessage.trim() || connectionState !== "connected"}
                className={`px-4 py-2 rounded-lg text-white
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500
                         flex items-center space-x-2 ${
                           connectionState === "connected"
                             ? "bg-orange-400 hover:bg-orange-500"
                             : "bg-gray-400 cursor-not-allowed"
                         }`}
              >
                <FaPaperPlane className="w-4 h-4" />
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ChatInterface;
