import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useDispatch, useSelector } from "react-redux";
import { updateFormData, selectFormData } from "../Redux/Slices/productSlice";

const ProductInfo = () => {
  const dispatch = useDispatch();
  const formData = useSelector(selectFormData);

  const handleChange = (field, value) => {
    dispatch(updateFormData({ [field]: value }));
  };

  return (
    <div className="w-full bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">Product Info</h2>

      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        <div className="flex flex-col gap-2 w-full">
          <label className="text-sm font-medium text-gray-700">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.product_name || ""}
            onChange={(e) => handleChange("product_name", e.target.value)}
            placeholder="Enter product name"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label className="text-sm font-medium text-gray-700">Brand</label>
          <input
            type="text"
            value={formData.brand || "Gaurastra"}
            onChange={(e) => handleChange("brand", e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label className="text-sm font-medium text-gray-700">
            Featured Section
          </label>
          <select
            value={formData.featuredSection || "All Products"}
            onChange={(e) => handleChange("featuredSection", e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
          >
            <option value="All Products">All Products</option>
            <option value="New Arrivals">New Arrivals</option>
            <option value="Our Collection">Our Collection</option>
            <option value="Limited Edition">Limited Edition</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">
          Description
        </label>
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <ReactQuill
            value={formData.description || ""}
            onChange={(value) => handleChange("description", value)}
            theme="snow"
            className="bg-white"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
