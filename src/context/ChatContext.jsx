// src/context/ChatContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from "react";
import { signalRService } from "../services/signalRService";

const ChatContext = createContext();

const initialState = {
  activeChat: null,
  chats: [],
  messages: {},
  onlineUsers: {},
  typingUsers: {},
  connectionState: "disconnected",
  unreadMessages: {},
};

function chatReducer(state, action) {
  switch (action.type) {
    case "SET_ACTIVE_CHAT":
      return {
        ...state,
        activeChat: action.payload,
        unreadMessages: {
          ...state.unreadMessages,
          [action.payload]: 0, // Reset unread count when chat becomes active
        },
      };

    case "SET_CHATS":
      return {
        ...state,
        chats: action.payload,
      };

    case "ADD_MESSAGE": {
      const chatId = action.payload.chatId;
      const newMessages = {
        ...state.messages,
        [chatId]: [...(state.messages[chatId] || []), action.payload],
      };

      // Update unread count if message is new and chat is not active
      const newUnreadMessages = {
        ...state.unreadMessages,
        [chatId]:
          state.activeChat !== chatId
            ? (state.unreadMessages[chatId] || 0) + 1
            : state.unreadMessages[chatId] || 0,
      };

      return {
        ...state,
        messages: newMessages,
        unreadMessages: newUnreadMessages,
      };
    }

    case "UPDATE_MESSAGE_STATUS":
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.chatId]: state.messages[action.payload.chatId].map(
            (msg) =>
              msg.id === action.payload.messageId
                ? { ...msg, status: action.payload.status }
                : msg,
          ),
        },
      };

    case "SET_USER_STATUS":
      return {
        ...state,
        onlineUsers: {
          ...state.onlineUsers,
          [action.payload.userId]: action.payload.isOnline,
        },
      };

    case "SET_TYPING_STATUS":
      return {
        ...state,
        typingUsers: {
          ...state.typingUsers,
          [action.payload.chatId]: {
            ...state.typingUsers[action.payload.chatId],
            [action.payload.userId]: action.payload.isTyping,
          },
        },
      };

    case "SET_CONNECTION_STATE":
      return {
        ...state,
        connectionState: action.payload,
      };

    case "CLEAR_CHAT_MESSAGES": {
      const messagesWithoutChat = { ...state.messages };
      delete messagesWithoutChat[action.payload];
      return {
        ...state,
        messages: messagesWithoutChat,
      };
    }

    case "RESET_STATE":
      return initialState;

    default:
      return state;
  }
}

export function ChatProvider({ children }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  useEffect(() => {
    const initializeSignalR = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        signalRService.registerMessageCallback((message) => {
          dispatch({ type: "ADD_MESSAGE", payload: message });
        });

        signalRService.registerMessageStatusCallback(
          (messageId, status, chatId) => {
            dispatch({
              type: "UPDATE_MESSAGE_STATUS",
              payload: { messageId, status, chatId },
            });
          },
        );

        signalRService.registerUserStatusCallback((userId, isOnline) => {
          dispatch({
            type: "SET_USER_STATUS",
            payload: { userId, isOnline },
          });
        });

        signalRService.registerTypingCallback((chatId, userId, isTyping) => {
          dispatch({
            type: "SET_TYPING_STATUS",
            payload: { chatId, userId, isTyping },
          });
        });

        signalRService.registerConnectionStateCallback((state) => {
          dispatch({ type: "SET_CONNECTION_STATE", payload: state });
        });

        await signalRService.startConnection(token);
      } catch (error) {
        console.error("Failed to initialize SignalR:", error);
      }
    };

    initializeSignalR();

    return () => {
      signalRService.stopConnection();
    };
  }, []);

  const sendMessage = async (message) => {
    try {
      const result = await signalRService.sendMessage(message);
      return result;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  };

  const joinChat = async (chatId) => {
    try {
      await signalRService.joinChat(chatId);
    } catch (error) {
      console.error("Error joining chat:", error);
      throw error;
    }
  };

  const leaveChat = async (chatId) => {
    try {
      await signalRService.leaveChat(chatId);
      dispatch({ type: "CLEAR_CHAT_MESSAGES", payload: chatId });
    } catch (error) {
      console.error("Error leaving chat:", error);
      throw error;
    }
  };

  const sendTypingIndicator = async (chatId, isTyping) => {
    try {
      await signalRService.sendTypingIndicator(chatId, isTyping);
    } catch (error) {
      console.error("Error sending typing indicator:", error);
    }
  };

  const value = {
    ...state,
    dispatch,
    sendMessage,
    joinChat,
    leaveChat,
    sendTypingIndicator,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
