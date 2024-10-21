import React from "react";

function index({ currentStatus, handleChangeCurrentStatus }) {
  return (
    <div className="flex flex-row justify-center items-center gap-4 w-1/5">
      <div className="flex flex-col justify-center items-center w-full">
        <div
          className="cursor-pointer"
          onClick={() => handleChangeCurrentStatus("Coming soon")}
        >
          Coming soon
        </div>
        <span
          className={`block h-[2px] w-1/4 mt-1 ${
            currentStatus === "Coming soon" ? "bg-orange-400" : ""
          }`}
        ></span>
      </div>
      <div className="flex flex-col justify-center items-center w-full">
        <div
          className="cursor-pointer"
          onClick={() => handleChangeCurrentStatus("Ended")}
        >
          Ended
        </div>
        <span
          className={`block h-[2px] w-1/4 mt-1 ${
            currentStatus === "Ended" ? "bg-orange-400" : ""
          }`}
        ></span>
      </div>
    </div>
  );
}

export default index;
