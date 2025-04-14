import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./datepicker-custom.css";
import { toast } from "react-toastify";

const RevenueChart = ({ transactions }) => {
  const [startDate, setStartDate] = useState(new Date("2025-03-01"));
  const [endDate, setEndDate] = useState(new Date());
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const filtered = transactions.filter((t) => {
      const date = new Date(t.transactionDateTime);
      return date >= startDate && date <= endDate;
    });

    const grouped = {};
    filtered.forEach((t) => {
      const dateKey = new Date(t.transactionDateTime).toLocaleDateString(
        "en-CA",
      );
      grouped[dateKey] = (grouped[dateKey] || 0) + t.amount;
    });

    const sortedData = Object.keys(grouped)
      .sort()
      .map((date) => ({
        date,
        revenue: grouped[date],
      }));

    setChartData(sortedData);
  }, [transactions, startDate, endDate]);

  return (
    <div className="p-6 rounded-xl shadow-md bg-manager-secondary text-white">
      <h2 className="text-xl font-semibold mb-4">Revenue Overview</h2>

      <div className="flex gap-4 mb-6 items-end">
        <div>
          <p className="mb-1">Start Date</p>
          <DatePicker
            selected={startDate}
            onChange={(date) => {
              if (date > endDate) {
                toast.warn("Start date must be less than end date");
                return;
              }
              setStartDate(date);
            }}
            className="border border-gray-800 px-2 py-1 rounded bg-gray-700 cursor-pointer outline-none "
          />
        </div>
        <div>
          <p className="mb-1">End Date</p>

          <DatePicker
            selected={endDate}
            onChange={(date) => {
              if (date < startDate) {
                toast.warn("The end date must be greater than the start date");
                return;
              }
              setEndDate(date);
            }}
            className="border border-gray-800 px-2 py-1 rounded bg-gray-700 cursor-pointer outline-none "
          />
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
          <XAxis
            dataKey="date"
            stroke="#e5e7eb"
            tickFormatter={(date) =>
              new Date(date).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
              })
            }
          />
          <YAxis
            stroke="#e5e7eb"
            tickFormatter={(value) => `${value / 1000} `}
          />
          <Tooltip
            contentStyle={{ backgroundColor: "#1f2937", border: "none" }}
            labelStyle={{ color: "#fff" }}
            itemStyle={{ color: "#fff" }}
            formatter={(value) => `${value.toLocaleString()} đ`}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#803300"
            fill="#ff6600"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
