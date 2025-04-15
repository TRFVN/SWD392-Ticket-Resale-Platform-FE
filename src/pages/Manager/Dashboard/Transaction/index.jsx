import React, { useState, useEffect } from "react";
import { getRevenuePagination } from "../../../../services/manager";

const Transaction = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Start with page 1
  const [totalPages, setTotalPages] = useState(1); // Set total pages to 1 initially

  // Fetch data for transactions with pagination
  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        setLoading(true);
        const res = await getRevenuePagination(currentPage); // Fetch data based on current page
        setData(res.transactions); // Set transactions data
        setTotalPages(res.totalPages); // Set total number of pages from API
        console.log("Fetched Data", res);
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchTransaction();
  }, [currentPage]); // Fetch new data whenever the currentPage changes

  if (error) {
    return <div>{error}</div>;
  }

  // Handle page change (next/previous)
  const handlePageChange = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="p-6 rounded-xl shadow-md bg-manager-secondary text-white">
      <h2 className="text-2xl font-bold mb-4 text-white">Transaction List</h2>

      {loading ? (
        <div className="text-center text-white">Loading...</div>
      ) : (
        <>
          <table className="w-full table-auto border-collapse text-white">
            <thead>
              <tr>
                <th className="px-4 py-2 border">ID</th>
                <th className="px-4 py-2 border">Date</th>
                <th className="px-4 py-2 border">Amount</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Description</th>
              </tr>
            </thead>
            <tbody>
              {data.map((transaction) => (
                <tr key={transaction.transactionId}>
                  <td className="px-4 py-2 border">
                    {transaction.transactionId}
                  </td>
                  <td className="px-4 py-2 border">
                    {transaction.transactionDateTime}
                  </td>
                  <td className="px-4 py-2 border">{transaction.amount}</td>
                  <td className="px-4 py-2 border">{transaction.status}</td>
                  <td className="px-4 py-2 border">
                    {transaction.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <button
              className="px-4 py-2 bg-gray-700 rounded-md"
              onClick={() => handlePageChange("prev")}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            <div className="text-white">
              Page {currentPage} of {totalPages}
            </div>

            <button
              className="px-4 py-2 bg-gray-700 rounded-md"
              onClick={() => handlePageChange("next")}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Transaction;
