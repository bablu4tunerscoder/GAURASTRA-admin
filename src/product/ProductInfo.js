import { Controller } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const ProductInfo = ({ register, control, errors }) => {
  return (
    <div className="w-full bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">
        Product Info
      </h2>

      {/* Top Fields */}
      <div className="flex flex-col flex-wrap lg:flex-row gap-6 mb-6">
        {/* Product Name */}
        <div className="flex flex-col gap-2 w-full">
          <label className="text-sm font-medium text-gray-700">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("product_name", {
              required: "Product name is required",
              minLength: {
                value: 3,
                message: "Product name must be at least 3 characters",
              },
            })}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter product name"
          />
          {errors?.product_name && (
            <p className="text-red-500 text-xs">
              {errors.product_name.message}
            </p>
          )}
        </div>

        {/* Brand */}
        <div className="flex flex-col gap-2 w-full">
          <label className="text-sm font-medium text-gray-700">
            Brand
          </label>
          <input
            type="text"
            {...register("brand")}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter brand name"
          />
        </div>

        {/* Featured Section */}
        <div className="flex flex-col gap-2 w-full">
          <label className="text-sm font-medium text-gray-700">
            Featured Section
          </label>
          <select
            {...register("featuredSection")}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All Products">All Products</option>
            <option value="New Arrivals">New Arrivals</option>
            <option value="Our Collection">Our Collection</option>
            <option value="Limited Edition">Limited Edition</option>
          </select>
        </div>
      </div>

      {/* Description (ALWAYS QUILL) */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">
          Description <span className="text-red-500">*</span>
        </label>

        <Controller
          name="description"
          control={control}
          rules={{
            required: "Description is required",
            validate: (value) => {
              const textOnly = value
                ?.replace(/<[^>]*>/g, "")
                .trim();
              if (!textOnly || textOnly.length < 10) {
                return "Description must be at least 10 characters";
              }
              return true;
            },
          }}
          render={({ field: { onChange, value } }) => (
            <ReactQuill
              value={value || ""}
              onChange={onChange}
              theme="snow"
              placeholder="Enter product description..."
              className="bg-white"
              modules={{
                toolbar: [
                  [{ header: [1, 2, 3, false] }],
                  ["bold", "italic", "underline", "strike"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["link"],
                  ["clean"],
                ],
              }}
            />
          )}
        />

        {errors?.description && (
          <p className="text-red-500 text-xs">
            {errors.description.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductInfo;
