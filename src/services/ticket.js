import axiosInstance from "../config/axiosConfig";

export const getAllTicketsApi = async () => {
  try {
    const rs = await axiosInstance.get("api/Tickets");
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

export const GetUserTicket = async () => {
  try {
    const rs = await axiosInstance.get("/Tickets/user");
    if (rs.status === 200) {
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
    const ticketData = {
      ticketName: ticket.ticketName,
      ticketDescription: ticket.ticketDescription,
      eventId: ticket.eventId,
      categoryId: ticket.categoryId,
      ticketPrice: ticket.ticketPrice,
      ticketImage: ticket.imageUrl || ticket.ticketImage,
      serialNumber: ticket.serialNumber,
      status: ticket.status || 0,
    };

    const response = await axiosInstance.post("/api/Tickets/organization", [
      ticketData,
    ]);

    if (response.status === 201) {
      return response.data.result;
    }

    throw new Error(response.data.message || "Failed to create ticket");
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message ||
          `Failed to create ticket: ${error.response.status}`,
      );
    }
    throw new Error("Failed to create ticket: Network error");
  }
};

export const uploadTicketApi = async (image, onProgress) => {
  try {
    const response = await axiosInstance.post(
      "/api/Tickets/upload-image",
      image,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          onProgress(percentCompleted); // Cập nhật tiến trình tải lên
        },
      },
    );
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to upload ticket");
  }
};
