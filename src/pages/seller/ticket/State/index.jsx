import React from "react";

function index() {
  return (
    <div className="grid grid-cols-12 justify-center items-center gap-6 px-1 w-full">
      <div className="col-span-3 py-1 px-2 bg-orange-400 border rounded-xl text-center font-medium cursor-pointer">
        All
      </div>
      <div className="col-span-3 py-1 px-2 bg-orange-400 border rounded-xl text-center font-medium cursor-pointer">
        Success
      </div>
      <div className="col-span-3 py-1 px-2 bg-orange-400 border rounded-xl text-center font-medium cursor-pointer">
        Processing
      </div>
      <div className="col-span-3 py-1 px-2 bg-orange-400 border rounded-xl text-center font-medium cursor-pointer">
        Rejected
      </div>
    </div>
  );
}

export default index;
