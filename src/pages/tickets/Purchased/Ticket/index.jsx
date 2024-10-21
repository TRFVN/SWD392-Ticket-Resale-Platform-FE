import React, { useEffect } from "react";
import { getTickets } from "../../../../services/ticket";
function Ticket() {
  useEffect(() => {
    getTickets();
  }, []);
  return <div>Ticket</div>;
}

export default Ticket;
