import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateCategory } from "../Redux/Slices/categorySlice"; // Import Redux action
import "./AddCategory.scss";

const EditCategory = ({ onClose, category }) => {
  const dispatch = useDispatch();

  // Prefill form with category data
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (category) {
      setName(category.category_name || "");
      setDescription(category.category_description || "");
    }
  }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !description.trim()) {
      setError("All fields are required!");
      return;
    }

    try {
      await dispatch(
        updateCategory({
          id: category.category_id,
          category_name: name,
          category_description: description,
        })
      ).unwrap();
      onClose(); // Close modal after successful update
    } catch (err) {
      setError(err || "Failed to update category");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Edit Category</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}

          <label>Category Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>

          <div className="modal-actions">
            <button type="submit" className="submit-btn">
              Update
            </button>
            <button type="button" className="close-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCategory;
