import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TicketHeader from "../../components/ticket/ticketdetails/TicketHeader";
import TicketInfo from "../../components/ticket/ticketdetails/TicketInfo";
import MainContent from "../../components/ticket/ticketdetails/MainContent";
import Sidebar from "../../components/ticket/ticketdetails/Sidebar";
import { motion } from "framer-motion";
import { formatDate } from "../../utils/dateUtils";
const TicketDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLiked, setIsLiked] = useState(false);
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    if (!location.state?.ticket) {
      navigate("/");
    } else {
      setTicket(location.state.ticket);
    }
  }, [location.state, navigate]);

  if (!ticket) {
    return null;
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: ticket.ticketName,
        text: ticket.ticketDescription,
        url: window.location.href,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
    >
      <TicketHeader
        ticket={ticket}
        isLiked={isLiked}
        onLikeToggle={() => setIsLiked(!isLiked)}
        onShare={handleShare}
        onBack={() => navigate(-1)}
      />
      <TicketInfo ticket={ticket} formatDate={formatDate} />

      <div className="max-w-[1920px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <MainContent ticket={ticket} />
          <Sidebar
            ticket={ticket}
            onChat={() => navigate(`/chat/${ticket.userId}`)}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default TicketDetails;
