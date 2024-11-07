import React from "react";

function Progress({ currentProgress, handleChangeProgress }) {
  return (
    <div className="grid grid-cols-12 flex-row justify-center items-center w-full border-[1px] rounded-md text-base font-medium">
      <div
        className={`col-span-6 w-full py-4 px-4 text-center cursor-pointer ${
          currentProgress === "Get All" ? "bg-orange-300" : ""
        }  `}
        onClick={() => handleChangeProgress("Get All")}
      >
        Get All
      </div>
      <div
        className={`col-span-6 w-full py-4 px-4 text-center cursor-pointer ${
          currentProgress === "Add New" ? "bg-orange-300" : ""
        }  `}
        onClick={() => handleChangeProgress("Add New")}
      >
        Add New
      </div>
    </div>
  );
}

export default Progress;
