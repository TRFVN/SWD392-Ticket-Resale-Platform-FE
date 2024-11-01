import React from "react";
import { FaCreditCard, FaEdit } from "react-icons/fa";

const PaymentInfo = () => (
  <div className="space-y-8">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
        Payment Methods
      </h2>
      <button
        className="flex items-center space-x-2 px-4 py-2 text-orange-500 hover:bg-orange-50 
                        dark:hover:bg-orange-900/20 rounded-lg transition-colors duration-200"
      >
        <FaEdit size={16} />
        <span>Manage</span>
      </button>
    </div>

    <div className="relative group">
      <div
        className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 rounded-2xl 
                    opacity-50 blur-xl group-hover:opacity-70 transition-opacity duration-300"
      ></div>
      <div className="relative p-8 rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="flex justify-between items-start mb-8">
          <FaCreditCard size={28} className="text-orange-400" />
          <span className="text-gray-300">Visa</span>
        </div>
        <div className="text-2xl mb-8 text-white font-light tracking-widest">
          •••• •••• •••• 1234
        </div>
        <div className="flex justify-between text-sm text-gray-300">
          <span>John Doe</span>
          <span>12/25</span>
        </div>
      </div>
    </div>
  </div>
);

export default PaymentInfo;
