// src/services/chatApi.js
export const chatApi = {
  getChatRooms: async (pageNumber = 1, pageSize = 10) => {
    try {
      const response = await fetch(
        `https://tickethub-f6gxgnhngpbue9gs.southeastasia-01.azurewebsites.net/api/ChatRoom?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching chat rooms:", error);
      throw error;
    }
  },

  // Add other API methods as needed
  getChatRoomById: async (roomId) => {
    try {
      const response = await fetch(
        `https://tickethub-f6gxgnhngpbue9gs.southeastasia-01.azurewebsites.net/api/ChatRoom/${roomId}`,
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching chat room:", error);
      throw error;
    }
  },

  // Add methods for messages if needed
};
