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
      <div className="w-full px-4">
        <div className="flex gap-6">

          {/* LEFT + RIGHT SECTIONS */}
          <div className="flex flex-col lg:flex-row gap-6 w-full">

            {/* LEFT SECTION */}
            <div className="flex flex-col gap-6 w-full lg:w-2/3">
              <div className="bg-white shadow-md rounded-xl p-4">
                <ImageVideoManager />
              </div>

              <div className="bg-white shadow-md rounded-xl p-4">
                <ProductInfo />
              </div>

              <div className="bg-white shadow-md rounded-xl p-4">
                <Pricing />
              </div>

              <div className="bg-white shadow-md rounded-xl p-4">
                <ProductOptions />
              </div>
            </div>

            {/* RIGHT SECTION */}
            <div className="flex flex-col gap-6 w-full lg:w-1/3">
              <div className="bg-white shadow-md rounded-xl p-4">
                <Categories />
              </div>

              <div className="bg-white shadow-md rounded-xl p-4">
                <SeoSection />
              </div>
            </div>
          </div>

          {/* PRODUCT LIST ON RIGHT SIDE IF EXISTS */}
          {productsToSubmit.length > 0 && (
            <div className="w-full lg:w-auto">
              <ProductList products={productsToSubmit} />
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM BUTTONS  */}
      {productData ? (
        <div className="w-full bg-white border-t py-4 px-6 flex justify-end gap-4 mt-6 shadow-sm">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition disabled:opacity-50"
            onClick={handleEditProduct}
            disabled={isLoading}
          >
            {isUpdating ? "Updating..." : "Update Product"}
          </button>
        </div>
      ) : (
        <div className="w-full bg-white border-t py-4 px-6 flex justify-end gap-4 mt-6 shadow-sm">
          <button className="bg-red-500 hover:bg-red-700 text-white font-medium px-6 py-2 rounded-lg transition">
            Cancel
          </button>

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition disabled:opacity-50"
            onClick={handleSaveCurrentProduct}
            disabled={isLoading}
          >
            {isAdding ? "Saving..." : "Save Product"}
          </button>

          {productsToSubmit.length > 0 && (
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-lg transition disabled:opacity-50"
              onClick={handleSubmitAllProducts}
              disabled={isLoading}
            >
              {isAdding ? "Submitting..." : `Submit All (${productsToSubmit.length})`}
            </button>
          )}
        </div>
      )}

    </>

  );
};

export default NewProduct;