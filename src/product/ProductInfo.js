import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateNewProduct, editProduct } from "../Redux/Slices/productSlice";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./ProductInfo.scss";
const ProductInfo = () => {
  const dispatch = useDispatch();
  const { product_name, brand, description, featuredSection } = useSelector(
    (state) => state.product.currentProduct
  );

  const isEditMode = useSelector((state) => state.product.isEditMode);

  const product = useSelector((state) => state.product.updateProduct);

const handleChange = (e) => {
  const value = e.target.value;
  dispatch(updateNewProduct({ product_name: value }));
};

const handleUpdate = (e) => {
  const value = e.target.value;
  dispatch(editProduct({ product_name: value }));
};

  const defaultBrand = brand || "Gaurastra";
  const handleBrandChange = (e) => {
    dispatch(updateNewProduct({ brand: e.target.value }));
  };
  const handleSectionChange = (e) => {
    if (isEditMode) {
      dispatch(editProduct({ featuredSection: e.target.value }));
    } else {
      dispatch(updateNewProduct({ featuredSection: e.target.value }));
    }
  };

  const handleDescriptionChange = (value) => {
    if (isEditMode) {
      dispatch(editProduct({ description: value }));
    } else {
      dispatch(updateNewProduct({ description: value }));
    }
  };




  return (
    <div className="product-info-container">
      <h2>Product info</h2>
      <div className="basic-info">
        <div style={{ display: "flex", gap: "30px" }}>
          {isEditMode ? (<div>
            <label>Name</label>
            <input type="text" value={product.product_name} onChange={handleUpdate} />
          </div>) : (<div>
            <label>Name</label>
            <input type="text" value={product_name} onChange={handleChange} />
          </div>)}
          <div>
            <label>Brand</label>
            <input type="text" value={defaultBrand} onChange={handleBrandChange} disabled />
          </div>
          {isEditMode ? (<div>
            <label>Section</label>
            <select value={product.featuredSection} onChange={handleSectionChange}>
              <option value="All Products">All Products</option>
              <option value="New Arrivals">New Arrivals</option>
              <option value="Our Collection">Our Collection</option>
              <option value="Limited Edition">Limited Edition</option>
            </select>
          </div>) : (<div>
            <label>Section</label>
            <select value={featuredSection} onChange={handleSectionChange}>
              <option value="All Products">All Products</option>
              <option value="New Arrivals">New Arrivals</option>
              <option value="Our Collection">Our Collection</option>
              <option value="Limited Edition">Limited Edition</option>
            </select>
          </div>)}
        </div>
        <label>Description</label>
        {isEditMode ? (<ReactQuill
          value={product.description}
          onChange={handleDescriptionChange}
          theme="snow"
        />) : (<ReactQuill
          value={description}
          onChange={handleDescriptionChange}
          theme="snow"
        />)}
      </div>
    </div>
  );
};
export default ProductInfo;
