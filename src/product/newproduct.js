import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { clearMedia } from "../Redux/Slices/mediaSlice";
import {
  addToSubmitQueue,
  clearSubmitQueue,
  resetFormData,
  selectProductsToSubmit,
  useAddBulkProductsMutation,
  useFetchProductByIdQuery,
  useUpdateProductByIdMutation
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
  const { id: productId } = useParams();

  // Redux state
  const productsToSubmit = useSelector(selectProductsToSubmit);

  // RTK Query mutations
  const [addBulkProducts, { isLoading: isAdding }] = useAddBulkProductsMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductByIdMutation();

  // RTK Query - Fetch product by ID if editing
  const {
    data: productData,
    isLoading: isLoadingProduct,
    isError
  } = useFetchProductByIdQuery(productId, {
    skip: !productId,
  });


  // ✅ Single source of truth for edit mode
  const isEditMode = Boolean(productId && productData);

  // React Hook Form setup
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      product_name: "",
      brand: "Gaurastra",
      status: "Active",
      featuredSection: "All Products",
      description: "",
      category_id: "",
      subcategory_id: "",
      attributes: {
        gender: "",
        sleeve_length: "",
        size: []
      },
      seo: {
        slug: "",
        metaTitle: "",
        metaDescription: "",
        keywords: [],
        canonicalURL: ""
      },
      pricing: {
        currency: "INR",
        sku: "",
        original_price: "",
        discount_percent: "",
        discounted_price: "",
      },
      images: []
    }
  });

  // Load product data into form when editing
  useEffect(() => {
    if (isEditMode) {
      reset({
        product_id: productData.product_id || "",
        productUniqueId: productData.productUniqueId || "",
        product_name: productData.product_name || "",
        brand: productData.brand || "Gaurastra",
        status: productData.status || "Active",
        featuredSection: productData.featuredSection || "All Products",
        description: productData.description || "",
        category_id: productData.category_id || "",
        subcategory_id: productData.subcategory_id || "",
        attributes: {
          gender: productData.attributes?.gender || "",
          sleeve_length: productData.attributes?.sleeve_length || "",
          size: productData.attributes?.size || [],
        },
        seo: {
          slug: productData.seo?.slug || "",
          metaTitle: productData.seo?.metaTitle || "",
          metaDescription: productData.seo?.metaDescription || "",
          keywords: productData.seo?.keywords || [],
          canonicalURL: productData.seo?.canonicalURL || "",
        },
        pricing: {
          currency: productData.latest_pricing?.currency || "INR",
          sku: productData.latest_pricing?.sku || "",
          original_price:
            productData.latest_pricing?.price_detail?.original_price || "",
          discount_percent:
            productData.latest_pricing?.price_detail?.discount_percent || "",
          discounted_price:
            productData.latest_pricing?.price_detail?.discounted_price || "",
        },
        stock_details: productData.stock_details || [],
        images: productData.images || [],
      });
    }
  }, [isEditMode, productData, reset]);



  // Cleanup on unmount
  useEffect(() => {
    return () => {
      dispatch(resetFormData());
      dispatch(clearMedia());
    };
  }, [dispatch]);

  // Save current product to queue (for bulk submission)
  const onSaveProduct = (data) => {

    // Add to Redux queue for bulk submission
    dispatch(addToSubmitQueue(data));

    // Clear form and media
    reset();
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
        const response = await addBulkProducts(productsToSubmit).unwrap();
        console.log(response)
        toast.success("All products submitted successfully!");
        dispatch(clearSubmitQueue());
        dispatch(clearMedia());
        navigate("/products");
      } catch (error) {
        console.error("Error submitting products:", error);
        toast.error(`${error?.data?.message || error.message || "Error submitting products"}`);
      }
    }
  };

  // Update existing product
  const onUpdateProduct = async (data) => {

    if (!productId) {
      toast.error("Product ID is missing!");
      return;
    }

    try {
      await updateProduct({
        product_id: productId,
        productData: data,
      }).unwrap();

      toast.success("Product updated successfully!");
      dispatch(clearMedia());
      navigate("/products");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error(`${error?.data?.message || error.message || "Error updating product"}`);
    }
  };

  // Cancel and go back
  const handleCancel = () => {
    if (
      window.confirm(
        "Are you sure you want to cancel? Any unsaved changes will be lost."
      )
    ) {
      reset();
      dispatch(clearSubmitQueue());
      dispatch(clearMedia());
      navigate(-1);
    }
  };

  const isProcessing = isAdding || isUpdating;

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
    <form onSubmit={handleSubmit(isEditMode ? onUpdateProduct : onSaveProduct)}>
      <div className="w-full">
        <div className="flex gap-6">
          {/* LEFT + RIGHT SECTIONS */}
          <div className="flex flex-col lg:flex-row gap-6 w-full">
            {/* LEFT SECTION */}
            <div className="flex flex-col gap-6 w-full lg:w-2/3">
              <ImageVideoManager
                register={register}
                control={control}
                errors={errors}
                setValue={setValue}
              />
              <ProductInfo
                register={register}
                control={control}
                errors={errors}
                isEditMode={isEditMode}
              />
              <Pricing
                register={register}
                control={control}
                errors={errors}
              />
              <ProductOptions
                setValue={setValue}
                register={register}
                control={control}
                errors={errors}
              />
            </div>

            {/* RIGHT SECTION */}
            <div className="flex flex-col gap-6 w-full lg:w-1/3">
              <Categories
                register={register}
                control={control}
                setValue={setValue}
                errors={errors}
              />
              <SeoSection
                register={register}
                control={control}
                errors={errors}
              />
            </div>
          </div>
        </div>

        {/* PRODUCT LIST ON RIGHT SIDE IF EXISTS */}
        {productsToSubmit.length > 0 && !isEditMode && (
          <div className="w-full mt-6 lg:w-auto">
            <ProductList products={productsToSubmit} />
          </div>
        )}

      </div>

      {/* BOTTOM BUTTONS */}
      {isEditMode ? (
        <div className="w-full bg-white py-4 px-6 flex justify-end gap-4 mt-6 shadow-sm">
          <button
            type="button"
            className="bg-gray-500 hover:bg-gray-700 text-white font-medium px-6 py-2 rounded-lg transition disabled:opacity-50"
            onClick={handleCancel}
            disabled={isProcessing}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition disabled:opacity-50"
            disabled={isProcessing}
          >
            {isUpdating ? "Updating..." : "Update Product"}
          </button>
        </div>
      ) : (
        <div className="w-full bg-white py-4 px-6 flex justify-end gap-4 mt-6 shadow-sm">
          <button
            type="button"
            className="bg-red-500 flex-1 hover:bg-red-700 text-white font-medium px-6 py-2 rounded-lg transition disabled:opacity-50"
            onClick={handleCancel}
            disabled={isProcessing}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="bg-blue-500 flex-1 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition disabled:opacity-50"
            disabled={isProcessing}
          >
            {isAdding ? "Saving..." : "Save Product"}
          </button>

          {productsToSubmit.length > 0 && (
            <button
              type="button"
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
    </form>
  );
};

export default NewProduct;