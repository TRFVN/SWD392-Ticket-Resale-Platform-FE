import axiosInstance from "../config/axiosConfig";

export const getAllTicketsApi = async () => {
  try {
    const rs = await axiosInstance.get("/Tickets");
    if (rs.status === 200) {
      console.log(rs);
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

export const postTicketApi = async (ticket) => {
  try {
    const response = await axiosInstance.post("/Tickets", {
      ticketName: ticket.ticketName,
      ticketDescription: ticket.ticketDescription,
      eventId: ticket.eventId,
      categoryId: ticket.categoryId,
      ticketPrice: ticket.ticketPrice,
      ticketImage: ticket.imageUrl,
      serialNumber: ticket.serialNumber,
    });
    if (response.status === 201) {
      return response.data.result;
    } else {
      throw new Error(response.data.message || "Failed to create ticket");
    }
  } catch (error) {
    throw new Error(`Failed to create`);
  }
};
