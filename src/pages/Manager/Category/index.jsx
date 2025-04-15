import React, { useEffect, useState } from "react";
import { createCategory, getCategory } from "../../../services/manager";
import TableSkeletonLoading from "../components/TableSkeletonLoading";
import { Edit, Trash, Plus, Search, X } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
const Category = () => {
  const [category, setCategory] = useState([]);
  const [isLoadingCategory, setIsLoadingCategory] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 5;
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    const fetchCategory = async () => {
      const response = await getCategory();
      if (response) {
        setCategory(response);
        setIsLoadingCategory(false);
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

  const handleCreateCategory = async (categoryName) => {
    const res = await createCategory(categoryName);
    try {
      if (res.statusCode == 200) {
        toast.success("Create category successfully");
      }
      return;
    } catch (error) {
      toast.error("Create category failed");
      console.log(error.message || "Create category failed");
    }
    return;
  };
  return (
    <main className="flex flex-col gap-12 p-6">
      <section className="text-white text-3xl font-bold">Category</section>

      {isLoadingCategory ? (
        <TableSkeletonLoading />
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
                        <span className="bg-yellow-500/10 p-1 rounded-md cursor-pointer hover:bg-yellow-500/50">
                          <Edit className="text-yellow-500" />
                        </span>
                        <span className="bg-red-500/10 p-1 rounded-md cursor-pointer hover:bg-red-500/50">
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
                  onSubmit={(values, { resetForm }) => {
                    console.log("Created:", values);
                    handleCreateCategory(values);
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
    </main>
  );
};

export default Category;
