import React from "react";

function index({ currentState, handleChangeCurrentState }) {
  return (
    <div className="grid grid-cols-12 justify-center items-center gap-6 px-1 w-full">
      <div
        className={`col-span-3 py-1 px-2 border rounded-xl text-center font-medium cursor-pointer ${
          currentState === "All" ? "bg-orange-400" : "bg-gray-200"
        }`}
        onClick={() => handleChangeCurrentState("All")}
      >
        All
      </div>
      <div
        className={`col-span-3 py-1 px-2 border rounded-xl text-center font-medium cursor-pointer ${
          currentState === "Success" ? "bg-orange-400" : "bg-gray-200"
        }`}
        onClick={() => handleChangeCurrentState("Success")}
      >
        Success
      </div>
      <div
        className={`col-span-3 py-1 px-2 border rounded-xl text-center font-medium cursor-pointer ${
          currentState === "Processing" ? "bg-orange-400" : "bg-gray-200"
        }`}
        onClick={() => handleChangeCurrentState("Processing")}
      >
        Processing
      </div>
      <div
        className={`col-span-3 py-1 px-2 border rounded-xl text-center font-medium cursor-pointer ${
          currentState === "Canceled" ? "bg-orange-400" : "bg-gray-200"
        }`}
        onClick={() => handleChangeCurrentState("Canceled")}
      >
        Rejected
      </div>
    </div>
  );
}

export default index;
