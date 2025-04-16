import React, { useEffect, useState } from "react";
import {
  createCategory,
  deleteCategory,
  getCategory,
} from "../../../services/manager";
import CategoryLoading from "../components/CategoryLoading";
import { Edit, Trash, Plus, Search, X } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
const Category = () => {
  const [category, setCategory] = useState([]);
  const [isCategoryLoading, setIsCategoryLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 7;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      const response = await getCategory();
      if (response) {
        setCategory(response);
        setIsCategoryLoading(false);
      }
    };
    fetchCategory();
  }, []);

  const filteredCategories = category.filter((cat) =>
    cat.categoryName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredCategories.length / categoriesPerPage);
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * categoriesPerPage,
    currentPage * categoriesPerPage,
  );

  return (
    <main className="flex flex-col gap-12 p-6">
      <section className="text-white text-3xl font-bold">Category</section>

      {isCategoryLoading ? (
        <CategoryLoading />
      ) : (
        <>
          <div className="flex flex-col gap-6">
            {/* SEARCH BAR & CREATE BUTTON*/}
            <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="relative w-full md:w-1/3">
                <Search
                  className="absolute top-2.5 left-3 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search category..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-manager-secondary text-white border border-gray-600 focus:outline-none"
                  value={searchTerm}
                  onChange={(e) => {
                    setCurrentPage(1);
                    setSearchTerm(e.target.value);
                  }}
                />
              </div>
              <button
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow transition"
                onClick={() => setIsModalOpen(true)}
              >
                <Plus size={18} />
                Create
              </button>
            </section>

            {/* CATEGORY TABLE */}
            <section className="overflow-x-auto rounded-2xl border border-gray-700">
              <table className="min-w-full divide-y divide-gray-700 text-white">
                <thead className="bg-manager-secondary">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">
                      No.
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">
                      Parent Category
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-900 divide-y divide-gray-700">
                  {paginatedCategories.map((cat, index) => (
                    <tr
                      key={cat.categoryId}
                      className="hover:bg-gray-800 transition"
                    >
                      <td className="px-6 py-4 text-sm">
                        {(currentPage - 1) * categoriesPerPage + index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm">{cat.categoryName}</td>
                      <td className="px-6 py-4 text-xs">
                        <span className="bg-green-500/10 text-green-500 px-2 py-1 rounded-md font-semibold border border-green-500 shadow-md shadow-green-500/50">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {cat.parentCategoryId || (
                          <span className="italic text-gray-400">None</span>
                        )}
                      </td>
                      <td className="flex gap-3 px-6 py-4 text-sm">
                        <span
                          className="bg-yellow-500/10 p-1 rounded-md cursor-pointer hover:bg-yellow-500/50"
                          onClick={() => alert("Có cái loz API mà edit")}
                        >
                          <Edit className="text-yellow-500" />
                        </span>
                        <span
                          className="bg-red-500/10 p-1 rounded-md cursor-pointer hover:bg-red-500/50"
                          onClick={() => {
                            setShowConfirm(true);
                            setCategoryToDelete(cat);
                          }}
                        >
                          <Trash className="text-red-500" />
                        </span>
                      </td>
                    </tr>
                  ))}
                  {paginatedCategories.length === 0 && (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-4 text-center text-gray-400 italic"
                      >
                        No categories found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </section>

            {/* PAGINATION */}
            <section className="flex justify-center items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="px-3 py-1 rounded-md bg-gray-700 text-white disabled:opacity-30"
              >
                Prev
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === i + 1
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="px-3 py-1 rounded-md bg-gray-700 text-white disabled:opacity-30"
              >
                Next
              </button>
            </section>
          </div>
          {isModalOpen && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-manager-secondary text-white p-6 rounded-2xl shadow-lg border border-gray-700 w-full max-w-md relative">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-white"
                >
                  <X size={20} />
                </button>
                <h2 className="text-xl font-semibold mb-4">
                  Create New Category
                </h2>

                <Formik
                  initialValues={{ categoryName: "" }}
                  validationSchema={Yup.object({
                    categoryName: Yup.string()
                      .min(3, "Must be at least 3 characters")
                      .required("Required"),
                  })}
                  onSubmit={async (values, { resetForm }) => {
                    console.log("Created:", values);
                    const newCategory = await createCategory(
                      values.categoryName,
                    );
                    setCategory((prev) => [newCategory, ...prev]);
                    resetForm();
                    setIsModalOpen(false);
                  }}
                >
                  <Form className="flex flex-col gap-4">
                    <div>
                      <label
                        htmlFor="categoryName"
                        className="block text-sm mb-3"
                      >
                        Category Name
                      </label>
                      <Field
                        name="categoryName"
                        type="text"
                        placeholder="Enter category name"
                        className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                      <ErrorMessage
                        name="categoryName"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white"
                      >
                        Submit
                      </button>
                    </div>
                  </Form>
                </Formik>
              </div>
            </div>
          )}
        </>
      )}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-manager-secondary text-white p-6 rounded-2xl shadow-lg border border-gray-700 w-[90%] max-w-md">
            <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
            <p className="mb-6">
              Are you sure you want to delete{" "}
              <span className="font-bold text-red-400">
                {categoryToDelete?.categoryName}
              </span>
              ?
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600"
                onClick={() => {
                  setShowConfirm(false);
                  setCategoryToDelete(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700"
                onClick={async () => {
                  try {
                    await deleteCategory(categoryToDelete.categoryId);
                    setCategory((prev) =>
                      prev.filter(
                        (cat) => cat.categoryId !== categoryToDelete.categoryId,
                      ),
                    );
                    setShowConfirm(false);
                    setCategoryToDelete(null);
                  } catch (error) {
                    console.error("Failed to delete", error);
                  }
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Category;
