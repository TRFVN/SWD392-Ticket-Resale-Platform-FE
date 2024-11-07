import React, { useState } from "react";
import { CalendarFold } from "lucide-react";
import Progress from "./Progress";
import GetAll from "./GetAll";
import AddNew from "./AddNew";
function EventsMangement() {
  const [currentProgress, setCurrentProgress] = useState("Get All");

  const handleChangeProgress = (newProgress) => {
    setCurrentProgress(newProgress);
  };
  return (
    <div className="flex flex-col justify-start items-start gap-8 p-8 w-full">
      <div className="flex flex-row justify-start items-center gap-3 ">
        <CalendarFold />
        <span className="text-2xl font-semibold">Events Mangement</span>
      </div>
      <div className="w-full">
        <Progress
          currentProgress={currentProgress}
          handleChangeProgress={handleChangeProgress}
        />
      </div>
      <div className="bg-white flex flex-col justify-start items-start w-full border-[1px] rounded-sm">
        {currentProgress === "Get All" ? <GetAll /> : <AddNew />}
      </div>
    </div>
  );
}

export default EventsMangement;
