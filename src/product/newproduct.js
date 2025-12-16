import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { clearMedia } from "../Redux/Slices/mediaSlice";
import {
  useAddBulkProductsMutation,
  useUpdateProductByIdMutation,
  useFetchProductByIdQuery,
  addToSubmitQueue,
  clearSubmitQueue,
  resetFormData,
  loadProductToForm,
  selectFormData,
  selectProductsToSubmit,
  selectLoading,
  selectError,
  selectIsEditMode,
} from "../Redux/Slices/productSlice";
import Categories from "./Categories";
import ImageVideoManager from "./ImageVideoManager";
import "./newproduct.scss";
import Pricing from "./Pricing";
import ProductInfo from "./ProductInfo";
import ProductList from "./ProductList";
import ProductOptions from "./ProductOptions";
import SeoSection from "./SeoSection";
import { toast } from "react-toastify";

const NewProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: productId } = useParams();


  // Redux state
  const formData = useSelector(selectFormData);
  const productsToSubmit = useSelector(selectProductsToSubmit);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const isEditMode = useSelector(selectIsEditMode);

  // RTK Query mutations
  const [addBulkProducts, { isLoading: isAdding }] = useAddBulkProductsMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductByIdMutation();

  // RTK Query - Fetch product by ID if editing
  const {
    data: productData,
    isLoading: isLoadingProduct,
    isError
  } = useFetchProductByIdQuery(productId, {
    skip: !productId, // Skip query if no productId
  });



  // Load product data into form when editing
  useEffect(() => {
    if (productData && productId) {
      dispatch(loadProductToForm(productData));
    }
  }, [productData, productId, dispatch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      dispatch(resetFormData());
      dispatch(clearMedia());
    };
  }, [dispatch]);

  // Validate form data
  const validateForm = () => {
    if (!formData.product_name) {
      toast.error("Product name is required!");
      return false;
    }
    if (!formData.category_id) {
      alert("Category is required!");
      return false;
    }
    if (!formData.Subcategory_id) {
      alert("Subcategory is required!");
      return false;
    }
    return true;
  };

  // Save current product to queue for bulk submission
  const handleSaveCurrentProduct = () => {
    if (!validateForm()) return;

    dispatch(addToSubmitQueue());
    dispatch(clearMedia());
    toast.success("Product saved locally. You can now add another product.");
  };

  // Submit all products in queue
  const handleSubmitAllProducts = async () => {
    if (productsToSubmit.length === 0) {
      toast.error("No products to submit. Please add at least one product.");
      return;
    }

    if (
      window.confirm(
        `Are you sure you want to submit ${productsToSubmit.length} products?`
      )
    ) {
      try {
        await addBulkProducts(productsToSubmit).unwrap();
        toast.success("All products submitted successfully!");
        dispatch(clearMedia());
        navigate("/products");
      } catch (error) {
        console.error("Error submitting products:", error);
        toast.error(` ${error?.data?.message || error.message || "Error submitting products"}`);
      }
    }
  };

  // Update existing product
  const handleUpdateProduct = async () => {
    if (!validateForm()) return;

    if (!productId) {
      toast.error("Product ID is missing!");
      return;
    }

    try {
      await updateProduct({
        product_id: productId,
        productData: formData,
      }).unwrap();

      toast.success("Product updated successfully!");
      dispatch(clearMedia());
      navigate("/products");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error(` ${error?.data?.message || error.message || "Error updating product"}`);
    }
  };

  // Cancel and go back
  const handleCancel = () => {
    if (
      window.confirm(
        "Are you sure you want to cancel? Any unsaved changes will be lost."
      )
    ) {
      dispatch(resetFormData());
      dispatch(clearSubmitQueue());
      dispatch(clearMedia());
      navigate("/products");
    }
  };

  const isProcessing = isAdding || isUpdating || loading;

  // Show loading state while fetching product data
  if (isLoadingProduct) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Loading product data...</div>
      </div>
    );
  }

  // Show error state
  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-red-500">
          Error loading product. Please try again.
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full px-4">
        <div className="flex gap-6">
          {/* LEFT + RIGHT SECTIONS */}
          <div className="flex flex-col lg:flex-row gap-6 w-full">
            {/* LEFT SECTION */}
            <div className="flex flex-col gap-6 w-full lg:w-2/3">
              <ImageVideoManager images={productData?.images} />
              <ProductInfo />
              <Pricing />
              <ProductOptions />
            </div>
            {/* RIGHT SECTION */}
            <div className="flex flex-col gap-6 w-full lg:w-1/3">
              <Categories />
              <SeoSection />
            </div>
          </div>

          {/* PRODUCT LIST ON RIGHT SIDE IF EXISTS */}
          {productsToSubmit.length > 0 && !isEditMode && (
            <div className="w-full lg:w-auto">
              <ProductList products={productsToSubmit} />
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM BUTTONS */}
      {isEditMode ? (
        <div className="w-full bg-white py-4 px-6 flex justify-end gap-4 mt-6 shadow-sm">
          <button
            className="bg-gray-500 hover:bg-gray-700 text-white font-medium px-6 py-2 rounded-lg transition disabled:opacity-50"
            onClick={handleCancel}
            disabled={isProcessing}
          >
            Cancel
          </button>

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition disabled:opacity-50"
            onClick={handleUpdateProduct}
            disabled={isProcessing}
          >
            {isUpdating ? "Updating..." : "Update Product"}
          </button>
        </div>
      ) : (
        <div className="w-full bg-white py-4 px-6 flex justify-end gap-4 mt-6 shadow-sm">
          <button
            className="bg-red-500 flex-1 hover:bg-red-700 text-white font-medium px-6 py-2 rounded-lg transition disabled:opacity-50"
            onClick={handleCancel}
            disabled={isProcessing}
          >
            Cancel
          </button>

          <button
            className="bg-blue-500  flex-1 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition disabled:opacity-50"
            onClick={handleSaveCurrentProduct}
            disabled={isProcessing}
          >
            {isAdding ? "Saving..." : "Save Product"}
          </button>

          {productsToSubmit.length > 0 && (
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-lg transition disabled:opacity-50"
              onClick={handleSubmitAllProducts}
              disabled={isProcessing}
            >
              {isAdding
                ? "Submitting..."
                : `Submit All (${productsToSubmit.length})`}
            </button>
          )}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
          {error}
        </div>
      )}
    </>
  );
};

export default NewProduct;