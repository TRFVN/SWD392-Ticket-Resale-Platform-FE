// src/services/chatApi.js
import axiosInstance from "../config/axiosConfig";

const standardizeResponse = (response) => {
  if (response?.data?.result) {
    return {
      result: response.data.result,
      isSuccess: response.data.isSuccess,
      statusCode: response.data.statusCode,
      message: response.data.message,
    };
  }
  return response.data;
};

const chatApi = {
  // Chat Room APIs
  getChatRooms: async (pageNumber = 1, pageSize = 10) => {
    try {
      const response = await axiosInstance.get("/ChatRoom", {
        params: { pageNumber, pageSize },
      });
      return standardizeResponse(response);
    } catch (error) {
      console.error("Error fetching chat rooms:", error);
      throw error;
    }
  },

  getChatRoomByUserId: async (userId) => {
    try {
      const response = await axiosInstance.get(`/ChatRoom/${userId}`);
      return standardizeResponse(response);
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  createChatRoom: async (sendMessageUserId, receiveMessageUserId) => {
    const payload = {
      chatRoomId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      nameRoom: "string",
      sendMessageUserId,
      receiveMessageUserId,
      createTime: "2024-10-31T06:30:34.700Z",
      updateTime: "2024-10-31T06:30:34.700Z",
    };

    try {
      const response = await axiosInstance.post("/ChatRoom", payload);
      return standardizeResponse(response);
    } catch (error) {
      console.error("Error creating chat room:", error);
      throw error;
    }
  },

  sendMessage: async (messageData) => {
    const requiredFields = [
      "messageContent",
      "sendMessageUserId",
      "receiveMessageUserId",
      "chatRoomId",
    ];

    const missing = requiredFields.filter((field) => !messageData[field]);
    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(", ")}`);
    }

    const payload = {
      messageId: messageData.messageId || crypto.randomUUID(),
      messageContent: messageData.messageContent,
      sendMessageUserId: messageData.sendMessageUserId,
      receiveMessageUserId: messageData.receiveMessageUserId,
      createTime: messageData.createTime || new Date().toISOString(),
      chatRoomId: messageData.chatRoomId,
    };

    const response = await axiosInstance.post("/message", payload);
    return standardizeResponse(response);
  },

  getMessagesByChatRoomId: async (chatRoomId) => {
    try {
      const response = await axiosInstance.get(`/message/${chatRoomId}`);
      return standardizeResponse(response);
    } catch (error) {
      if (error.response?.status === 404) {
        return [];
      }
      throw error;
    }
  },

  // Helper method to create chat room name
  createChatRoomName: (senderId, receiverId) => {
    return `Chat_${senderId}_${receiverId}`;
  },
};

export default chatApi;
