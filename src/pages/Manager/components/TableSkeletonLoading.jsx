import React from "react";

const TableSkeletonLoading = () => {
  return (
    <div className="animate-pulse w-full">
      <div className="h-4 bg-gray-200 mt-3 mb-6 rounded"></div>
      <div className="h-4 bg-gray-300 mb-6 rounded"></div>
      <div className="h-4 bg-gray-200 mb-6 rounded"></div>
      <div className="h-4 bg-gray-300 mb-6 rounded"></div>
      <div className="h-4 bg-gray-200 mb-6 rounded"></div>
    </div>
  );
};

export default TableSkeletonLoading;
