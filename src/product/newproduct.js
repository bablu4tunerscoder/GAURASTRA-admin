import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { clearMedia } from "../Redux/Slices/mediaSlice";
import {
  useAddBulkProductsMutation,
  useUpdateProductByIdMutation,
  clearProductToEdit,
  editCurrentProduct,
  resetCurrentProductMedia,
  saveCurrentProduct,
  clearProductsToSubmit,
  useFetchProductByIdQuery,
} from "../Redux/Slices/productSlice";
import Categories from "./Categories";
import ImageVideoManager from "./ImageVideoManager";
import "./newproduct.scss";
import Pricing from "./Pricing";
import ProductInfo from "./ProductInfo";
import ProductList from "./ProductList";
import ProductOptions from "./ProductOptions";
import SeoSection from "./SeoSection";

const NewProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: productId } = useParams()

  const { currentProduct, productsToSubmit, productToUpdate } =
    useSelector((state) => state.product);

  // RTK Query mutations
  const [addBulkProducts, { isLoading: isAdding }] = useAddBulkProductsMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductByIdMutation();
  // RTK Query queries
  const { data: productData, isLoading: isLoadingUpdate, isError } = useFetchProductByIdQuery(productId);



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

  const handleSubmitAllProducts = async () => {
    if (productsToSubmit.length === 0) {
      alert("No products to submit. Please add at least one product.");
      return;
    }

    if (
      window.confirm(
        `Are you sure you want to submit ${productsToSubmit.length} products?`
      )
    ) {
      try {
        await addBulkProducts(productsToSubmit).unwrap();
        alert("All products submitted successfully!");
        dispatch(clearProductsToSubmit());
        navigate("/products");
      } catch (error) {
        console.error("Error submitting products:", error);
        alert("Error submitting products!");
      }
    }
  };

  const handleEditProduct = async () => {
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

    dispatch(editCurrentProduct());

    try {
      await updateProduct({
        product_id: productId,
        productData: productToUpdate,
      }).unwrap();

      alert("Product Updated successfully!");
      dispatch(clearProductToEdit());
      dispatch(clearMedia());
      dispatch(resetCurrentProductMedia());
      navigate("/products");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Error Updating product!");
    }
  };

  const isLoading = isAdding || isUpdating;

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
      {productData ? (
        <>
          <div className="bottom-button-group">
            <button
              className="bottom-save-btn"
              onClick={handleEditProduct}
              disabled={isLoading}
            >
              {isUpdating ? "Updating..." : "Update Product"}
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
              disabled={isLoading}
            >
              {isAdding ? "Saving..." : "Save Product"}
            </button>
            {productsToSubmit.length > 0 && (
              <button
                className="bottom-submit-btn"
                onClick={handleSubmitAllProducts}
                disabled={isLoading}
              >
                {isAdding ? "Submitting..." : `Submit All (${productsToSubmit.length})`}
              </button>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default NewProduct;