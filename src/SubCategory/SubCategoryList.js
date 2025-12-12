import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSubcategories,
  deleteSubCategory,
} from "../Redux/Slices/subcategorySlice";
import { fetchCategories } from "../Redux/Slices/categorySlice";
import "./SubCategoryList.scss";
import Sidebar from "../Components/Sidebar/sidebar";
import AddSubCategory from "./AddSubCategory";
import EditSubCategory from "./EditSubCategory";

const SubCategoryList = () => {
  const dispatch = useDispatch();
  const { subcategories, isLoading, error } = useSelector(
    (state) => state.subcategory
  );
  const { categories } = useSelector((state) => state.category);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  // ✅ Find category name for selected category
  const selectedCategoryName =
    categories.find((cat) => cat.category_id === selectedCategoryId)
      ?.category_name || "";

  const showGenderColumn = selectedCategoryName === "Ethnic Wear";

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (selectedCategoryId) {
      dispatch(fetchSubcategories(selectedCategoryId));
    }
  }, [dispatch, selectedCategoryId]);

  const handleEdit = (subCategory) => {
    setSelectedSubCategory(subCategory);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    await dispatch(deleteSubCategory(id));
    if (selectedCategoryId) {
      dispatch(fetchSubcategories(selectedCategoryId));
    }
  };

  const currentSubcategories = subcategories[selectedCategoryId] || [];

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
              {categories.length > 0 ? (
                categories.map((category) => (
                  <option
                    key={category.category_id}
                    value={category.category_id}
                  >
                    {category.category_name}
                  </option>
                ))
              ) : (
                <option disabled>No categories available</option>
              )}
            </select>
          </div>

          <div className="subcategory-button">
            <button className="create-btn" onClick={() => setIsModalOpen(true)}>
              Create New
            </button>
          </div>
        </div>

        {isLoading ? (
          <p>Loading subcategories...</p>
        ) : !selectedCategoryId ? (
          <p className="info-message">
            Please select a category to view subcategories.
          </p>
        ) : currentSubcategories.length === 0 ? (
          <p className="info-message">No Sub Categories Found</p>
        ) : (
          <table className="subcategory-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Description</th>
                {showGenderColumn && <th>Gender</th>}{" "}
                {/* ✅ Add Gender Header */}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentSubcategories.map((subCategory, index) => (
                <tr key={subCategory.Subcategory_id}>
                  <td>{index + 1}</td>
                  <td>{subCategory.Subcategory_name}</td>
                  <td>{subCategory.Subcategory_description}</td>
                  {showGenderColumn && (
                    <td>{subCategory.gender || "N/A"}</td> // ✅ Add Gender Cell
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
                      onClick={() => handleDelete(subCategory.Subcategory_id)}
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

      {/* Modals */}
      {isModalOpen && <AddSubCategory onClose={() => setIsModalOpen(false)} />}
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
