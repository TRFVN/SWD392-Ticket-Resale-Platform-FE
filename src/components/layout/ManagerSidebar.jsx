import React from "react";
import Logo from "../../assets/TicketHub_Logo.png";
import {
  Menu,
  LayoutDashboard,
  ChartBarStacked,
  CalendarDays,
  Ticket,
  User,
  MessageSquare,
  Bell,
  FileWarning,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const Main_Items = [
  {
    id: 1,
    name: "Dashboard",
    icon: <LayoutDashboard />,
  },
  {
    id: 2,
    name: "Category",
    icon: <ChartBarStacked />,
  },
  {
    id: 3,
    name: "Event",
    icon: <CalendarDays />,
  },
  {
    id: 4,
    name: "Ticket",
    icon: <Ticket />,
  },
];

const Other_Items = [
  {
    id: 1,
    name: "Account",
    icon: <User />,
  },
  {
    id: 2,
    name: "Message",
    icon: <MessageSquare />,
  },
  {
    id: 3,
    name: "Reports",
    icon: <FileWarning />,
  },
  {
    id: 4,
    name: "Setting",
    icon: <Settings />,
  },
];
const ManagerSidebar = ({ isCollapsed }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    toast.success("Logout successfully");
    navigate("/login");
  };
  return (
    <main
      className={`px-3 py-4 h-screen bg-manager-secondary shadow-md transition-all duration-300 flex flex-col ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* LOGO*/}

      <Link to="/manager" className="flex items-center gap-2 mb-6">
        <img
          src={Logo}
          alt="TicketHub Logo"
          className="size-10 object-contain"
        />
        {!isCollapsed && (
          <p className="text-2xl font-bold text-primary-light">TICKET HUB</p>
        )}
      </Link>

      {/* MAIN ITEMS */}
      <section className="flex flex-col space-y-4 flex-grow">
        {Main_Items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 text-manager-third hover:bg-gray-400 px-3 py-2 rounded-lg cursor-pointer transition-all"
          >
            {item.icon}
            {!isCollapsed && <p className="text-lg">{item.name}</p>}
          </div>
        ))}

        {/* DIVIDER */}
        <div className="border-t border-gray-600 my-2" />

        {/* OTHERS LABEL */}
        {!isCollapsed && (
          <p className="text-sm text-gray-500 uppercase mb-2">Others</p>
        )}

        {/* OTHER ITEMS */}
        {Other_Items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 text-manager-third hover:bg-gray-400 px-3 py-2 rounded-lg cursor-pointer transition-all"
          >
            {item.icon}
            {!isCollapsed && <p className="text-lg">{item.name}</p>}
          </div>
        ))}
      </section>

      <div className="border-t border-gray-600 my-2" />

      {/* LOGOUT*/}
      <section className="mt-auto">
        <div
          className="flex gap-2 text-lg text-manager-third cursor-pointer hover:bg-gray-400 px-3 py-2 rounded-lg"
          onClick={handleLogout}
        >
          <LogOut /> <p>Log Out</p>
        </div>
      </section>
    </main>
  );
};

export default ManagerSidebar;
