import React, { useEffect, useState } from "react";
import { getCustomer } from "../../../../services/manager";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
  Legend,
} from "recharts";
import dayjs from "dayjs";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a4de6c"];

const Customer = () => {
  const [countryData, setCountryData] = useState([]);
  const [genderData, setGenderData] = useState([]);
  const [ageData, setAgeData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customers = await getCustomer();

        const countryCount = customers.reduce((acc, curr) => {
          const country = curr.country || "Unknown";
          acc[country] = (acc[country] || 0) + 1;
          return acc;
        }, {});
        const countryChartData = Object.entries(countryCount).map(
          ([key, value]) => ({
            country: key,
            count: value,
          }),
        );
        setCountryData(countryChartData);

        const genderCount = customers.reduce((acc, curr) => {
          const gender = curr.gender?.toLowerCase() || "unknown";
          acc[gender] = (acc[gender] || 0) + 1;
          return acc;
        }, {});
        const genderChartData = Object.entries(genderCount).map(
          ([key, value]) => ({
            name: key.charAt(0).toUpperCase() + key.slice(1),
            value,
          }),
        );
        setGenderData(genderChartData);

        const currentYear = dayjs().year();
        const ageGroups = customers.reduce((acc, curr) => {
          const birthYear = dayjs(curr.birthDate).year();
          const age = currentYear - birthYear;
          acc[age] = (acc[age] || 0) + 1;
          return acc;
        }, {});
        const ageChartData = Object.entries(ageGroups)
          .map(([age, count]) => ({
            age: +age,
            count,
          }))
          .sort((a, b) => a.age - b.age);
        setAgeData(ageChartData);
      } catch (error) {
        console.error("Lỗi khi lấy customer:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-white">
      <div className="bg-gray-800 p-4 rounded-lg min-w-0">
        <h2 className="text-xl font-semibold mb-4">Customer By Country</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={countryData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
            <XAxis dataKey="country" stroke="#e5e7eb" />
            <YAxis stroke="#e5e7eb" />
            <Bar dataKey="count" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg min-w-0">
        <h2 className="text-xl font-semibold mb-4">Customer By Gender</h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={genderData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {genderData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Legend layout="horizontal" verticalAlign="bottom" align="center" />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg min-w-0">
        <h2 className="text-xl font-semibold mb-4">Customer By Age</h2>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={ageData}>
            <defs>
              <linearGradient id="colorAge" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="age" stroke="#e5e7eb" />
            <YAxis stroke="#e5e7eb" />
            <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#3b82f6"
              fillOpacity={1}
              fill="url(#colorAge)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Customer;
