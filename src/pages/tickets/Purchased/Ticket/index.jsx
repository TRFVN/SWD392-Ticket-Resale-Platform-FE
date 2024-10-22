import React, { useEffect, useState } from "react";
import { getAllTicketsApi } from "../../../../services/ticket";
import Empty from "./Empty";

function Ticket({ currentState, handleChangeCurrentState }) {
  console.log("current state: " + currentState);
  const [ticketList, setTicketList] = useState([]);
  useEffect(() => {
    const getAllTickets = async () => {
      const rs = await getAllTicketsApi();
      if (rs) {
        setTicketList(rs);
      } else {
        console.error("Failed to fetch tickets");
      }
    };
    getAllTickets();
  }, []);

  return (
    <>
      {ticketList && ticketList.length > 0 ? (
        <div className="grid grid-cols-12 justify-center items-center w-full">
          {ticketList.map((ticket, index) => {
            return (
              <div
                key={index}
                className="col-span-3 flex flex-col justify-center items-center"
              >
                <img
                  src={ticket.ticketImage}
                  alt={ticket.ticketName}
                  className="h-30 w-50 object-contain"
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-10">
          <Empty />
        </div>
      )}
    </>
  );
}

export default Ticket;
