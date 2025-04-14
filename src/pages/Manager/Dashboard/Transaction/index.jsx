import React, { useState, useEffect } from "react";

const Transaction = ({ data }) => {
  console.log(data);

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // If there's an error, display it
  if (error) {
    return <div>{error}</div>;
  }

  // Render the transaction list when data is available
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Transaction List</h2>
      <table className="min-w-full table-auto border-collapse">
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
              <td className="px-4 py-2 border">{transaction.transactionId}</td>
              <td className="px-4 py-2 border">{transaction.date}</td>
              <td className="px-4 py-2 border">{transaction.amount}</td>
              <td className="px-4 py-2 border">{transaction.status}</td>
              <td className="px-4 py-2 border">{transaction.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Transaction;
