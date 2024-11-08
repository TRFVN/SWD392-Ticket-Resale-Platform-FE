import React, { useEffect, useState } from "react";
import { Pencil, Trash, OctagonAlert } from "lucide-react";
import { deleteEventApi, getAllEventApi } from "../../../services/eventApi";
import { useFormik } from "formik";
import * as Yup from "yup";
import DeleteCategory from "./DeleteCategory";
import { toast } from "react-toastify";
import Loader from "../../../components/common/Loader";
import {
  deleteCategoryApi,
  getAllCategoryApi,
} from "../../../services/categoryApi";
function GetAll({ handleSetCurrentCategory, handleChangeProgress }) {
  const [categoryList, setCategoryList] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const getCategorys = async () => {
    const response = await getAllCategoryApi();
    if (response) {
      setIsLoading(false);
      setCategoryList(response);
    }
  };
  useEffect(() => {
    getCategorys();
  }, []);

  const handleOpenDeleteModal = (category) => {
    setCurrentCategory(category);
    setShowDeleteModal(true);
  };
  const hanldeCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const hanldeConfirmDeleteModal = () => {
    const deleteCategory = async () => {
      const response = await deleteCategoryApi(currentCategory.categoryId);
      if (response) {
        toast.success("Delete category successfully");
        getCategorys();
      } else {
        toast.error("Failed to delete category. Please try again");
      }
    };
    deleteCategory();
    setShowDeleteModal(false);
  };
  // console.log(eventList);

  const formatDate = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };
  return (
    <>
      {isLoading ? (
        <div className="flex flex-row justify-center items-start w-full">
          <Loader />
        </div>
      ) : (
        <div className="relative overflow-x-auto sm:rounded-lg w-full">
          <table className="w-full text-sm text-left text-gray-500 ">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
              <tr>
                <th scope="col" className="px-6 py-3">
                  No.
                </th>
                <th scope="col" className="px-6 py-3">
                  Event name
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {categoryList.map((category, index) => (
                <tr key={index} className={`border-t`}>
                  <td className="px-6 py-4">{index + 1}</td>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {category.categoryName}
                  </th>
                  <td className="px-6 py-4 flex flex-row justify-start items-center gap-2">
                    {category.status === 0 ? (
                      <>
                        <span
                          className="cursor-pointer w-7 h-7 flex items-center justify-center rounded-full border border-green-500 p-2 text-green-500 text-xs hover:bg-green-500 hover:text-white"
                          onClick={() => {
                            handleSetCurrentCategory(category);
                            handleChangeProgress("Update Category");
                          }}
                        >
                          <Pencil />
                        </span>
                        <span
                          className="cursor-pointer w-7 h-7 flex items-center justify-center rounded-full border border-red-500 p-2 text-red-500 text-xs hover:bg-red-500 hover:text-white"
                          onClick={() => handleOpenDeleteModal(category)}
                        >
                          <Trash />
                        </span>
                      </>
                    ) : (
                      <div>
                        <OctagonAlert
                          className="text-yellow-500 cursor-pointer "
                          onClick={() =>
                            toast.warning("This category was deleted")
                          }
                        />
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {showDeleteModal && (
            <DeleteCategory
              currentCategory={currentCategory}
              showDeleteModal={showDeleteModal}
              hanldeCloseDeleteModal={hanldeCloseDeleteModal}
              hanldeConfirmDeleteModal={hanldeConfirmDeleteModal}
            />
          )}
        </div>
      )}
    </>
  );
}

export default GetAll;
