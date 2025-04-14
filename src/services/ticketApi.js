import axiosInstance from "../config/axiosConfig";

// Create a new ticket for an event
export const createTicket = async (eventId, ticketData) => {
  try {
    const response = await axiosInstance.post(`/api/Event/${eventId}/tickets`, {
      name: ticketData.name,
      price: ticketData.price,
      quantity: ticketData.quantity,
      type: ticketData.type,
      description: ticketData.description,
    });

    if (response.status === 201 || response.status === 200) {
      return response.data.result;
    } else {
      throw new Error(response.data.message || "Failed to create ticket");
    }
  } catch (error) {
    throw new Error(error.message || "Failed to create ticket");
  }
};

// Get all tickets for an event
export const getTicketsByEventId = async (eventId) => {
  try {
    const response = await axiosInstance.get(`/api/Event/${eventId}/tickets`);

    if (response.status === 200) {
      return response.data.result;
    } else {
      throw new Error(response.data.message || "Failed to get tickets");
    }
  } catch (error) {
    throw new Error(error.message || "Failed to get tickets");
  }
};

// Update a ticket
export const updateTicket = async (eventId, ticketId, ticketData) => {
  try {
    const response = await axiosInstance.put(
      `/api/Event/${eventId}/tickets/${ticketId}`,
      {
        name: ticketData.name,
        price: ticketData.price,
        quantity: ticketData.quantity,
        type: ticketData.type,
        description: ticketData.description,
      },
    );

    if (response.status === 200) {
      return response.data.result;
    } else {
      throw new Error(response.data.message || "Failed to update ticket");
    }
  } catch (error) {
    throw new Error(error.message || "Failed to update ticket");
  }
};

// Delete a ticket
export const deleteTicket = async (eventId, ticketId) => {
  try {
    const response = await axiosInstance.delete(
      `/api/Event/${eventId}/tickets/${ticketId}`,
    );

    if (response.status === 200) {
      return response.data.result;
    } else {
      throw new Error(response.data.message || "Failed to delete ticket");
    }
  } catch (error) {
    throw new Error(error.message || "Failed to delete ticket");
  }
};

// Create a new ticket template
export const createTicketTemplate = async (ticketTemplateData) => {
  try {
    const response = await axiosInstance.post(
      "/api/tickets/create-ticket-template",
      ticketTemplateData,
    );

    if (response.status === 201 || response.status === 200) {
      return response.data;
    } else {
      throw new Error(
        response.data.message || "Failed to create ticket template",
      );
    }
  } catch (error) {
    throw new Error(error.message || "Failed to create ticket template");
  }
};

// Get ticket templates by event ID
export const getTicketTemplatesByEventId = async (
  eventId,
  page = 1,
  pageSize = 10,
) => {
  try {
    const response = await axiosInstance.get(`/api/tickets/event/${eventId}`, {
      params: {
        pageNumber: page,
        pageSize: pageSize,
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(
        response.data.message || "Failed to get ticket templates",
      );
    }
  } catch (error) {
    throw new Error(error.message || "Failed to get ticket templates");
  }
};

// Update ticket template
export const updateTicketTemplate = async (ticketTemplateData) => {
  try {
    const response = await axiosInstance.put(
      `/api/tickets/update-ticket-template`,
      ticketTemplateData,
    );

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(
        response.data.message || "Failed to update ticket template",
      );
    }
  } catch (error) {
    throw new Error(error.message || "Failed to update ticket template");
  }
};

// Delete ticket template
export const deleteTicketTemplate = async (ticketTemplateId) => {
  try {
    const response = await axiosInstance.delete(
      `/api/tickets/${ticketTemplateId}`,
    );

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(
        response.data.message || "Failed to delete ticket template",
      );
    }
  } catch (error) {
    throw new Error(error.message || "Failed to delete ticket template");
  }
};
