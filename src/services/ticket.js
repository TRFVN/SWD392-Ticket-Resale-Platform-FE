import axiosInstance from "../config/axiosConfig";

export const getTickets = async () => {
  const rs = await axiosInstance.get("/Tickets");
  console.log(rs);
};
