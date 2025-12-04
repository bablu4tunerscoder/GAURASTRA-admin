import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addBulkProducts,
  saveCurrentProduct,
  resetCurrentProductMedia,
  editCurrentProduct,
  updateProductById,
  clearProductToEdit,
} from "../Redux/Slices/productSlice";
import { clearMedia } from "../Redux/Slices/mediaSlice";
import "./newproduct.scss";
import ProductHeader from "./ProductHeader";
import ImageVideoManager from "./ImageVideoManager";
import Pricing from "./Pricing";
import Categories from "./Categories";
import ProductOptions from "./ProductOptions";
import ProductInfo from "./ProductInfo";
import SeoSection from "./SeoSection";
import ProductList from "./ProductList";
import { useNavigate } from "react-router-dom";

const NewProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isEditMode = useSelector((state) => state.product.isEditMode);
  const productId = localStorage.getItem("ProductId");

  const { currentProduct, productsToSubmit, status, updateProduct } =
    useSelector((state) => state.product);

  const handleSaveCurrentProduct = () => {
    // Validate required fields
    if (!currentProduct.product_name) {
      alert("Product name is required!");
      return;
    }
    if (!currentProduct.category_id) {
      alert("Category is required!");
      return;
    }
    if (!currentProduct.Subcategory_id) {
      alert("Subcategory is required!");
      return;
    }

    dispatch(saveCurrentProduct());
    dispatch(clearMedia());
    dispatch(resetCurrentProductMedia());
    alert("Product saved locally. You can now add another product.");
  };

  const handleSubmitAllProducts = () => {
    if (productsToSubmit.length === 0) {
      alert("No products to submit. Please add at least one product.");
      return;
    }

    if (
      window.confirm(
        `Are you sure you want to submit ${productsToSubmit.length} products?`
      )
    ) {
      dispatch(addBulkProducts()).then((response) => {
        if (response.meta.requestStatus === "fulfilled") {
          alert("All products submitted successfully!");
          navigate("/products"); // <-- Navigate to /products
          window.location.reload(); //
        } else {
          alert("Error submitting products!");
        }
      });
    }
  };

  const handleEditProduct = () => {
    // Validate required fields
    if (!updateProduct.product_name) {
      alert("Product name is required!");
      return;
    }
    if (!updateProduct.category_id) {
      alert("Category is required!");
      return;
    }
    if (!updateProduct.Subcategory_id) {
      alert("Subcategory is required!");
      return;
    }
console.log("firsdmjmt",productsToSubmit)
    dispatch(editCurrentProduct());
    dispatch(updateProductById({ product_id: productId })).then((response) => {
      if (response.meta.requestStatus === "fulfilled") {
        alert("Product Updated successfully!");
        navigate("/products");
        dispatch(clearProductToEdit());
      } else {
        alert("Error Updating products!");
      }
    });
    dispatch(clearMedia());
    dispatch(resetCurrentProductMedia());
  };

  return (
    <>
      <div className="app-container">
        <div className="main-container" style={{ display: "flex" }}>
          <div className="content-wrapper">
            <div className="left-section">
              <div className="section-box">
                <ImageVideoManager />
              </div>
              <div className="section-box">
                <ProductInfo />
              </div>
              <div className="section-box">
                <Pricing />
              </div>
              <div className="section-box">
                <ProductOptions />
              </div>
            </div>
            <div className="right-section">
              <div className="section-box">
                <Categories />
              </div>
              <div className="section-box">
                <SeoSection />
              </div>
            </div>
          </div>
          <div>
            {productsToSubmit.length > 0 && (
              <ProductList products={productsToSubmit} />
            )}
          </div>
        </div>
      </div>
      {isEditMode ? (
        <>
          <div className="bottom-button-group">
            <button
              className="bottom-save-btn"
              onClick={handleEditProduct}
              disabled={status === "loading"}
            >
              {status === "loading" ? "Updating..." : "Update Product"}
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="bottom-button-group">
            <button className="bottom-cancel-btn">Cancel</button>
            <button
              className="bottom-save-btn"
              onClick={handleSaveCurrentProduct}
              disabled={status === "loading"}
            >
              {status === "loading" ? "Saving..." : "Save Product"}
            </button>
            {productsToSubmit.length > 0 && (
              <button
                className="bottom-submit-btn"
                onClick={handleSubmitAllProducts}
                disabled={status === "loading"}
              >
                Submit All ({productsToSubmit.length})
              </button>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default NewProduct;
