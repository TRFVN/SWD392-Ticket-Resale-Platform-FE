import React from "react";
import Dashboard from "./Dashboard";
import Account from "./Account";
import Category from "./Category";
import Event from "./Event";
import Message from "./Message";
import Report from "./Report";
import Setting from "./Setting";
import Ticket from "./Ticket";

const Manager = ({ currentTab }) => {
  console.log("gfeudfwiu", currentTab);

  return (
    <main>
      {currentTab === "Dashboard" && <Dashboard />}
      {currentTab === "Category" && <Category />}
      {currentTab === "Event" && <Event />}
      {currentTab === "Ticket" && <Ticket />}
      {currentTab === "Account" && <Account />}
      {currentTab === "Message" && <Message />}
      {currentTab === "Reports" && <Report />}
      {currentTab === "Setting" && <Setting />}
    </main>
  );
};

export default Manager;
