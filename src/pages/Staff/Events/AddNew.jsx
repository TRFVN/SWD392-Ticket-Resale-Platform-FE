import React from "react";

function AddNew() {
  return (
    <form className="flex flex-col justify-start items-start gap-5 p-8 w-full">
      <div className="flex flex-col gap-3 w-1/2">
        <label htmlFor="eventName" className="text-lg font-medium">
          Event Name
        </label>
        <input
          type="text"
          id="eventName"
          name="eventName"
          placeholder=""
          rows={3}
          className="border rounded-md px-3 py-2"
        />
      </div>
      <div className="flex flex-col gap-3 w-1/2">
        <label htmlFor="eventName" className="text-lg font-medium">
          Event Name
        </label>
        <input
          type="text"
          id="eventName"
          name="eventName"
          placeholder=""
          rows={3}
          className="border rounded-md px-3 py-2"
        />
      </div>
    </form>
  );
}

export default AddNew;
