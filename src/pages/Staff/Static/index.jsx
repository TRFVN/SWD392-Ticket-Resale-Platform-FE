import React from "react";
import { ChartColumnBig } from "lucide-react";
function StaticManagement() {
  return (
    <div className="flex flex-col justify-start items-start w-full p-8">
      <div className="flex flex-row justify-start items-center gap-3 ">
        <ChartColumnBig />
        <span className="text-2xl font-semibold">Static Mangement</span>
      </div>
    </div>
  );
}

export default StaticManagement;
