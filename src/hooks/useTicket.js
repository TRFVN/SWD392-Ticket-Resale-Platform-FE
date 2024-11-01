import { useState, useEffect } from "react";
import { getTicketByIdApi } from "../services/ticket";

export const useTicket = (ticketId) => {
  const [ticket, setTicket] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchTicket = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getTicketByIdApi(ticketId);
        if (isMounted) {
          setTicket(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // Chỉ fetch khi có ticketId
    if (ticketId) {
      fetchTicket();
    }

    return () => {
      isMounted = false;
    };
  }, [ticketId]);

  return { ticket, isLoading, error };
};
