import React from "react";

const TicketLoading = () => {
  const rows = Array.from({ length: 7 });

  return (
    <section className="overflow-x-auto rounded-2xl border border-gray-700">
      <table className="min-w-full divide-y divide-gray-700 text-white">
        <thead className="bg-manager-secondary overflow-y-hidden">
          <tr>
            {[
              "No.",
              "Name",
              "Rank",
              "Cost",
              "Total Quantity",
              "Available Quantity",
              "Event",
            ].map((heading, index) => (
              <th
                key={index}
                className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-gray-900 divide-y divide-gray-700">
          {rows.map((_, i) => (
            <tr key={i} className="animate-pulse">
              <td className="px-6 py-4">
                <div className="h-4 w-6 bg-gray-700 rounded" />
              </td>
              <td className="px-6 py-4">
                <div className="h-4 w-32 bg-gray-700 rounded" />
              </td>
              <td className="px-6 py-4">
                <div className="h-4 w-20 bg-gray-700 rounded" />
              </td>
              <td className="px-6 py-4">
                <div className="h-4 w-16 bg-gray-700 rounded" />
              </td>
              <td className="px-6 py-4">
                <div className="h-4 w-20 bg-gray-700 rounded" />
              </td>
              <td className="px-6 py-4">
                <div className="h-4 w-24 bg-gray-700 rounded" />
              </td>
              <td className="px-6 py-4">
                <div className="h-4 w-40 bg-gray-700 rounded" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default TicketLoading;
