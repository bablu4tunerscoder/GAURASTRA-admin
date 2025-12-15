import React, { useState } from "react";
import AddCategory from "./AddCategory";
import EditCategory from "./EditCategory";
import { useDeleteCategoryMutation, useGetCategoriesQuery } from "../Redux/Slices/categorySlice";

const CategoryList = () => {
  // 🔹 RTK Query hooks
  const {
    data: categories = [],
    isLoading,
    isError,
  } = useGetCategoriesQuery();

  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();

  // 🔹 Local UI state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // 🔹 Edit handler
  const handleEdit = (category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  // 🔹 Delete handler
  const handleDelete = async (id) => {
    try {
      await deleteCategory(id).unwrap();
    } catch (err) {
      console.error("Failed to delete category", err);
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">All Categories</h1>
          <button
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
            onClick={() => setIsModalOpen(true)}
          >
            Create Category
          </button>
        </div>

        {isLoading ? (
          <p className="text-gray-600">Loading categories...</p>
        ) : isError ? (
          <p className="text-red-600 font-medium">Something went wrong</p>
        ) : categories.length === 0 ? (
          <p className="text-gray-600 italic">No Categories Found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full rounded-lg overflow-hidden">
              <thead className="bg-gray-600">
                <tr>
                  <th className="px-4 py-3 text-white font-medium text-left">S.No</th>
                  <th className="px-4 py-3 text-white font-medium text-left">Name</th>
                  <th className="px-4 py-3 text-white font-medium text-left">Description</th>
                  <th className="px-4 py-3 text-white font-medium text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {categories.map((category, index) => (
                  <tr
                    key={category.category_id}
                    className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3 capitalize">
                      {category.category_name}
                    </td>
                    <td className="px-4 py-3">
                      {category.category_description}
                    </td>
                    <td className="px-4 py-3 flex justify-center gap-2">
                      <button
                        className="px-3 py-1 bg-blue-500 text-white border border-blue-500 rounded hover:bg-blue-600 hover:border-blue-600 text-sm"
                        onClick={() => handleEdit(category)}
                      >
                        Edit
                      </button>
                      <button
                        disabled={isDeleting}
                        className="px-3 py-1 bg-red-500 text-white border border-red-500 rounded hover:bg-red-600 hover:border-red-600 text-sm disabled:opacity-50"
                        onClick={() => handleDelete(category.category_id)}
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && <AddCategory onClose={() => setIsModalOpen(false)} />}
      {isEditModalOpen && (
        <EditCategory
          onClose={() => setIsEditModalOpen(false)}
          category={selectedCategory}
        />
      )}
    </div>

  );
};

export default CategoryList;
