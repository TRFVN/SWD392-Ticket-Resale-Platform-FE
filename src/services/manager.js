import axiosInstance from "../config/axiosConfig";

export const getRevenue = async () => {
  try {
    const startDate = "01/01/2000";

    const today = new Date();
    const endDate = today.toLocaleDateString("en-US");

    const response = await axiosInstance.get(`/api/revenue/revenue`, {
      params: {
        startDate,
        endDate,
        // pageNumber: 1,
        // pageSize: 10,
      },
    });

    return response.data.result;
  } catch (error) {
    console.log(error.message || "Lỗi khi lấy revenue");
    throw new Error(error.message || "Lỗi khi lấy revenue");
  }
};

export const getEvent = async () => {
  try {
    const response = await axiosInstance.get(`/api/Event`);
    return response.data.result;
  } catch (error) {
    console.log(error.message || "Lỗi khi lấy event");
    throw new Error(error.message || "Lỗi khi lấy event");
  }
};

export const getTicket = async () => {
  try {
    const response = await axiosInstance.get(`/api/tickets/templates`);
    return response.data.result;
  } catch (error) {
    console.log(error.message || "Lỗi khi lấy ticket");
    throw new Error(error.message || "Lỗi khi lấy ticket");
  }
};
