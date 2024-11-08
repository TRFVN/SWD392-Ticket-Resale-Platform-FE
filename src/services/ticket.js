import axiosInstance from "../config/axiosConfig";

export const getAllTicketsApi = async (currentPage, quantityDisplay) => {
  try {
    const rs = await axiosInstance.get("/Tickets", {
      params: {
        pageNumber: currentPage,
        pageSize: quantityDisplay,
      },
    });
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

export const getTicketByIdApi = async (ticketId) => {
  try {
    const rs = await axiosInstance.get(`/Tickets/${ticketId}`);
    if (rs.status === 201) {
      return rs.data.result;
    } else {
      throw new Error(
        rs.data.message || `Error: Received status code ${rs.status}`,
      );
    }
  } catch (error) {
    console.error("Failed to fetch ticket details:", error.message || error);
    throw error;
  }
};

export const acceptTicketApi = async (ticketId) => {
  try {
    const response = await axiosInstance.post(`/Tickets/${ticketId}/accept`);
    if (response.status === 200) {
      return response;
    } else {
      throw new Error(`Failed to approve Ticket`);
    }
  } catch (error) {
    throw new Error(`Failed to approve Ticket`);
  }
};
export const rejectTicketApi = async (ticketId) => {
  try {
    const response = await axiosInstance.post(`/Tickets/${ticketId}/reject`);
    if (response.status === 200) {
      return response;
    } else {
      throw new Error(`Failed to reject Ticket`);
    }
  } catch (error) {
    throw new Error(`Failed to reject Ticket`);
  }
};
