import axiosInstance from "../config/axiosConfig";

export const getAllEventApi = async () => {
  const response = await axiosInstance.get("/Event");
  try {
    if (response.status === 200) {
      return response.data.result;
    } else {
      throw new Error(response.data.message || "Failed to get events");
    }
  } catch (error) {
    throw new Error(error.message || "Failed to get events");
  }
};
