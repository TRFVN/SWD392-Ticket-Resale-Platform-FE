import axiosInstance from "../config/axiosConfig";

export const getAllTicketsApi = async () => {
  try {
    const rs = await axiosInstance.get("/Tickets");
    if (rs.status === 200) {
      return rs.data.result;
    } else {
      throw new Error(`Error: Received status code ${rs.status}`);
    }
  } catch (error) {
    console.error("Failed to fetch tickets:", error.message || error);
    throw new Error("Failed to fetch tickets");
  }
};
