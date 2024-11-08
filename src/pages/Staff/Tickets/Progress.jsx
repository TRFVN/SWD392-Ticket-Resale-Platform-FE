import React from "react";

function Progress({ currentState, handleChangeState }) {
  return (
    <div className="grid grid-cols-12 flex-row justify-center items-center w-full border-[1px] rounded-md text-base font-medium">
      <div
        className={`col-span-3 w-full py-4 px-4 text-center cursor-pointer ${
          currentState === "All" ? "bg-orange-400" : "bg-white"
        }  `}
        onClick={() => handleChangeState("All")}
      >
        All
      </div>
      <div
        className={`col-span-3 w-full py-4 px-4 text-center cursor-pointer border-x-[1px] ${
          currentState === "Processing" ? "bg-orange-400" : "bg-white"
        }  `}
        onClick={() => handleChangeState("Processing")}
      >
        Processing
      </div>
      <div
        className={`col-span-3 w-full py-4 px-4 text-center border-r-[1px] cursor-pointer ${
          currentState === "Approved" ? "bg-orange-400" : "bg-white"
        }`}
        onClick={() => handleChangeState("Approved")}
      >
        Approved
      </div>
      <div
        className={`col-span-3 w-full py-4 px-4 text-center cursor-pointer ${
          currentState === "Rejected" ? "bg-orange-400" : "bg-white"
        }`}
        onClick={() => handleChangeState("Rejected")}
      >
        Rejected
      </div>
    </div>
  );
}

export default Progress;
