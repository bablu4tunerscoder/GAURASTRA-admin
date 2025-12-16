import { useState } from "react";
import {
  useDeleteSubcategoryMutation,
  useGetCategoriesQuery,
  useGetSubcategoriesQuery,
} from "../Redux/Slices/categorySlice";

import AddSubCategory from "./AddSubCategory";
import EditSubCategory from "./EditSubCategory";

const SubCategoryList = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  /* ======================
     RTK QUERY
  ====================== */

  const {
    data: categories = [],
    isLoading: isCategoryLoading,
  } = useGetCategoriesQuery();

  const {
    data: subcategories = [],
    isLoading: isSubcategoryLoading,
    isError,
  } = useGetSubcategoriesQuery(selectedCategoryId, {
    skip: !selectedCategoryId,
  });

  const [deleteSubcategory] = useDeleteSubcategoryMutation();

  /* ======================
     HELPERS
  ====================== */

  const selectedCategoryName =
    categories.find((cat) => cat.category_id === selectedCategoryId)
      ?.category_name || "";

  const showGenderColumn = selectedCategoryName === "Ethnic Wear";

  /* ======================
     HANDLERS
  ====================== */

  const handleEdit = (subCategory) => {
    setSelectedSubCategory(subCategory);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this subcategory?")) {
      try {
        await deleteSubcategory(id).unwrap();
      } catch (err) {
        console.error("Delete failed", err);
      }
    }
  };

  /* ======================
     RENDER
  ====================== */

  return (
    <div className="w-full">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">All Sub Categories</h1>
          <button
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
            onClick={() => setIsModalOpen(true)}
          >
            Create New
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <select
            className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
          >
            <option value="">Select a Category</option>
            {categories.map((category) => (
              <option key={category.category_id} value={category.category_id}>
                {category.category_name}
              </option>
            ))}
          </select>
        </div>

        {isCategoryLoading ? (
          <p className="text-gray-600">Loading categories...</p>
        ) : !selectedCategoryId ? (
          <p className="text-gray-600 italic">Please select a category to view subcategories.</p>
        ) : isSubcategoryLoading ? (
          <p className="text-gray-600">Loading subcategories...</p>
        ) : isError ? (
          <p className="text-red-600 font-medium">Failed to load subcategories</p>
        ) : subcategories.length === 0 ? (
          <p className="text-gray-600 italic">No Sub Categories Found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full   rounded-lg overflow-hidden">
              <thead className="bg-gray-600 text-left">
                <tr>
                  <th className="px-4 py-3 text-white font-medium text-gray-700">S.No</th>
                  <th className="px-4 py-3 text-white font-medium text-gray-700">Name</th>
                  <th className="px-4 py-3 text-white font-medium text-gray-700">Description</th>
                  {showGenderColumn && (
                    <th className="px-4 py-3 text-white font-medium text-gray-700">Gender</th>
                  )}
                  <th className="px-4 py-3 text-white font-medium text-gray-700 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {subcategories.map((subCategory, index) => (
                  <tr
                    key={subCategory.Subcategory_id}
                    className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">{subCategory.Subcategory_name}</td>
                    <td className="px-4 py-3">{subCategory.Subcategory_description}</td>
                    {showGenderColumn && <td className="px-4 py-3">{subCategory.gender || "N/A"}</td>}
                    <td className="px-4 py-3  flex justify-center gap-2">
                      <button
                        className="px-3 py-1 bg-blue-500 text-white border border-blue-500 rounded hover:bg-blue-600 hover:border-blue-600 text-sm"
                        onClick={() => handleEdit(subCategory)}
                      >
                        Edit
                      </button>
                      <button
                        className="px-3 py-1 bg-red-500 text-white border border-red-500 rounded hover:bg-red-600 hover:border-red-600 text-sm"
                        onClick={() => handleDelete(subCategory.Subcategory_id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {isModalOpen && <AddSubCategory onClose={() => setIsModalOpen(false)} />}
        {isEditModalOpen && <EditSubCategory onClose={() => setIsEditModalOpen(false)} subCategory={selectedSubCategory} />}
      </div>
    </div>
  );
};

export default SubCategoryList;
