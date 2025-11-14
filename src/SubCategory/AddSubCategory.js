import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSubCategory } from "../Redux/Slices/subcategorySlice";
import { useNavigate } from "react-router-dom";
import "./AddSubCategory.scss";

const AddSubCategory = ({ onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories } = useSelector((state) => state.category);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [gender, setGender] = useState("");
  const [error, setError] = useState(null);

  const selectedCategory = categories.find(
    (cat) => cat.category_id === selectedCategoryId
  );
  const isEthnicWear =
    selectedCategory?.category_name?.toLowerCase() === "ethnic wear";

  const handleCategoryChange = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue === "Other's") {
      navigate("/category");
    } else {
      setSelectedCategoryId(selectedValue);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !name.trim() ||
      !description.trim() ||
      !selectedCategoryId ||
      (isEthnicWear && !gender)
    ) {
      setError("All fields are required!");
      return;
    }

    const subCategoryData = {
      Subcategory_name: name,
      Subcategory_description: description,
      category_id: selectedCategoryId,
      ...(isEthnicWear && { gender }),
    };

    try {
      await dispatch(createSubCategory(subCategoryData)).unwrap();
      onClose();
    } catch (err) {
      console.error("Error creating subcategory:", err);
      setError(err || "Failed to create subcategory");
    }
  };

  return (
    <div className="sub-modal-overlay">
      <div className="sub-modal">
        <h2>Create New Sub Category</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="sub-error-message">{error}</p>}

          <label>Select Category:</label>
          <select
            value={selectedCategoryId}
            onChange={handleCategoryChange}
            required
          >
            <option value=""> Select Category </option>
            {categories.map((category) => (
              <option key={category.category_id} value={category.category_id}>
                {category.category_name}
              </option>
            ))}
            <option value="Other's">Other</option>
          </select>

          <label>Sub Category Name:</label>
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
          />

          {isEthnicWear && (
            <>
              <label>Select Gender:</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              >
                <option value="">Select Gender</option>
                <option value="Mens">Mens</option>
                <option value="Womens">Womens</option>
                <option value="Kids">Kids</option>
              </select>
            </>
          )}

          <div className="sub-modal-actions">
            <button type="submit" className="sub-submit-btn">
              Create
            </button>
            <button type="button" className="sub-close-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSubCategory;
