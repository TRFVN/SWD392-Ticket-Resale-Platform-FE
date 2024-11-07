// src/hooks/useChat.js
import { useState, useEffect, useCallback, useMemo } from "react";
import { useChat as useSignalRChat } from "../context/ChatContext";
import chatApi from "../services/Chatapi";
import { signalRService } from "../services/signalRService";

export const useChat = (currentUserId) => {
  const [loading, setLoading] = useState(true);
  const [localError, setLocalError] = useState(null);
  const [messages, setMessages] = useState({});

  const {
    activeChat,
    chats = [],
    onlineUsers,
    typingUsers,
    connectionState,
    unreadMessages,
    error: contextError,
    dispatch,
  } = useSignalRChat();

  // Error handling
  const error = useMemo(
    () => localError || contextError,
    [localError, contextError],
  );

  // Initialize or update messages for a room
  const updateRoomMessages = useCallback((roomId, newMessages) => {
    setMessages((prev) => ({
      ...prev,
      [roomId]: Array.isArray(newMessages) ? newMessages : [],
    }));
  }, []);

  // Fetch messages for a room
  const fetchMessages = useCallback(
    async (roomId) => {
      if (!roomId) return;

      try {
        const response = await chatApi.getMessagesByChatRoomId(roomId);
        if (response?.result) {
          updateRoomMessages(roomId, response.result);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    },
    [updateRoomMessages],
  );

  // Join chat room
  const joinChatRoom = useCallback(
    async (roomId) => {
      if (!roomId || !currentUserId) return false;

      try {
        setLoading(true);
        setLocalError(null);

        // Join SignalR room first
        await signalRService.joinRoom(roomId);

        // Set as active chat
        dispatch({
          type: "SET_ACTIVE_CHAT",
          payload: roomId,
        });

        // Fetch messages after joining
        await fetchMessages(roomId);

        return true;
      } catch (error) {
        setLocalError("Không thể vào phòng chat");
        console.error("Error joining room:", error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [currentUserId, dispatch, fetchMessages],
  );

  // Leave chat room
  const leaveChatRoom = useCallback(
    async (roomId) => {
      if (!roomId) return;

      try {
        await signalRService.leaveRoom(roomId);

        // Clear messages for this room
        setMessages((prev) => {
          const newMessages = { ...prev };
          delete newMessages[roomId];
          return newMessages;
        });

        dispatch({
          type: "SET_ACTIVE_CHAT",
          payload: null,
        });
      } catch (error) {
        console.error("Error leaving room:", error);
      }
    },
    [dispatch],
  );

  // Send message
  const sendMessage = useCallback(
    async (messageData) => {
      if (!activeChat || !currentUserId) {
        throw new Error("No active chat room");
      }

      try {
        setLocalError(null);

        // Save to database first
        const response = await chatApi.sendMessage({
          messageId: crypto.randomUUID(),
          messageContent: messageData.messageContent,
          sendMessageUserId: currentUserId,
          receiveMessageUserId: messageData.receiveMessageUserId,
          chatRoomId: activeChat,
          createTime: new Date().toISOString(),
        });

        if (response?.isSuccess) {
          // If saved successfully, broadcast via SignalR
          await signalRService.sendMessageToRoom(
            activeChat,
            currentUserId,
            messageData.messageContent,
          );

          // Update local state with the new message
          const newMessage = response.result;
          setMessages((prev) => ({
            ...prev,
            [activeChat]: [...(prev[activeChat] || []), newMessage],
          }));

          return response;
        }

        throw new Error("Failed to send message");
      } catch (error) {
        setLocalError("Không thể gửi tin nhắn");
        console.error("Error sending message:", error);
        throw error;
      }
    },
    [activeChat, currentUserId],
  );

  // Handle typing indicator
  const sendTypingIndicator = useCallback(
    (isTyping) => {
      if (!activeChat || !currentUserId) return;

      // Implement if needed
    },
    [activeChat, currentUserId],
  );

  // Setup SignalR and message handlers
  useEffect(() => {
    let mounted = true;

    const handleIncomingMessage = (userId, message) => {
      // Only process messages for active chat and from other users
      if (mounted && activeChat && userId !== currentUserId) {
        const newMessage = {
          messageId: crypto.randomUUID(),
          messageContent: message,
          sendMessageUserId: userId,
          receiveMessageUserId: currentUserId,
          chatRoomId: activeChat,
          createTime: new Date().toISOString(),
        };

        setMessages((prev) => ({
          ...prev,
          [activeChat]: [...(prev[activeChat] || []), newMessage],
        }));
      }
    };

    // Initialize SignalR
    const initializeSignalR = async () => {
      try {
        await signalRService.startConnection();
        signalRService.onReceiveMessage(handleIncomingMessage);
      } catch (error) {
        console.error("SignalR initialization error:", error);
        setLocalError("Không thể kết nối đến chat server");
      }
    };

    initializeSignalR();

    // Cleanup
    return () => {
      mounted = false;
      if (activeChat) {
        leaveChatRoom(activeChat);
      }
    };
  }, [activeChat, currentUserId, leaveChatRoom]);

  // Auto-refresh messages for active chat
  useEffect(() => {
    if (activeChat) {
      fetchMessages(activeChat);
    }
  }, [activeChat, fetchMessages]);

  // Computed properties
  const activeChatMessages = useMemo(
    () => messages[activeChat] || [],
    [messages, activeChat],
  );

  const activeChatDetails = useMemo(
    () => chats.find((chat) => chat?.chatRoomId === activeChat),
    [chats, activeChat],
  );

  return {
    // State
    activeChat,
    activeChatDetails,
    activeChatMessages,
    chats,
    connectionState,
    error,
    loading,
    onlineUsers,
    typingUsers: typingUsers?.[activeChat] || {},
    unreadMessages,

    // Actions
    joinChatRoom,
    leaveChatRoom,
    sendMessage,
    sendTypingIndicator,

    // Utils
    dispatch,
  };
};

export default useChat;
