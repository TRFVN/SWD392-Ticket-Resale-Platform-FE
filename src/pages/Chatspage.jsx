// src/pages/ChatPage.jsx
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import MessageInput from "../components/chat/MessageInput";
import ChatMessages from "../components/chat/ChatMessage";
import ChatSidebar from "../components/chat/ChatSidebar";
import { AuthContext } from "../context/AuthContext";
import { useChat } from "../hooks/useChat";
import chatApi from "../services/Chatapi";
import { signalRService } from "../services/signalRService";

const DEFAULT_MESSAGES = [
  "Xin chào! Tôi có thể giúp gì cho bạn?",
  "Chào bạn! Rất vui được kết nối.",
  "Xin chào! Tôi đã nhận được yêu cầu của bạn.",
  "Hi! Tôi đang ở đây để hỗ trợ bạn.",
];

const ChatPage = () => {
  const { userId } = useParams();
  const { user } = useContext(AuthContext);
  const messagesEndRef = useRef(null);
  const [userRooms, setUserRooms] = useState([]);
  const [isLoadingUserRooms, setIsLoadingUserRooms] = useState(true);
  const [error, setError] = useState(null);

  const {
    activeChat,
    activeChatMessages,
    loading: isLoadingMessages,
    joinChatRoom,
    sendMessage,
    sendTypingIndicator,
    unreadMessages,
  } = useChat(user?.id);

  // Fetch chat rooms
  const fetchUserRooms = useCallback(async () => {
    if (!user?.id) return;

    try {
      setIsLoadingUserRooms(true);
      setError(null);

      const response = await chatApi.getChatRoomByUserId(user.id);

      if (response?.isSuccess && Array.isArray(response.result)) {
        setUserRooms(response.result);
        return response.result;
      }
      setUserRooms([]);
      return [];
    } catch (error) {
      console.error("Error fetching user rooms:", error);
      setError("Không thể tải danh sách phòng chat.");
      setUserRooms([]);
      return [];
    } finally {
      setIsLoadingUserRooms(false);
    }
  }, [user?.id]);

  // Create room and send initial message
  const createRoomAndSendMessage = useCallback(
    async (receiverId) => {
      try {
        setError(null);
        const roomResponse = await chatApi.createChatRoom(user.id, receiverId);

        if (roomResponse?.isSuccess && roomResponse.result?.chatRoomId) {
          const { chatRoomId } = roomResponse.result;

          const randomMessage =
            DEFAULT_MESSAGES[
              Math.floor(Math.random() * DEFAULT_MESSAGES.length)
            ];

          await chatApi.sendMessage({
            messageContent: randomMessage,
            sendMessageUserId: user.id,
            receiveMessageUserId: receiverId,
            chatRoomId,
          });

          await joinChatRoom(chatRoomId);
          await fetchUserRooms();

          return roomResponse.result;
        }
        throw new Error("Failed to create chat room");
      } catch (error) {
        console.error("Error creating chat room:", error);
        setError("Không thể tạo phòng chat.");
        throw error;
      }
    },
    [user?.id, joinChatRoom, fetchUserRooms],
  );

  // Modify handleRoomChange
  const handleRoomChange = useCallback(
    async (roomId) => {
      try {
        setError(null);
        const success = await joinChatRoom(roomId);

        if (!success) {
          setError("Không thể vào phòng chat");
        }
      } catch (error) {
        console.error("Error changing room:", error);
        setError("Không thể vào phòng chat");
      }
    },
    [joinChatRoom],
  );

  // Add cleanup in useEffect
  useEffect(() => {
    return () => {
      // Cleanup any active connections when component unmounts
      if (activeChat) {
        signalRService.leaveRoom(activeChat);
      }
    };
  }, [activeChat]);
  // Initialize chat
  useEffect(() => {
    let mounted = true;

    const initChat = async () => {
      if (!userId || !user?.id) return;

      try {
        const existingRooms = await fetchUserRooms();

        if (!mounted) return;

        if (existingRooms.length > 0) {
          await handleRoomChange(existingRooms[0].chatRoomId);
        } else {
          await createRoomAndSendMessage(userId);
        }
      } catch (error) {
        console.error("Error initializing chat:", error);
        if (mounted) {
          setError("Không thể khởi tạo chat.");
        }
      }
    };

    initChat();

    return () => {
      mounted = false;
    };
  }, [
    userId,
    user?.id,
    fetchUserRooms,
    handleRoomChange,
    createRoomAndSendMessage,
  ]);

  // Handle sending message
  const handleSendMessage = useCallback(
    async (content) => {
      if (!content?.trim() || !activeChat || !userId) return;

      try {
        setError(null);
        await sendMessage({
          messageContent: content,
          sendMessageUserId: user.id,
          receiveMessageUserId: userId,
          chatRoomId: activeChat,
        });

        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      } catch (error) {
        console.error("Error sending message:", error);
        setError("Không thể gửi tin nhắn.");
      }
    },
    [activeChat, userId, user?.id, sendMessage],
  );

  // Handle price negotiation
  const handleSendNegotiation = useCallback(
    async (price) => {
      const message = `Đề xuất giá: ${price.toLocaleString("vi-VN")}đ`;
      await handleSendMessage(message);
    },
    [handleSendMessage],
  );

  if (!user) return <Navigate to="/login" replace />;

  const isLoading = isLoadingUserRooms || isLoadingMessages;

  return (
    <div className="h-screen flex bg-gray-50 dark:bg-gray-900">
      <ChatSidebar
        userId={user.id}
        currentRoom={activeChat}
        onRoomChange={handleRoomChange}
        chatRooms={userRooms}
        unreadCounts={unreadMessages}
        isLoading={isLoading}
        onRefresh={fetchUserRooms}
      />

      <div className="flex-1 flex flex-col">
        {error && (
          <div className="p-4 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        {!activeChat && !isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-medium text-gray-700 dark:text-gray-300 mb-4">
                {isLoading
                  ? "Đang tạo cuộc trò chuyện..."
                  : "Chào mừng đến chat"}
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                {userRooms.length === 0
                  ? "Đang bắt đầu cuộc trò chuyện mới..."
                  : "Chọn một phòng chat từ thanh bên để bắt đầu"}
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="px-6 py-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                  <span className="text-lg font-medium text-orange-600 dark:text-orange-400">
                    {userId?.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Chat với {userId}
                </h2>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <ChatMessages
                messages={activeChatMessages}
                currentUserId={user.id}
                messagesEndRef={messagesEndRef}
                isLoading={isLoadingMessages}
              />
            </div>

            <MessageInput
              onSendMessage={handleSendMessage}
              onSendNegotiation={handleSendNegotiation}
              onTyping={(isTyping) => sendTypingIndicator(activeChat, isTyping)}
              disabled={!activeChat || isLoading}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
