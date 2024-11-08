import React from "react";
import { ChartColumnBig } from "lucide-react";
import { transactionData } from "./Data";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
function StaticManagement() {
  return (
    <div className="flex flex-col justify-start items-start gap-8 w-full p-8 min-h-screen">
      <div className="flex flex-row justify-start items-center gap-3 ">
        <ChartColumnBig />
        <span className="text-2xl font-semibold">Static Mangement</span>
      </div>
      <div className="flex flex-col justify-start items-start w-full gap-8 border rounded-md bg-white p-8">
        <div className="text-xl font-semibold">Transactions in 2023</div>
        <BarChart
          width={1450}
          height={600}
          data={transactionData}
          className="w-full"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis tickCount={10} domain={[0, "dataMax + 100"]} />
          <Tooltip />
          <Legend />
          <Bar dataKey="failedTransactions" fill="#F2D388" />
          <Bar dataKey="successfulTransactions" fill="#A7D676" />
          <Bar dataKey="totalTransactions" fill="#6AB7D6" />
        </BarChart>
      </div>
    </div>
  );
}

export default StaticManagement;
