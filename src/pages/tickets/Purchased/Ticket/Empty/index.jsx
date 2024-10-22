import React from "react";

function Empty() {
  return (
    <div className="flex flex-col justify-center items-center w-full">
      <div className="flex flex-col justify-center items-center gap-4 w-full">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1-kiBiEbgtDLQ-S9kzz9TpiGEiZr179m-Gg&s" />
        <span>You do not have any tickets yet</span>
      </div>
      <button className="bg-orange-400 text-white py-2 px-4 rounded-xl mt-14">
        Buy tickets now
      </button>
    </div>
  );
}

export default Empty;
