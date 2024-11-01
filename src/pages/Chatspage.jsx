// ChatPage.jsx
import { useContext, useEffect, useRef, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { signalRService } from "../services/signalRService";
import MessageInput from "../components/chat/MessageInput";
import ChatMessages from "../components/chat/ChatMessage";
import { AuthContext } from "../context/AuthContext";
import { Check, Edit2, X } from "lucide-react";

const ChatPage = () => {
  const { userId } = useParams(); // This will be our roomId
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const [isEditingId, setIsEditingId] = useState(false);
  const [editedId, setEditedId] = useState(userId);
  const handleEditId = () => {
    setIsEditingId(true);
    setEditedId(userId);
  };

  const handleSaveId = () => {
    if (editedId && editedId !== userId) {
      // Leave current room before navigating
      signalRService.leaveRoom(userId);
      Navigate(`/chat/${editedId}`);
    }
    setIsEditingId(false);
  };

  const handleCancelEdit = () => {
    setEditedId(userId);
    setIsEditingId(false);
  };

  useEffect(() => {
    const initChat = async () => {
      await signalRService.startConnection();

      // Join the chat room (using userId as roomId)
      await signalRService.joinRoom(userId);

      // Set up message listener
      signalRService.onReceiveMessage((senderId, message) => {
        setMessages((prev) => [
          ...prev,
          {
            userId: senderId,
            content: message,
            timestamp: new Date().toISOString(),
          },
        ]);
      });
    };

    initChat();

    // Cleanup: leave room when component unmounts
    return () => {
      if (userId) {
        signalRService.leaveRoom(userId);
      }
    };
  }, [userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (messageContent) => {
    if (!messageContent.trim()) return;

    try {
      // Send message to the room with current user's ID
      await signalRService.sendMessageToRoom(
        userId, // roomId
        user.id, // current user's ID
        messageContent,
      );
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handleSendNegotiation = async (price) => {
    const negotiationMessage = `Đề xuất giá: ${price.toLocaleString("vi-VN")}đ`;
    await handleSendMessage(negotiationMessage);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="px-6 py-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
              <span className="text-lg font-medium text-orange-600 dark:text-orange-400">
                {editedId?.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div>
              {isEditingId ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editedId}
                    onChange={(e) => setEditedId(e.target.value)}
                    className="px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveId}
                    className="p-1 text-green-500 hover:bg-green-50"
                    title="Save"
                  >
                    <Check size={16} />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="p-1 text-red-500 hover:bg-red-50"
                    title="Cancel"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Chat with {userId}
                  </h2>
                  <button
                    onClick={handleEditId}
                    className="p-1 text-gray-400 hover:text-gray-600"
                    title="Edit ID"
                  >
                    <Edit2 size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <ChatMessages
            messages={messages}
            userId={user?.id}
            messagesEndRef={messagesEndRef}
          />
        </div>
      </div>

      {/* Input */}
      <div className="px-6 py-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
        <div className="max-w-3xl mx-auto">
          <MessageInput
            onSendMessage={handleSendMessage}
            onSendNegotiation={handleSendNegotiation}
          />
        </div>
      </div>
    </div>
  );
};
export default ChatPage;
