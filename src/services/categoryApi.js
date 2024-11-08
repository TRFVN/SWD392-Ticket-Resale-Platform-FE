import axiosInstance from "../config/axiosConfig";

export const getAllCategoryApi = async () => {
  try {
    const response = await axiosInstance.get("/Category");
    if (response.status === 200) {
      return response.data.result;
    } else {
      throw new Error(response.data.message || "Failed to get categories");
    }
  } catch (error) {
    throw new Error(error.message || "Failed to get categories");
  }
};
