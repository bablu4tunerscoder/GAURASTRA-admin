import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories, deleteCategory } from "../Redux/Slices/categorySlice";
import "./CategoryList.scss";
import AddCategory from "./AddCategory";
import EditCategory from "./EditCategory";

const CategoryList = () => {
  const dispatch = useDispatch();
  const { categories, isLoading, error } = useSelector((state) => state.category);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    await dispatch(deleteCategory(id));
    dispatch(fetchCategories());
  };

  return (
    <div className="category-container">

      {/* Header */}
      <div className="category-header">
        <h1>All Categories</h1>
        <div className="category-button">
          <button className="create-btn" onClick={() => setIsModalOpen(true)}>
            Create Category
          </button>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <p>Loading categories...</p>
      ) : error ? (
        <p className="error-message">Something Went Wrong</p>
      ) : categories.length === 0 ? (
        <p className="info-message">No Categories Found</p>
      ) : (
        <div className="table-container">
          <table className="category-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {categories.map((category, index) => (
                <tr key={category.category_id}>
                  <td>{index + 1}</td>
                  <td>{category.category_name}</td>
                  <td>{category.category_description}</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(category)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(category.category_id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
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
