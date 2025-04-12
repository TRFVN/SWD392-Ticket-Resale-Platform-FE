import axios from "axios";
import axiosInstance from "../config/axiosConfig";

export const getAllEventApi = async () => {
  try {
    const response = await axiosInstance.get("/api/Event");
    if (response.status === 200) {
      return response.data.result;
    } else {
      throw new Error(response.data.message || "Failed to get events");
    }
  } catch (error) {
    throw new Error(error.message || "Failed to get events");
  }
};

export const getLocationApi = async () => {
  try {
    const response = await axios.get(
      "https://provinces.open-api.vn/api?depth=2",
    );
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(response.data.message || "Failed to get locations");
    }
  } catch (error) {
    throw new Error(error.message || "Failed to get locations");
  }
};

export const postEventApi = async (eventData) => {
  try {
    // Format the data to match API's expected structure
    const formattedEventData = {
      eventName: eventData.eventName,
      eventDescription: eventData.eventDescription,
      eventDate: eventData.eventDate,
      categoryId: eventData.categoryId,
      location: eventData.location,
      eventImage: eventData.eventImage,
    };

    const response = await axiosInstance.post("/api/Event", formattedEventData);

    if (response.status === 201) {
      return response.data.result;
    } else {
      throw new Error(response.data.message || "Failed to create event");
    }
  } catch (error) {
    console.error("Error in postEventApi:", error);
    throw new Error(error.message || "Failed to create event");
  }
};

export const deleteEventApi = async (eventId) => {
  try {
    const response = await axiosInstance.delete(`/api/Event/${eventId}`);
    if (response.status === 200 || response.status === 201) {
      return response.data.result;
    } else {
      throw new Error(response.data.message || "Failed to delete event");
    }
  } catch (error) {
    throw new Error(error.message || "Failed to delete event");
  }
};

export const putEventApi = async (eventData) => {
  try {
    const response = await axiosInstance.put("/api/Event", {
      eventId: eventData.eventId,
      eventName: eventData.eventName,
      eventDescription: eventData.eventDescription,
      eventDate: eventData.eventDate,
      categoryId: eventData.categoryId,
      location: eventData.location,
      eventImage: eventData.eventImage,
    });

    if (response.status === 200 || response.status === 201) {
      return response.data.result;
    } else {
      throw new Error(response.data.message || "Failed to update event");
    }
  } catch (error) {
    throw new Error(error.message || "Failed to update event");
  }
};

// Get event by ID
export const getEventByIdApi = async (eventId) => {
  try {
    const response = await axiosInstance.get(`/api/Event/${eventId}`);
    if (response.status === 200) {
      return response.data.result;
    } else {
      throw new Error(response.data.message || "Failed to get event details");
    }
  } catch (error) {
    throw new Error(error.message || "Failed to get event details");
  }
};
// Get event by ID
export const getEventByUserID = async () => {
  try {
    const response = await axiosInstance.get(`/api/Event/userId`);
    if (response.status === 200) {
      return response.data.result;
    } else {
      throw new Error(response.data.message || "Failed to get event details");
    }
  } catch (error) {
    throw new Error(error.message || "Failed to get event details");
  }
};
