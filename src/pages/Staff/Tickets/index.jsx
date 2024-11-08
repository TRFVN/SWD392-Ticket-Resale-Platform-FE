import React, { useState } from "react";
import { Tickets } from "lucide-react";
import Progress from "./Progress";
function TicketMangement() {
  const [currentState, setCurrentState] = useState("All");

  const handleChangeState = (newState) => {
    setCurrentState(newState);
  };
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
    </div>
  );
}

export default TicketMangement;
