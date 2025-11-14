import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "./ProductHeader.scss";

const ProductHeader = ({ onSave, onSubmitAll, productCount }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [productName, setProductName] = useState("Product Name");

  const mainImage = useSelector(
    (state) => state.media?.images?.[0]?.url || "../../../assets/coverimg.png"
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleChange = (e) => {
    setProductName(e.target.value);
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setIsEditing(false);
    }
  };

  return (
    <header
      className={`product-header ${isScrolled ? "scrolled" : ""}`}
      style={{
        backgroundImage: !isScrolled
          ? `url(${mainImage || "../../../assets/coverimg.png"})`
          : "none",
      }}
    >
      {isEditing ? (
        <input
          type="text"
          value={productName}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          className="product-input"
        />
      ) : (
        <h1 className="product-title" onDoubleClick={handleDoubleClick}>
          {productName}
        </h1>
      )}

      {/* <div className="button-group">
        <button className="cancel-btn">Cancel</button>
        <button className="save-btn" onClick={onSave}>
          Save
        </button>
        {productCount > 0 && (
          <button className="submit-all-btn" onClick={onSubmitAll}>
            Submit All ({productCount})
          </button>
        )}
      </div> */}
    </header>
  );
};

export default ProductHeader;
