import React, { useState } from "react";
import Search from "../../../components/common/Search";
import { Filter } from "lucide-react";
import { IoTimeOutline } from "react-icons/io5";
import { CiLocationOn } from "react-icons/ci";
import { PiCurrencyDollarLight } from "react-icons/pi";
import { CheckCheck } from "lucide-react";
function Approved({ ticketList }) {
  const [isLoading, setIsLoading] = useState(true);

  const handleFilter = (tickets) => {
    return tickets.filter((ticket) => ticket.status === 1);
  };
  const approvedTicketList = handleFilter(ticketList);
  console.log(ticketList);
  const formatDate = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  return (
    <div className="flex flex-col justify-center items-center w-full py-8 gap-8">
      <div className="flex flex-row justify-center items-center w-2/3 gap-10">
        <div className="w-full">
          <Search />
        </div>
        <div className="flex flex-row gap-2 border p-3 rounded-md cursor-pointer hover:bg-orange-300">
          <Filter />
          Filters
        </div>
      </div>

      {approvedTicketList && approvedTicketList.length > 0 ? (
        <div className="grid grid-cols-12 flex-row justify-start items-start gap-5 w-full px-8">
          {approvedTicketList.map((ticket, index) => {
            return (
              <div
                key={index}
                className="col-span-3 flex flex-col justify-between items-center border rounded-lg w-full cursor-pointer hover:scale-[103%]"
              >
                <img
                  src={ticket.ticketImage}
                  alt={ticket.ticketName}
                  className="rounded-lg h-[300px]"
                />
                <div className="flex flex-col text-justify items-start gap-2 w-full p-3">
                  <div className="font-medium">{ticket.ticketName}</div>
                  <div className="inline-flex items-center w-full text-sm">
                    <IoTimeOutline className="mr-1" />
                    {formatDate(ticket.eventDate)}
                  </div>
                  <div className="inline-flex items-center w-full text-sm">
                    <CiLocationOn className="mr-1 text-2xl" />
                    {ticket.address || "23/10 Hoang Dieu 2"},{" "}
                    {ticket.district || "Thu Duc"},{" "}
                    {ticket.city || "Ho Chi Minh"}{" "}
                  </div>
                  <div className="inline-flex items-center w-full text-sm">
                    <PiCurrencyDollarLight className="mr-1" />
                    {ticket.ticketPrice.toLocaleString("vi-VN")} &#8363;
                  </div>
                  <div></div>
                  <div></div>
                </div>
                <div className="flex flex-row justify-between items-center w-full border-t-[1px] p-4">
                  <div className="flex flex-col justify-start items-start ">
                    <span className="text-xs">Serial No. </span>
                    <span className="text-sm">{ticket.serialNumber}</span>
                  </div>
                  <div className="flex flex-row justify-center items-start gap-2 py-2 px-5 text-green-500 ">
                    <CheckCheck /> Approved
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className=" text-center my-5 font-medium italic">
          There is no ticket available
        </div>
      )}
    </div>
  );
}

export default Approved;
