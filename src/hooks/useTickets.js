import { useState, useEffect } from "react";
import axiosInstance from "../config/axiosConfig";

export const useTickets = (type = "all") => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        let response;

        if (type === "user") {
          response = await axiosInstance.get("/Tickets/user");
        } else {
          response = await axiosInstance.get("/tickets");
        }

        if (response.status === 200 && response.data.isSuccess) {
          setTickets(response.data.result);
        } else {
          throw new Error(
            response.data.message ||
              `Error: Received status code ${response.status}`,
          );
        }
      } catch (err) {
        setError(err.message || "Failed to fetch tickets");
        console.error("Ticket fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [type]);

  const refetch = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        type === "user" ? "/Tickets/user" : "/tickets",
      );

      if (response.status === 200 && response.data.isSuccess) {
        setTickets(response.data.result);
      } else {
        throw new Error(
          response.data.message ||
            `Error: Received status code ${response.status}`,
        );
      }
    } catch (err) {
      setError(err.message || "Failed to fetch tickets");
      console.error("Ticket fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    tickets,
    loading,
    error,
    refetch,
  };
};

// Separate utility function for one-off user ticket fetching
export const getUserTickets = async () => {
  try {
    const response = await axiosInstance.get("/Tickets/user");
    if (response.status === 200) {
      return response.data.result;
    } else {
      throw new Error(
        response.data.message ||
          `Error: Received status code ${response.status}`,
      );
    }
  } catch (error) {
    console.error("Failed to fetch user tickets:", error.message || error);
    throw error;
  }
};
