import React from "react";
import SearchEvent from "./SearchEvent";
import Dropdown from "./Dropdown";
function Ticket() {
  return (
    <div className="w-full flex flex-col justify-start items-start">
      <h3 className="font-bold text-5xl">Your Tickets</h3>
      <div className="w-full">
        <SearchEvent />
      </div>
      <div>
        <Dropdown />
      </div>
    </div>
  );
}

export default Ticket;
