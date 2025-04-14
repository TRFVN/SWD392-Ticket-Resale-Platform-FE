import React, { useEffect, useState } from "react";
import { getOrganizer } from "../../../../services/manager";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const Organizer = () => {
  const [customers, setCustomers] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getOrganizer();
      setCustomers(data.customers);
      generateChartData(data.customers);
    };

    fetchData();
  }, []);

  const generateChartData = (customers) => {
    const countryCount = customers.reduce((acc, customer) => {
      const { country, organizationName } = customer;
      if (!acc[country]) acc[country] = 0;
      acc[country] += 1;
      return acc;
    }, {});

    const chartData = Object.keys(countryCount).map((country) => ({
      country,
      count: countryCount[country],
      color: getRandomColor(),
    }));

    setChartData(chartData);
  };

  return (
    <div className="rounded-xl shadow-md text-white">
      <div className="flex gap-8">
        <div className=" w-3/4 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Organizer Overview</h2>
          <table className="min-w-full table-auto bg-gray-700 rounded-lg">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="px-4 py-2 text-left">Phone Number</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Organization</th>
                <th className="px-4 py-2 text-left">Country</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer, index) => (
                <tr key={index} className="border-b border-gray-600">
                  <td className="px-4 py-2">{customer.phoneNumber}</td>
                  <td className="px-4 py-2">{customer.email}</td>
                  <td className="px-4 py-2">{customer.organizationName}</td>
                  <td className="px-4 py-2">{customer.country}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="w-1/4 bg-gray-800 p-4 rounded-lg">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
              <XAxis dataKey="country" stroke="#e5e7eb" />
              <YAxis stroke="#e5e7eb" />
              {/* <Tooltip
                contentStyle={{ backgroundColor: "#1f2937", border: "none" }}
                labelStyle={{ color: "#fff" }}
                itemStyle={{ color: "#fff" }}
                formatter={(value) => `${value} organizations`}
              /> */}
              <Bar dataKey="count">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Organizer;
