import React, { useEffect, useState } from "react";
import { getRevenue } from "../../../services/manager";
import { FaMoneyBillWave } from "react-icons/fa";

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [totalProfit, setTotalProfit] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const data = await getRevenue();
        setTransactions(data.transactions || []);
        setTotalProfit(data.totalProfit || 0);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu giao dịch:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenue();
  }, []);

  return (
    <div className="p-6 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-12">Transaction Management</h1>

      <div className="bg-gray-800 p-4 rounded-lg shadow-md mb-12 flex items-center gap-4">
        <FaMoneyBillWave className="text-green-400 text-3xl" />
        <div>
          <p className="text-gray-300">Total Profit</p>
          <p className="text-xl font-semibold text-green-300">
            {totalProfit.toLocaleString()} ₫
          </p>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 text-white rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-700 text-left">
                <th className="p-3">No.</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Email</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Method</th>
                <th className="p-3">Date</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, index) => (
                <tr
                  key={tx.transactionId}
                  className="border-b border-gray-700 hover:bg-gray-700"
                >
                  <td className="p-3 bg-gray-900">{index}</td>
                  <td className="p-3 bg-gray-800">
                    {tx.customer?.user?.fullName || "No name"}
                  </td>
                  <td className="p-3 bg-gray-900">
                    {tx.customer?.user?.email || "N/A"}
                  </td>
                  <td className="p-3 bg-gray-800 text-green-400">
                    {tx.amount.toLocaleString()} ₫
                  </td>
                  <td className="p-3 bg-gray-900">{tx.transactionMethod}</td>
                  <td className="p-3 bg-gray-800">
                    {new Date(tx.transactionDateTime).toLocaleString("vi-VN")}
                  </td>
                  <td className="p-3 bg-gray-900">
                    <span
                      className={`px-2 py-1 text-sm rounded ${
                        tx.status === "PAID"
                          ? "bg-green-600 text-white"
                          : "bg-red-600 text-white"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center p-4 text-gray-400 bg-gray-900"
                  >
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Transaction;
