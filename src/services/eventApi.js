import axiosInstance from "../config/axiosConfig";

export const getAllEventApi = async () => {
  try {
    const response = await axiosInstance.get("/Event");
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
    const response = await axiosInstance.get(
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

export const postEventApi = async (events) => {
  try {
    const response = await axiosInstance.post("/Event", {
      eventName: events.eventName,
      eventDescription: events.eventDescription,
      eventDate: events.eventDate,
      city: events.city,
      district: events.district,
      address: events.address,
    });
    if (response.status === 201) {
      return response.data.result;
    } else {
      throw new Error(response.data.message || "Failed to create event");
    }
  } catch (error) {
    throw new Error(error.message || "Failed to create event");
  }
};
