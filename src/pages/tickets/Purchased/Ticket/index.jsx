import React, { useEffect, useState } from "react";
import { MdOutlineDateRange } from "react-icons/md";
import { getAllTicketsApi } from "../../../../services/ticket";
import Empty from "./Empty";
import ReactPaginate from "react-paginate";

function Ticket({ currentState, handleChangeCurrentState }) {
  const [ticketList, setTicketList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(5);
  const [quantityDisplay, setQuantityDisplay] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const handlePageClick = (e) => {
    setCurrentPage(e.selected + 1);
  };
  useEffect(() => {
    const getAllTickets = async () => {
      try {
        const rs = await getAllTicketsApi(currentPage, quantityDisplay);
        if (rs) {
          setIsLoading(false);
          if (currentState === "All") {
            setTicketList(rs);
          } else {
            let filteredTickets = [];
            if (currentState === "Success") {
              filteredTickets = rs.filter((ticket) => ticket.status === 0);
            } else if (currentState === "Processing") {
              filteredTickets = rs.filter((ticket) => ticket.status === 1);
            } else if (currentState === "Rejected") {
              filteredTickets = rs.filter((ticket) => ticket.status === 2);
            }
            setTicketList(filteredTickets);

            // const totalTickets = ticketList.length;
            // const newTotalPage = Math.ceil(totalTickets / quantityDisplay);
            // setTotalPage(newTotalPage);
            // console.log(totalPage);
          }
        } else {
          console.error("Failed to fetch tickets");
        }
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };

    getAllTickets();
  }, [currentState, currentPage]);

  return (
    <>
      {isLoading ? (
        "Loading"
      ) : (
        <>
          {ticketList && ticketList.length > 0 ? (
            <div className="grid grid-cols-12 gap-5 justify-center items-center w-full">
              {ticketList.map((ticket, index) => {
                return (
                  <div
                    key={index}
                    className="col-span-4 flex flex-col gap-3 justify-start items-center border p-2 w-[350px] h-[300px] rounded-xl cursor-pointer hover:scale-105"
                  >
                    <img
                      src={ticket.ticketImage}
                      alt={ticket.ticketName}
                      className="w-[350px] h-[200px] object-cover rounded-lg"
                    />
                    <div className="flex flex-col justify-center items-center w-full">
                      <div className="font-semibold text-lg">
                        {ticket.ticketName}
                      </div>
                      <div>
                        Cost:{" "}
                        {(ticket.ticketPrice * 10000).toLocaleString("vi-VN")}{" "}
                        &#8363;
                      </div>
                      <div className="flex flex-row gap-2 justify-center items-center">
                        <MdOutlineDateRange />
                        December 10, 2024
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mt-10">
              <Empty />
            </div>
          )}
          <ReactPaginate
            nextLabel=">>"
            onPageChange={(e) => handlePageClick(e)}
            pageRangeDisplayed={5}
            pageCount={totalPage}
            previousLabel="<<"
            pageClassName="page-item"
            pageLinkClassName="page-link p-2 mx-1 border border-gray-300 rounded hover:bg-gray-200"
            previousClassName="page-item"
            previousLinkClassName="page-link p-2 mx-1 border border-gray-300 rounded hover:bg-gray-200"
            nextClassName="page-item"
            nextLinkClassName="page-link p-2 mx-1 border border-gray-300 rounded hover:bg-gray-200"
            breakLabel="..."
            breakClassName="page-item"
            breakLinkClassName="page-link p-2 mx-1 border border-gray-300 rounded hover:bg-gray-200"
            containerClassName="pagination flex justify-center items-center mt-10"
            activeClassName="text-blue-500 italic"
            forcePage={currentPage - 1}
          />
        </>
      )}
    </>
  );
}

export default Ticket;
