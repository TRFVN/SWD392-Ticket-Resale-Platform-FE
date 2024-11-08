import React, { useEffect, useState } from "react";
import { Tickets } from "lucide-react";
import Progress from "./Progress";
import All from "./All";
import Processing from "./Processing";
import Approved from "./Approved";
import Rejected from "./Rejected";
import { getAllTicketsApi } from "../../../services/ticket";
function TicketMangement() {
  const [currentState, setCurrentState] = useState("All");
  const [ticketList, setTicketList] = useState([]);
  const handleChangeState = (newState) => {
    setCurrentState(newState);
  };

  useEffect(() => {
    const getAllTicket = async () => {
      const response = await getAllTicketsApi();
      if (response) {
        setTicketList(response);
      }
    };
    getAllTicket();
  }, []);

  return (
    <div className="flex flex-col justify-start items-start gap-8 w-full p-8">
      <div className="flex flex-row justify-start items-center gap-3 ">
        <Tickets />
        <span className="text-2xl font-semibold">Tickets Mangement</span>
      </div>
      <Progress
        currentState={currentState}
        handleChangeState={handleChangeState}
      />
      <div className="bg-white flex flex-col justify-start items-start w-full border-[1px] rounded-sm">
        {currentState === "All" && <All ticketList={ticketList} />}
        {currentState === "Processing" && <Processing />}
        {currentState === "Approved" && <Approved />}
        {currentState === "Rejected" && <Rejected />}
      </div>
    </div>
  );
}

export default TicketMangement;
