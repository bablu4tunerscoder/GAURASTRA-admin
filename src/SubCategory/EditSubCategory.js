import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useUpdateSubCategoryMutation } from "../Redux/Slices/subcategorySlice";

const EditSubCategory = ({ onClose, subCategory }) => {
  const navigate = useNavigate();
  const { categories } = useSelector((state) => state.category);
  const [updateSubCategory, { isLoading }] = useUpdateSubCategoryMutation();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      Subcategory_name: "",
      Subcategory_description: "",
      category_id: "",
      gender: "",
    },
  });

  useEffect(() => {
    if (subCategory) {
      setValue("Subcategory_name", subCategory.Subcategory_name || "");
      setValue(
        "Subcategory_description",
        subCategory.Subcategory_description || ""
      );
      setValue("category_id", subCategory.category_id || "");
      setValue("gender", subCategory.gender || "");
    }
  }, [subCategory, setValue]);

  const selectedCategoryId = watch("category_id");
  const selectedCategory = categories.find(
    (cat) => cat.category_id === selectedCategoryId
  );
  const isEthnicWear =
    selectedCategory?.category_name?.toLowerCase() === "ethnic wear";

  const onSubmit = async (data) => {
    if (data.category_id === "Other's") {
      navigate("/category");
      return;
    }

    const payload = {
      id: subCategory.Subcategory_id,
      Subcategory_name: data.Subcategory_name.trim(),
      Subcategory_description: data.Subcategory_description.trim(),
      category_id: data.category_id,
      status: subCategory.status || "Active",
      ...(isEthnicWear && { gender: data.gender }),
    };

    await updateSubCategory(payload).unwrap();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Edit Sub Category
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Sub Category Name
            </label>
            <input
              type="text"
              {...register("Subcategory_name", {
                required: "Subcategory name is required",
                minLength: { value: 3, message: "Minimum 3 characters required" },
              })}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.Subcategory_name && (
              <p className="mt-1 text-xs text-red-500">
                {errors.Subcategory_name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              {...register("Subcategory_description", {
                required: "Description is required",
                minLength: { value: 10, message: "Minimum 10 characters required" },
              })}
              rows={3}
              className="mt-1 w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.Subcategory_description && (
              <p className="mt-1 text-xs text-red-500">
                {errors.Subcategory_description.message}
              </p>
            )}
          </div>

          {isEthnicWear && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <select
                {...register("gender", {
                  required: "Gender is required for Ethnic Wear",
                })}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Gender</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Unisex">Unisex</option>
              </select>
              {errors.gender && (
                <p className="mt-1 text-xs text-red-500">{errors.gender.message}</p>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-md flex-1 bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-md flex-1 bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSubCategory;
