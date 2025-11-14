import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateSubCategory } from "../Redux/Slices/subcategorySlice";
import axios from "axios";
import { BASE_URL } from "../Components/Helper/axiosinstance";
import "./AddSubCategory.scss";

const EditSubCategory = ({ onClose, subCategory }) => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.category);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [gender, setGender] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const selectedCategory = categories.find(
    (cat) => cat.category_id === subCategory?.category_id
  );
  const isEthnicWear = selectedCategory?.category_name === "Ethnic Wear";

  useEffect(() => {
    const fetchSubCategoryDetails = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${BASE_URL}/api/subcategories/findOne/${subCategory.Subcategory_id}`
        );
        const data = res.data?.data;
        if (data) {
          setName(data.Subcategory_name || "");
          setDescription(data.Subcategory_description || "");
          setGender(data.gender || "");
        }
      } catch (err) {
        setError("Failed to load subcategory details");
      } finally {
        setLoading(false);
      }
    };

    if (subCategory?.Subcategory_id) {
      fetchSubCategoryDetails();
    }
  }, [subCategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !description.trim()) {
      setError("All fields are required!");
      return;
    }

    const updatedData = {
      id: subCategory.Subcategory_id,
      category_id: subCategory.category_id,
      Subcategory_name: name,
      Subcategory_description: description,
      status: subCategory.status || "Active",
      ...(isEthnicWear && { gender }),
    };

    try {
      await dispatch(updateSubCategory(updatedData)).unwrap();
      onClose();
    } catch (err) {
      setError(err || "Failed to update Sub category");
    }
  };

  if (loading) {
    return (
      <div className="sub-modal-overlay">
        <div className="sub-modal">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sub-modal-overlay">
      <div className="sub-modal">
        <h2>Edit Sub Category</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="sub-error-message">{error}</p>}

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
          ></textarea>

          {isEthnicWear && (
            <>
              <label>Gender:</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              >
                <option value="">Select Gender</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Unisex">Unisex</option>
              </select>
            </>
          )}

          <div className="sub-modal-actions">
            <button type="submit" className="sub-submit-btn">
              Update
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

export default EditSubCategory;
