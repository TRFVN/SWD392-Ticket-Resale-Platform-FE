import React, { useState } from "react";
import Purchased from "./Purchased";
import Negotiating from "./Negotiating";
import Selling from "./Selling";
import Sidebar from "./components/Sidebar";
function Ticket() {
  const [currentTab, setCurrentTab] = useState("Purchased");

  const handleChangeTab = (cur) => {
    setCurrentTab(
      cur === "Purchased"
        ? "Purchased"
        : cur === "Negotiating"
        ? "Negotiating"
        : "Selling",
    );
  };

  return (
    <div className="w-full flex flex-col justify-start items-start gap-4 mb-10">
      <h3 className="font-semibold text-3xl">Your Tickets</h3>
      <div className="border-b-2  w-full border-gray-900"></div>
      <div className="w-full grid grid-cols-12 justify-start items-start gap-10">
        <div className="col-span-2">
          <Sidebar currentTab={currentTab} handleChangeTab={handleChangeTab} />
        </div>
        <div className="col-span-10">
          {currentTab === "Purchased" && <Purchased />}
          {currentTab === "Negotiating" && <Negotiating />}
          {currentTab === "Selling" && <Selling />}
        </div>
      </div>
    </div>
  );
}

export default Ticket;
