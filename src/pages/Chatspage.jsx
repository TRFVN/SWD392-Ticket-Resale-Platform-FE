import { useEffect, useRef, useState } from "react";
import { signalRService } from "../services/signalRService";
import ChatInput from "../components/chat/ChatInput";
import ChatSidebar from "../components/chat/ChatSidebar";
import ChatMessages from "../components/chat/ChatMessage";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [currentRoom, setCurrentRoom] = useState("");
  const [userId, setUserId] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Connect to SignalR when component mounts
    const connectSignalR = async () => {
      await signalRService.startConnection();

      // Set up message listener
      signalRService.onReceiveMessage((userId, message) => {
        addMessage(userId, message);
      });
    };

    connectSignalR();

    return () => {
      // Cleanup if in a room
      if (currentRoom) {
        signalRService.leaveRoom(currentRoom);
      }
    };
  }, []);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = (userId, message) => {
    setMessages((prev) => [
      ...prev,
      {
        userId,
        content: message,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const handleJoinRoom = async (roomId) => {
    try {
      await signalRService.joinRoom(roomId);
      setCurrentRoom(roomId);
    } catch (err) {
      console.error("Error joining room:", err);
    }
  };

  const handleLeaveRoom = async () => {
    if (!currentRoom) return;

    try {
      await signalRService.leaveRoom(currentRoom);
      setCurrentRoom("");
      setMessages([]);
    } catch (err) {
      console.error("Error leaving room:", err);
    }
  };

  const handleSendMessage = async (messageContent) => {
    if (!currentRoom || !userId || !messageContent.trim()) return;

    try {
      await signalRService.sendMessageToRoom(
        currentRoom,
        userId,
        messageContent,
      );
      // Local message will be added via the ReceiveMessage event
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };
  return (
    <div className="h-screen flex bg-gray-50 dark:bg-gray-900">
      <ChatSidebar
        userId={userId}
        onUserIdChange={setUserId}
        currentRoom={currentRoom}
        onRoomChange={setCurrentRoom}
        onJoinRoom={handleJoinRoom}
        onLeaveRoom={handleLeaveRoom}
      />

      <div className="flex-1 flex flex-col bg-white dark:bg-gray-800">
        {/* Chat Header */}
        {currentRoom && (
          <div className="px-6 py-4 border-b dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/20
                             flex items-center justify-center"
                >
                  <span className="text-lg font-medium text-orange-600 dark:text-orange-400">
                    #
                  </span>
                </div>
                <div>
                  <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Room: {currentRoom}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {messages.length} messages
                  </p>
                </div>
              </div>
              <button
                onClick={handleLeaveRoom}
                className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400
                         hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                Leave Room
              </button>
            </div>
          </div>
        )}

        {currentRoom ? (
          <>
            <ChatMessages
              messages={messages}
              userId={userId}
              messagesEndRef={messagesEndRef}
            />
            <div className="p-4 border-t dark:border-gray-700">
              <ChatInput onSendMessage={handleSendMessage} />
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
            <div
              className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700
                        flex items-center justify-center mb-4"
            >
              <span className="text-2xl">💬</span>
            </div>
            <p className="text-lg font-medium">
              Select a room to start chatting
            </p>
            <p className="text-sm">
              Choose from the available rooms in the sidebar
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
