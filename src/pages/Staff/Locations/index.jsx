import React from "react";
import { MapPin } from "lucide-react";
function LocationMangement() {
  return (
    <div className="flex flex-col justify-start items-start w-full p-8">
      <div className="flex flex-row justify-start items-center gap-3 ">
        <MapPin />
        <span className="text-2xl font-semibold">Location Mangement</span>
      </div>
    </div>
  );
}

export default LocationMangement;
