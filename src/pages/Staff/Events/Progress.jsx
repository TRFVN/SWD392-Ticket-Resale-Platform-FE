import React from "react";

function Progress({ currentProgress, handleChangeProgress }) {
  return (
    <div className="grid grid-cols-12 flex-row justify-center items-center w-full border-[1px] rounded-md text-base font-medium">
      <div
        className={`col-span-4 w-full py-4 px-4 text-center cursor-pointer ${
          currentProgress === "Get All" ? "bg-orange-400" : "bg-white"
        }  `}
        onClick={() => handleChangeProgress("Get All")}
      >
        Get All
      </div>
      <div
        className={`col-span-4 w-full py-4 px-4 text-center cursor-pointer border-x-[1px] ${
          currentProgress === "Add New Event" ? "bg-orange-400" : "bg-white"
        }  `}
        onClick={() => handleChangeProgress("Add New Event")}
      >
        Add New Event
      </div>
      <div
        className={`col-span-4 w-full py-4 px-4 text-center cursor-not-allowed ${
          currentProgress === "Update Event" ? "bg-orange-400" : "bg-white"
        }`}
        // onClick={() => handleChangeProgress("Update Event")}
      >
        Update Event
      </div>
    </div>
  );
}

export default Progress;
