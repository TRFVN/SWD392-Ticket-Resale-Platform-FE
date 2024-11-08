import axios from "axios";
import axiosInstance from "../config/axiosConfig";

export const getAllCategoryApi = async () => {
  try {
    const response = await axiosInstance.get("/Category", {
      params: {
        pageSize: 100,
      },
    });
    if (response.status === 200) {
      return response.data.result;
    } else {
      throw new Error(response.data.message || "Failed to get categories");
    }
  } catch (error) {
    throw new Error(error.message || "Failed to get categories");
  }
};

export const deleteCategoryApi = async (categoryId) => {
  try {
    const response = await axiosInstance.delete(`/Category/${categoryId}`);
    if (response.status === 201) {
      return response;
    } else {
      throw new Error(`Failed to delete category with id ${categoryId}`);
    }
  } catch (error) {
    throw new Error(error.message || "Failed to delete category");
  }
};

export const postCategoryApi = async (categoryName) => {
  // console.log(categoryName);
  try {
    const response = await axiosInstance.post("/Category", {
      categoryName: categoryName,
    });
    if (response.status === 200) {
      return response.data.result;
    } else {
      throw new Error(`Failed to create category with name ${categoryName}`);
    }
  } catch (error) {
    throw new Error(error.message || "Failed to create category");
  }
};
export const putCategoryApi = async (category, categoryId) => {
  // console.log(categoryName);
  try {
    const response = await axiosInstance.post("/Category", {
      categoryId: categoryId,
      categoryName: category.categoryName,
    });
    if (response.status === 200) {
      return response.data.result;
    } else {
      throw new Error(
        `Failed to create category with name ${category.categoryName}`,
      );
    }
  } catch (error) {
    throw new Error(error.message || "Failed to create category");
  }
};
