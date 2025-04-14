import React, { useEffect, useState } from "react";
import { DollarSign, ReceiptText, CalendarCheck2, Ticket } from "lucide-react";
import Card from "./components/Card";
import { getEvent, getRevenue, getTicket } from "../../../services/manager";
import RevenueChart from "./components/RevenueChart";
import Organizer from "./Organizer";
import Customer from "./Customer";
const top_row = [
  {
    id: 1,
    title: "Total Revenue",
    icon: <DollarSign className="w-6 h-6 text-green-400" />,
    data_number: 1000000,
    change: "+10%",
  },
  {
    id: 2,
    title: "Total Transactions",
    icon: <ReceiptText className="w-6 h-6 text-blue-400" />,
    data_number: 1000,
    change: "+15%",
  },
  {
    id: 3,
    title: "Total Events",
    icon: <CalendarCheck2 className="w-6 h-6 text-purple-400" />,
    data_number: 10,
    change: "+5%",
  },
  {
    id: 4,
    title: "Total Tickets",
    icon: <Ticket className="w-6 h-6 text-yellow-400" />,
    data_number: 1000,
    change: "+10%",
  },
];

const Dashboard = () => {
  const [revenue, setRevenue] = useState({
    title: "Total Revenue",
    icon: <DollarSign className="w-6 h-6 text-green-400" />,
    total: 0,
    change: "+10%",
  });
  const [transaction, setTransaction] = useState({
    title: "Total Transaction",
    icon: <ReceiptText className="w-6 h-6 text-blue-400" />,
    total: 0,
    change: "+15%",
  });
  const [event, setEvent] = useState({
    title: "Total Events",
    icon: <CalendarCheck2 className="w-6 h-6 text-purple-400" />,
    total: 0,
    change: "+5%",
  });
  const [ticket, setTicket] = useState({
    title: "Total Tickets",
    icon: <Ticket className="w-6 h-6 text-yellow-400" />,
    total: 0,
    change: "+10%",
  });
  const [transactionData, setTransactionData] = useState([]);
  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const revenueRes = await getRevenue();

        setRevenue((prev) => ({
          ...prev,
          total: revenueRes.totalProfit,
        }));

        setTransaction((prev) => ({
          ...prev,
          total: revenueRes.transactions.length,
        }));
        setTransactionData(revenueRes.transactions);
      } catch (error) {
        console.error("Lỗi khi fetch revenue:", error);
      }
    };
    const fetchEvent = async () => {
      try {
        const eventRes = await getEvent();
        setEvent((prev) => ({
          ...prev,
          total: eventRes.length,
        }));
      } catch (error) {
        console.error("Lỗi khi lấy event", error);
      }
    };
    const fetchTicket = async () => {
      try {
        const ticketRes = await getTicket();
        setTicket((prev) => ({
          ...prev,
          total: ticketRes.totalItems,
        }));
      } catch (error) {
        console.error("Lỗi khi lấy event", error);
      }
    };
    fetchRevenue();
    fetchEvent();
    fetchTicket();
  }, []);
  return (
    <main className="flex flex-col gap-12 p-4">
      <section className="text-white text-2xl font-bold">Dashboard</section>
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card data={revenue} />
          <Card data={transaction} />
          <Card data={event} />
          <Card data={ticket} />
        </div>
      </section>
      <section>
        <RevenueChart transactions={transactionData} />
      </section>
      <section>
        <Organizer />
      </section>
      <section>
        <Customer />
      </section>
    </main>
  );
};

export default Dashboard;
