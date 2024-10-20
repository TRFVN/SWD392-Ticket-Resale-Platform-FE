import React from "react";
import SearchEvent from "./Search/SearchEvent";
import Dropdown from "./Dropdown";
import State from "./State";
import Status from "./Status";
function Ticket() {
  return (
    <div className="w-full flex flex-col justify-start items-start gap-4">
      <h3 className="font-semibold text-4xl">Your Tickets</h3>
      <div className="border-b-2  w-full border-gray-900"></div>
      <State />
      <Status />
      {/* <div className="w-1/3">
        <SearchEvent />
      </div>
      <div>
        <Dropdown />
      </div> */}
    </div>
  );
}

export default Ticket;
