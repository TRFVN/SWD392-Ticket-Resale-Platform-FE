import React, { useState } from "react";
import State from "./State";
import Status from "./Status";
import Ticket from "./Ticket";
function Purchased() {
  const [currentState, setCurrentState] = useState("All");
  const [currentStatus, setCurrentStatus] = useState("Coming soon");
  const handleChangeCurrentState = (currState) => {
    setCurrentState(
      currState === "All"
        ? "All"
        : currState === "Success"
        ? "Success"
        : currState === "Processing"
        ? "Processing"
        : "Canceled",
    );
  };

  const handleChangeCurrentStatus = (currStatus) => {
    setCurrentStatus(currStatus === "Coming soon" ? "Coming soon" : "Ended");
  };
  return (
    <div className="flex flex-col justify-start items-center gap-5">
      <State
        currentState={currentState}
        handleChangeCurrentState={handleChangeCurrentState}
      />
      {(currentState === "All" || currentState === "Success") && (
        <Status
          currentStatus={currentStatus}
          handleChangeCurrentStatus={handleChangeCurrentStatus}
        />
      )}
      <Ticket
        currentState={currentState}
        handleChangeCurrentState={handleChangeCurrentState}
      />
    </div>
  );
}

export default Purchased;
