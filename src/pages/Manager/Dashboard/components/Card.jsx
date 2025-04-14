import React from "react";

const Card = ({ data }) => {
  return (
    <div className="col-span-1 p-4 bg-manager-secondary  rounded-2xl shadow-md flex items-center justify-between transition-transform hover:scale-[1.02] duration-300">
      <div className="flex items-center gap-4">
        <div className="bg-gray-700 p-3 rounded-full">{data.icon}</div>
        <div className="flex flex-col">
          <h4 className="text-sm font-medium text-white ">{data.title}</h4>
          <p className="text-lg font-semibold text-primary-dark ">
            {data.total.toLocaleString()}{" "}
            {data.title === "Total Revenue" && "₫"}
          </p>
        </div>
      </div>
      <span
        className={`text-sm font-medium ${
          data.change.startsWith("+") ? "text-green-500" : "text-red-500"
        }`}
      >
        {data.change}
      </span>
    </div>
  );
};

export default Card;
