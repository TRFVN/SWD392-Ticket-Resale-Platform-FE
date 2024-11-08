import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { postCategoryApi } from "../../../services/categoryApi";
import { toast } from "react-toastify";

function AddNew({ handleChangeProgress }) {
  const formik = useFormik({
    initialValues: {
      categoryName: "",
    },
    validationSchema: Yup.object({
      categoryName: Yup.string()
        .min(4, "Category Name must be at least 4 characters")
        .required("Category Name is required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await postCategoryApi(values.categoryName);
        if (response) {
          handleChangeProgress("Get All");
          toast.success("Add new category successfully!");
        } else {
          throw new Error("Failed to add new category. Please try again.");
        }
      } catch (error) {
        console.error("Error occurred:", error);
        toast.error(
          error.message || "Failed to add new category. Please try again.",
        );
      }
    },
  });

  return (
    <div className="flex flex-col justify-start items-start gap-5 w-full p-8">
      <form onSubmit={formik.handleSubmit} className="w-full">
        <div className="flex flex-row justify-start items-center gap-3 w-full">
          <label className="flex flex-row text-lg font-medium">
            Category Name
          </label>
          <input
            type="text"
            id="categoryName"
            name="categoryName"
            className="border rounded-md px-3 py-2 w-1/2"
            value={formik.values.categoryName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.categoryName && formik.errors.categoryName && (
            <div className="text-red-500 text-sm">
              {formik.errors.categoryName}
            </div>
          )}
        </div>
        <div className="flex flex-row justify-center items-center w-full mt-4">
          <button
            type="submit"
            className="flex flex-row justify-center items-center py-2 px-5 rounded-md border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white hover:font-medium"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddNew;
