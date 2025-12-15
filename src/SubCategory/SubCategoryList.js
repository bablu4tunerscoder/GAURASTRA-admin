import React, { useState } from "react";
import {
  useGetCategoriesQuery,
  useGetSubcategoriesQuery,
  useDeleteSubcategoryMutation,
} from "../Redux/Slices/categorySlice";

import "./SubCategoryList.scss";
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
    <div className="layout">
      <div className="subcategory-container">
        <h1 className="subcategory-title">All Sub Categories</h1>

        <div className="subcategory-actions">
          <div className="subcategory-select">
            <select
              className="subcategory-dropdown"
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
            >
              <option value="">Select a Category</option>
              {categories.map((category) => (
                <option
                  key={category.category_id}
                  value={category.category_id}
                >
                  {category.category_name}
                </option>
              ))}
            </select>
          </div>

          <div className="subcategory-button">
            <button
              className="create-btn"
              onClick={() => setIsModalOpen(true)}
            >
              Create New
            </button>
          </div>
        </div>

        {/* CONTENT */}
        {isCategoryLoading ? (
          <p>Loading categories...</p>
        ) : !selectedCategoryId ? (
          <p className="info-message">
            Please select a category to view subcategories.
          </p>
        ) : isSubcategoryLoading ? (
          <p>Loading subcategories...</p>
        ) : isError ? (
          <p className="error-message">Failed to load subcategories</p>
        ) : subcategories.length === 0 ? (
          <p className="info-message">No Sub Categories Found</p>
        ) : (
          <table className="subcategory-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Description</th>
                {showGenderColumn && <th>Gender</th>}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subcategories.map((subCategory, index) => (
                <tr key={subCategory.Subcategory_id}>
                  <td>{index + 1}</td>
                  <td>{subCategory.Subcategory_name}</td>
                  <td>{subCategory.Subcategory_description}</td>
                  {showGenderColumn && (
                    <td>{subCategory.gender || "N/A"}</td>
                  )}
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(subCategory)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() =>
                        handleDelete(subCategory.Subcategory_id)
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MODALS */}
      {isModalOpen && (
        <AddSubCategory onClose={() => setIsModalOpen(false)} />
      )}

      {isEditModalOpen && (
        <EditSubCategory
          onClose={() => setIsEditModalOpen(false)}
          subCategory={selectedSubCategory}
        />
      )}
    </div>
  );
};

export default SubCategoryList;
