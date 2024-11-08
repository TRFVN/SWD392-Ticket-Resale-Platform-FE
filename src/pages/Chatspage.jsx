import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import MessageInput from "../components/chat/MessageInput";
import ChatMessages from "../components/chat/ChatMessage";
import ChatSidebar from "../components/chat/ChatSidebar";
import { AuthContext } from "../context/AuthContext";
import { useChat } from "../hooks/useChat";
import chatApi from "../services/Chatapi";
import { signalRService } from "../services/signalRService";
import { MessageCircle } from "lucide-react"; // Assuming you use lucide-react

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
        // If we're on /chat and there are rooms, automatically join the first room
        if (!userId && response.result.length > 0 && !activeChat) {
          await joinChatRoom(response.result[0].chatRoomId);
        }
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
  }, [user?.id, userId, activeChat, joinChatRoom]);

  // Handle room change
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

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (activeChat) {
        signalRService.leaveRoom(activeChat);
      }
    };
  }, [activeChat]);

  // Initialize chat
  useEffect(() => {
    fetchUserRooms();
  }, [fetchUserRooms]);

  // Handle specific user chat initialization
  useEffect(() => {
    let mounted = true;

    const initSpecificChat = async () => {
      if (!userId || !user?.id) return;

      try {
        const rooms = await fetchUserRooms();
        if (!mounted) return;

        // Find if we already have a room with this user
        const existingRoom = rooms.find((room) =>
          room.participants.some((p) => p.userId === userId),
        );

        if (existingRoom) {
          await handleRoomChange(existingRoom.chatRoomId);
        } else {
          // Create new room logic here if needed
          const newRoom = await chatApi.createChatRoom(user.id, userId);
          if (newRoom?.isSuccess) {
            await handleRoomChange(newRoom.result.chatRoomId);
            await fetchUserRooms();
          }
        }
      } catch (error) {
        console.error("Error initializing specific chat:", error);
        if (mounted) {
          setError("Không thể khởi tạo chat.");
        }
      }
    };

    if (userId) {
      initSpecificChat();
    }

    return () => {
      mounted = false;
    };
  }, [userId, user?.id, fetchUserRooms, handleRoomChange]);

  // Handle sending message
  const handleSendMessage = useCallback(
    async (content) => {
      if (!content?.trim() || !activeChat) return;

      try {
        setError(null);
        await sendMessage({
          messageContent: content,
          sendMessageUserId: user.id,
          receiveMessageUserId:
            userId ||
            userRooms
              .find((room) => room.chatRoomId === activeChat)
              ?.participants.find((p) => p.userId !== user.id)?.userId,
          chatRoomId: activeChat,
        });

        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      } catch (error) {
        console.error("Error sending message:", error);
        setError("Không thể gửi tin nhắn.");
      }
    },
    [activeChat, userId, user?.id, sendMessage, userRooms],
  );

  const handleSendNegotiation = useCallback(
    async (price) => {
      const message = `Đề xuất giá: ${price.toLocaleString("vi-VN")}đ`;
      await handleSendMessage(message);
    },
    [handleSendMessage],
  );

  if (!user) return <Navigate to="/login" replace />;

  const isLoading = isLoadingUserRooms || isLoadingMessages;

  const getCurrentChatPartner = () => {
    if (!activeChat || !userRooms?.length) return null;

    const currentRoom = userRooms.find(
      (room) => room.chatRoomId === activeChat,
    );
    if (!currentRoom) return null;

    // Nếu response của bạn có cấu trúc khác, điều chỉnh ở đây
    // Ví dụ: nếu API trả về receiverId hoặc otherUserId
    return {
      userId: currentRoom.receiverId || currentRoom.otherUserId,
    };
  };

  const chatPartner = getCurrentChatPartner();

  return (
    <div className="h-screen flex bg-gray-900">
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
        {error && <div className="p-4 bg-red-900/20 text-red-400">{error}</div>}

        {!activeChat && !isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-orange-500" />
              </div>
              <h2 className="text-2xl font-medium text-white mb-2">
                Chọn một cuộc trò chuyện
              </h2>
              <p className="text-gray-400">
                {userRooms.length === 0
                  ? "Bạn chưa có cuộc trò chuyện nào"
                  : "Chọn một phòng chat từ danh sách để bắt đầu"}
              </p>
            </div>
          </div>
        ) : (
          <>
            {chatPartner && (
              <div className="px-6 py-4 bg-gray-800 border-b border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-900/20 flex items-center justify-center">
                    <span className="text-lg font-medium text-orange-400">
                      {chatPartner.userId?.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <h2 className="text-lg font-medium text-white">
                    Chat với {chatPartner.userId}
                  </h2>
                </div>
              </div>
            )}

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
