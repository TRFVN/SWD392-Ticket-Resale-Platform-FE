import { current } from "@reduxjs/toolkit";
import React, { useState } from "react";
import { PiHandshake, PiShoppingBag, PiTicket } from "react-icons/pi";
function Sidebar({ currentTab, handleChangeTab }) {
  return (
    <div className="w-full flex flex-col justify-start items-start border rounded-xl py-4 px-6 gap-3">
      <div
        className={`flex flex-row items-center gap-3 hover:font-medium cursor-pointer ${
          currentTab === "Purchased" ? "text-orange-400" : ""
        }`}
        onClick={() => handleChangeTab("Purchased")}
      >
        <PiShoppingBag />
        Purchased
      </div>
      <div
        className={`flex flex-row items-center gap-3 hover:font-medium cursor-pointer ${
          currentTab === "Negotiating" ? "text-orange-400" : ""
        }`}
        onClick={() => handleChangeTab("Negotiating")}
      >
        <PiHandshake />
        Negotiating
      </div>
      <div
        className={`flex flex-row items-center gap-3 hover:font-medium cursor-pointer ${
          currentTab === "Selling" ? "text-orange-400" : ""
        }`}
        onClick={() => handleChangeTab("Selling")}
      >
        <PiTicket />
        Selling
      </div>
    </div>
  );
}

export default Sidebar;
