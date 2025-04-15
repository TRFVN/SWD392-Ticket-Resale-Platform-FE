import axiosInstance from "../config/axiosConfig";

export const getRevenue = async () => {
  try {
    const startDate = "01/01/2000";

    const today = new Date();
    const endDate = today.toLocaleDateString("en-US");

    const response = await axiosInstance.get(`/api/revenue/profit`, {
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
export const getRevenuePagination = async (pageNumber, pageSize) => {
  try {
    const startDate = "01/01/2000";

    const today = new Date();
    const endDate = today.toLocaleDateString("en-US");

    const response = await axiosInstance.get(`/api/revenue/profit`, {
      params: {
        startDate,
        endDate,
        pageNumber,
        pageSize,
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

export const getTicket = async (pageNumber) => {
  try {
    const response = await axiosInstance.get(`/api/tickets/templates`, {
      params: {
        pageNumber: pageNumber,
      },
    });
    console.log(response.data.result);

    return response.data.result;
  } catch (error) {
    console.log(error.message || "Lỗi khi lấy ticket");
    throw new Error(error.message || "Lỗi khi lấy ticket");
  }
};

export const getOrganizer = async () => {
  try {
    const response = await axiosInstance.get(`/api/revenue/organizer`);
    console.log(response.data.result);

    return response.data.result;
  } catch (error) {
    console.log(error.message || "Lỗi khi lấy organizer");
    throw new Error(error.message || "Lỗi khi lấy organizer");
  }
};
export const getCustomer = async () => {
  try {
    const response = await axiosInstance.get(`/api/revenue/customer`);
    return response.data.result.customers;
  } catch (error) {
    console.log(error.message || "Lỗi khi lấy customer");
    throw new Error(error.message || "Lỗi khi lấy customer");
  }
};

export const getCategory = async () => {
  try {
    const response = await axiosInstance.get(`/api/revenue/customer`);
    return response.data.result;
  } catch (error) {
    console.log(error.message || "Lỗi khi lấy category");
    throw new Error(error.message || "Lỗi khi lấy category");
  }
};
