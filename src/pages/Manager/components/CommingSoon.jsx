import React from "react";
import { useNavigate } from "react-router-dom";
const ComingSoon = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-manager-secondary flex items-center justify-center px-4">
      <div className="text-center text-primary">
        <h1 className="text-5xl font-bold mb-4 animate-pulse">Coming Soon</h1>
        <p className="text-lg mb-8 text-gray-200">
          We’re working hard to bring you something awesome.
        </p>
        <div
          className="inline-block px-6 py-2 bg-primary text-white font-bold rounded-full shadow hover:shadow-lg transition-all duration-300 cursor-pointer"
          onClick={() => navigate(`/manager/dashboard`)}
        >
          Back
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
