import React from "react";
import { Tickets } from "lucide-react";
function TicketMangement() {
  return (
    <div className="flex flex-col justify-start items-start w-full p-8">
      <div className="flex flex-row justify-start items-center gap-3 ">
        <Tickets />
        <span className="text-2xl font-semibold">Tickets Mangement</span>
      </div>
    </div>
  );
}

export default TicketMangement;
