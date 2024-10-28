// src/services/signalRService.js
import * as signalR from "@microsoft/signalr";

class SignalRService {
  constructor() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(
        "https://tickethub-f6gxgnhngpbue9gs.southeastasia-01.azurewebsites.net/notificationHub",
      )
      .withAutomaticReconnect()
      .build();

    this.connection.onclose(() => {
      console.log("Connection closed, attempting to reconnect...");
      this.startConnection();
    });
  }

  async startConnection() {
    try {
      await this.connection.start();
      console.log("Connected to SignalR Hub");
    } catch (err) {
      console.error("Error connecting:", err);
      setTimeout(() => this.startConnection(), 5000);
    }
  }

  // Join a chat room
  async joinRoom(roomId) {
    try {
      await this.connection.invoke("JoinRoom", roomId);
      console.log("Joined room:", roomId);
    } catch (err) {
      console.error("Error joining room:", err);
    }
  }

  // Leave a chat room
  async leaveRoom(roomId) {
    try {
      await this.connection.invoke("LeaveRoom", roomId);
      console.log("Left room:", roomId);
    } catch (err) {
      console.error("Error leaving room:", err);
    }
  }

  // Send message to room
  async sendMessageToRoom(roomId, userId, message) {
    try {
      await this.connection.invoke(
        "SendMessageToRoom",
        roomId,
        userId,
        message,
      );
    } catch (err) {
      console.error("Error sending message:", err);
      throw err;
    }
  }

  // Listen for incoming messages
  onReceiveMessage(callback) {
    this.connection.on("ReceiveMessage", (userId, message) => {
      console.log("Message received from:", userId, message);
      callback(userId, message);
    });
  }
}

export const signalRService = new SignalRService();
