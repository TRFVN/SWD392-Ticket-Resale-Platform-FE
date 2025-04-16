import { toast } from "react-toastify";
import axiosInstance from "../config/axiosConfig";
import axios from "axios";

export const getRevenue = async () => {
  try {
    const startDate = "01/01/2000";

    const today = new Date();
    const endDate = today.toLocaleDateString("en-US");

    const response = await axiosInstance.get(`/api/revenue/profit`, {
      params: {
        startDate,
        endDate,
        // pageNumber: 1,
        // pageSize: 10,
      },
    });

    return response.data.result;
  } catch (error) {
    console.log(error.message || "Lỗi khi lấy revenue");
    throw new Error(error.message || "Lỗi khi lấy revenue");
  }
};
export const getRevenuePagination = async (pageNumber, pageSize) => {
  try {
    const startDate = "01/01/2000";

    const today = new Date();
    const endDate = today.toLocaleDateString("en-US");

    const response = await axiosInstance.get(`/api/revenue/profit`, {
      params: {
        startDate,
        endDate,
        pageNumber,
        pageSize,
      },
    });

    return response.data.result;
  } catch (error) {
    console.log(error.message || "Lỗi khi lấy revenue");
    throw new Error(error.message || "Lỗi khi lấy revenue");
  }
};
export const createCategory = async (categoryName) => {
  try {
    const response = await axiosInstance.post("/api/Category", {
      categoryName: categoryName,
      parentCategoryId: null,
    });
    if (response.data.result) toast.success("Create category successfully");
    return response.data.result;
  } catch (error) {
    toast.error("Create category failed");
    console.log(error.message || "Lỗi khi tạo category");
    throw new Error(error.message || "Lỗi khi tạo vé");
  }
};
export const getCategory = async () => {
  try {
    const response = await axiosInstance.get(`/api/Category`, {
      params: {
        pageNumber: 1,
        pageSize: 1000,
      },
    });
    return response.data.result;
  } catch (error) {
    toast.error("Cannot Fetch Category");
    console.log(error.message || "Lỗi khi lấy category");
    throw new Error(error.message || "Lỗi khi lấy category");
  }
};
export const modifyCategory = async (categoryId, categoryName) => {
  try {
    const response = await axiosInstance.put("/api/Category", {
      categoryId: categoryId,
      categoryName: categoryName,
      parentCategoryId: null,
    });
    if (response.data.result) toast.success("Modify Category Successfully");

    return response.data.result;
  } catch (error) {
    console.log(error.message || "Lỗi khi chỉnh sửa category");
    throw new Error(error.message || "Lỗi khi chỉnh sửa category");
  }
};

export const deleteCategory = async (categoryId) => {
  try {
    const response = await axiosInstance.delete(`/api/Category/${categoryId}`);
    if (response.data.result) toast.success("Delete Category Successfully");
    return response.data.result;
  } catch (error) {
    toast.error("Delete category failed");
    console.log(error.message || "Lỗi khi xóa category");
    throw new Error(error.message || "Lỗi khi xóa category");
  }
};
export const getEvent = async () => {
  try {
    const response = await axiosInstance.get(`/api/Event`, {
      params: {
        pageNumber: 1,
        pageSize: 1000,
      },
    });
    return response.data.result;
  } catch (error) {
    toast.error("Cannot Fetch Event");
    console.log(error.message || "Lỗi khi lấy event");
    throw new Error(error.message || "Lỗi khi lấy event");
  }
};

export const getTicket = async () => {
  try {
    const response = await axiosInstance.get(`/api/tickets/templates`, {
      params: {
        pageNumber: 1,
        pageSize: 1000,
      },
    });

    return response.data.result;
  } catch (error) {
    console.log(error.message || "Lỗi khi lấy ticket");
    throw new Error(error.message || "Lỗi khi lấy ticket");
  }
};
export const getTicketByEventId = async (eventId) => {
  try {
    const response = await axiosInstance.get(`/api/tickets/event/${eventId}`);

    return response.data.result;
  } catch (error) {
    toast.error("Fetch Ticket Failed");
    console.log(error.message || "Lỗi khi lấy ticket by eventId");
    throw new Error(error.message || "Lỗi khi ticket by eventId");
  }
};
export const getOrganizer = async () => {
  try {
    const response = await axiosInstance.get(`/api/revenue/organizer`);
    console.log(response.data.result);

    return response.data.result;
  } catch (error) {
    console.log(error.message || "Lỗi khi lấy organizer");
    throw new Error(error.message || "Lỗi khi lấy organizer");
  }
};

export const getCustomer = async () => {
  try {
    const response = await axiosInstance.get(`/api/revenue/customer`);
    return response.data.result.customers;
  } catch (error) {
    console.log(error.message || "Lỗi khi lấy customer");
    throw new Error(error.message || "Lỗi khi lấy customer");
  }
};

export const createOrganizationAccount = async (data) => {
  try {
    const response = await axiosInstance.post("/sign-up-organization", data);
    if (response.data.result) toast.success("Create Organiztion Account");
    return response.data.result;
  } catch (error) {
    toast.error("Create Organization Account Failed");
    console.log(error.message || "Create Organization Account Failed");
    throw new Error(error.message || "Create Organization Account Failed");
  }
};
