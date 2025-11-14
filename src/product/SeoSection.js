import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateNewProduct,editProduct } from "../Redux/Slices/productSlice";
import "./SeoSection.scss";

const SeoSection = () => {
  const dispatch = useDispatch();
  const isEditMode = useSelector((state) => state.product.isEditMode);
  const { seo } = useSelector((state) => isEditMode ? state.product.updateProduct : state.product.currentProduct);
  const [inputValue, setInputValue] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (isEditMode) {
      dispatch(
        editProduct({
          seo: { ...seo, [name]: value },
        })
      );
    } else {
      dispatch(
        updateNewProduct({
          seo: { ...seo, [name]: value },
        })
      );
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      const updatedKeywords = [...seo.keywords, inputValue.trim()];
      if (isEditMode) {
        dispatch(
          editProduct({
            seo: { ...seo, keywords: updatedKeywords },
          })
        );
      } else {
        dispatch(
          updateNewProduct({
            seo: { ...seo, keywords: updatedKeywords },
          })
        );
      }
      setInputValue("");
    }
  };

  const removeTag = (index) => {
    const updatedKeywords = seo.keywords.filter((_, i) => i !== index);
    if (isEditMode) {
      dispatch(
        editProduct({
          seo: { ...seo, keywords: updatedKeywords },
        })
      );
    } else {
      dispatch(
        updateNewProduct({
          seo: { ...seo, keywords: updatedKeywords },
        })
      );
    }
  };

  return (
    <div className="seo-section">
      <h2>SEO Settings</h2>

      <label>Meta Title:</label>
      <input
        type="text"
        name="metaTitle"
        value={seo.metaTitle}
        onChange={handleChange}
      />

      <label>Meta Description:</label>
      <textarea
        name="metaDescription"
        value={seo.metaDescription}
        onChange={handleChange}
        rows="3"
      ></textarea>

      <label>Keywords (Press Enter to Add):</label>
      <div className="tags-input">
        {seo.keywords.map((keyword, index) => (
          <span key={index} className="tag">
            {keyword}
            <button type="button" onClick={() => removeTag(index)}>
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={seo.keywords.length === 0 ? "Type and press Enter" : ""}
        />
      </div>
    </div>
  );
};

export default SeoSection;
