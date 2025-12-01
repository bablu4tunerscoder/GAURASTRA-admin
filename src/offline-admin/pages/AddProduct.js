import React, { useState } from "react";
import "./AddProduct.scss";
import OfflineSidebar from "../components/OfflineSidebar";

const AddProduct = () => {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [images, setImages] = useState([]);
  const [active, setActive] = useState(true);

  const [variants, setVariants] = useState([
    {
      color: "",
      size: "",
      stock: "",
      actual_price: "",
      offer_price: "",
      offer_type: "percentage"
    }
  ]);

  // ADD IMAGE URL
  const addImageUrl = () => {
    if (imageUrl.trim() !== "") {
      setImages([...images, imageUrl]);
      setImageUrl("");
    }
  };

  // ADD VARIANT
  const addVariant = () => {
    setVariants([
      ...variants,
      {
        color: "",
        size: "",
        stock: "",
        actual_price: "",
        offer_price: "",
        offer_type: "percentage"
      }
    ]);
  };

  // REMOVE VARIANT
  const removeVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  // HANDLE VARIANT CHANGE
  const handleVariantChange = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  // SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault();

    const finalData = {
      title,
      details,
      images,
      active,
      variants,
    };

    console.log("Final Product Data:", finalData);
  };

  return (
    <div className="Offline-addproduct">
      <OfflineSidebar/>
    <div className="add-product-container">
      <h1 className="heading">Add New Product</h1>

      <div className="form-box">
        <form onSubmit={handleSubmit}>

          {/* PRODUCT TITLE */}
          <label>Product Title</label>
          <input
            type="text"
            className="input"
            placeholder="Enter product name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* DESCRIPTION */}
          <label>Description</label>
          <textarea
            className="textarea"
            rows="4"
            placeholder="Write full description..."
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />

          {/* IMAGE URL */}
          <label>Product Images (URL)</label>
          <div className="image-url-box">
            <input
              type="text"
              className="input"
              placeholder="Enter image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            <button type="button" className="btn-outline" onClick={addImageUrl}>
              Add
            </button>
          </div>

          {/* PREVIEW GRID */}
          <div className="image-preview-grid">
            {images.map((img, idx) => (
              <img key={idx} src={img} className="preview-img" alt="" />
            ))}
          </div>

          {/* STATUS */}
          <label>Status</label>
          <select
            className="input"
            value={active}
            onChange={(e) => setActive(e.target.value === "true")}
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>

          {/* VARIANTS */}
          <div className="variant-header">
            <h2>Product Variants</h2>
          </div>

          {variants.map((v, idx) => (
            <div key={idx} className="variant-box">

              <div className="grid-3">
                <input
                  type="text"
                  className="input"
                  placeholder="Color"
                  value={v.color}
                  onChange={(e) => handleVariantChange(idx, "color", e.target.value)}
                />

                <input
                  type="text"
                  className="input"
                  placeholder="Size"
                  value={v.size}
                  onChange={(e) => handleVariantChange(idx, "size", e.target.value)}
                />

                <input
                  type="number"
                  className="input"
                  placeholder="Stock"
                  value={v.stock}
                  onChange={(e) => handleVariantChange(idx, "stock", e.target.value)}
                />
              </div>

              <div className="grid-3">
                <input
                  type="number"
                  className="input"
                  placeholder="Actual Price"
                  value={v.actual_price}
                  onChange={(e) => handleVariantChange(idx, "actual_price", e.target.value)}
                />

                <input
                  type="number"
                  className="input"
                  placeholder="Offer Price"
                  value={v.offer_price}
                  onChange={(e) => handleVariantChange(idx, "offer_price", e.target.value)}
                />

                <select
                  className="input"
                  value={v.offer_type}
                  onChange={(e) => handleVariantChange(idx, "offer_type", e.target.value)}
                >
                  <option value="percentage">Percentage</option>
                  <option value="flat">Flat</option>
                </select>
              </div>

              {variants.length > 1 && (
                <button className="btn-danger" type="button" onClick={() => removeVariant(idx)}>
                  Remove Variant
                </button>
              )}
            </div>
          ))}

          <button type="button" className="btn-outline" onClick={addVariant}>
            + Add Variant
          </button>

          {/* SAVE */}
          <button className="btn-primary">Save Product</button>

        </form>
      </div>
    </div>
        </div>
  );
};

export default AddProduct;
