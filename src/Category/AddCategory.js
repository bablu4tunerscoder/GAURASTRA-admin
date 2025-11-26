import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createCategory } from "../Redux/Slices/categorySlice"; // Import Redux action
import "./AddCategory.scss";

const AddCategory = ({ onClose }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !description.trim()) {
      setError("All fields are required!");
      return;
    }

    try {
      await dispatch(
        createCategory({
          category_name: name,
          category_description: description,
        })
      ).unwrap();
      onClose(); // Close modal after successful creation
    } catch (err) {
      setError(err || "Failed to create category");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Create New Category</h2>
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
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <div className="modal-actions">
            <button type="submit" className="submit-btn">
              Create
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

export default AddCategory;
