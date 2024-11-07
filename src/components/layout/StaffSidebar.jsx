import React, { useEffect, useState } from "react";
import { AlignJustify, MapPin, Tickets, CalendarFold } from "lucide-react";
function StaffSidebar({
  toggleSidebar,
  showSidebar,
  currentPath,
  handleChangePath,
}) {
  const [items, setItems] = useState([
    { id: 1, icon: <Tickets />, label: "Tickets" },
    { id: 2, icon: <CalendarFold />, label: "Events" },
    { id: 3, icon: <MapPin />, label: "Locations" },
  ]);

  return (
    <div className="flex flex-col justify-start items-start py-3 w-full border-r-[1px] border-b-[1px]">
      <div
        className={`flex flex-row ${
          showSidebar ? "justify-end" : "justify-center"
        } items-center  w-full px-3`}
        onClick={() => toggleSidebar()}
      >
        <div className="flex flex-row justify-center items-center border rounded-md p-2 h-9 w-9 hover:bg-orange-400 cursor-pointer">
          <AlignJustify />
        </div>
      </div>
      <div className="flex flex-col justify-start items-start w-full mt-3">
        {items &&
          items.length > 0 &&
          items.map((item, index) => {
            return (
              <div
                key={index}
                className={`flex flex-row gap-3 font-medium text-base ${
                  showSidebar ? "justify-start" : "justify-center"
                }  items-center py-4 w-full cursor-pointer px-5 hover:bg-orange-200 ${
                  currentPath === item.label.toLowerCase()
                    ? "bg-orange-200"
                    : ""
                }`}
                onClick={() => handleChangePath(item.label.toLowerCase())}
              >
                <div>{item.icon}</div>
                {showSidebar && <div>{item.label}</div>}
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default StaffSidebar;
