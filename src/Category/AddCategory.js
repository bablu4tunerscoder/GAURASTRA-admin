import React from "react";
import { useForm } from "react-hook-form";
import { useCreateCategoryMutation } from "../Redux/Slices/categorySlice";

const AddCategory = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [createCategory, { isLoading }] = useCreateCategoryMutation();

  const onSubmit = async (data) => {
    try {
      await createCategory({
        category_name: data.category_name,
        category_description: data.category_description,
      }).unwrap();

      reset();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Create New Category
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Category Name */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Category Name
            </label>
            <input
              type="text"
              className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none ${errors.category_name
                ? "border-red-500"
                : "border-gray-300 focus:border-blue-500"
                }`}
              placeholder="Enter category name"
              {...register("category_name", {
                required: "Category name is required",
                minLength: {
                  value: 3,
                  message: "Minimum 3 characters required",
                },
              })}
            />
            {errors.category_name && (
              <p className="mt-1 text-xs text-red-500">
                {errors.category_name.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              rows={3}
              className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none ${errors.category_description
                ? "border-red-500"
                : "border-gray-300 focus:border-blue-500"
                }`}
              placeholder="Enter description"
              {...register("category_description", {
                required: "Description is required",
                minLength: {
                  value: 10,
                  message: "Minimum 10 characters required",
                },
              })}
            />
            {errors.category_description && (
              <p className="mt-1 text-xs text-red-500">
                {errors.category_description.message}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {isLoading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;
