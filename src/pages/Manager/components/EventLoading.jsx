import React from "react";

const EventLoading = () => {
  const rows = Array.from({ length: 7 });

  return (
    <section className="overflow-x-auto rounded-2xl border border-gray-700">
      <table className="min-w-full divide-y divide-gray-700 text-white">
        <thead className="bg-manager-secondary">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">
              No.
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">
              Image
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">
              Time
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">
              Location
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-900 divide-y divide-gray-700">
          {rows.map((_, i) => (
            <tr key={i} className="animate-pulse">
              <td className="px-6 py-4">
                <div className="h-4 w-6 bg-gray-700 rounded"></div>
              </td>
              <td className="px-6 py-4">
                <div className="w-16 h-16 bg-gray-700 rounded object-cover" />
              </td>
              <td className="px-6 py-4">
                <div className="h-4 w-32 bg-gray-700 rounded"></div>
              </td>
              <td className="px-6 py-4">
                <div className="h-4 w-24 bg-gray-700 rounded"></div>
              </td>
              <td className="px-6 py-4">
                <div className="h-4 w-16 bg-gray-700 rounded"></div>
              </td>
              <td className="px-6 py-4">
                <div className="h-4 w-40 bg-gray-700 rounded"></div>
              </td>
              <td className="px-6 py-4">
                <div className="h-6 w-24 bg-gray-700 rounded-full"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default EventLoading;
