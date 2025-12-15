import React from "react";
import { useForm, Controller } from "react-hook-form";
import { useCreateCouponMutation } from "../Redux/Slices/couponSlice";
import { useFetchProductsQuery } from "../Redux/Slices/productSlice";

const AddCoupons = ({ onClose }) => {
  const { data: products = [] } = useFetchProductsQuery();
  const [createCoupon, { isLoading }] = useCreateCouponMutation();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      code: "",
      discountType: "percentage",
      discountValue: "",
      applicableProducts: [],
      minCartAmount: "",
      status: "Active",
      expiresAt: "",
      usageLimit: "",
    },
  });

  const watchDiscountType = watch("discountType");

  const onSubmit = async (data) => {
    try {
      await createCoupon(data).unwrap();
      onClose();
    } catch (err) {
      console.error("Failed to create coupon:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Create New Coupon
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Coupon Code*
            </label>
            <input
              type="text"
              {...register("code", { required: "Coupon code is required" })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="e.g., SUMMER20"
            />
            {errors.code && (
              <p className="text-red-600 text-sm mt-1">{errors.code.message}</p>
            )}
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Discount Type*
              </label>
              <select
                {...register("discountType")}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="percentage">Percentage</option>
                <option value="flat">Flat Amount</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Discount Value*
              </label>
              <input
                type="number"
                {...register("discountValue", {
                  required: "Discount value is required",
                  max: watchDiscountType === "percentage" ? {
                    value: 100,
                    message: "Percentage cannot exceed 100%",
                  } : undefined,
                  min: { value: 0, message: "Value cannot be negative" },
                })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
              {errors.discountValue && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.discountValue.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Minimum Cart Amount (₹)
            </label>
            <input
              type="number"
              {...register("minCartAmount", { min: 0 })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="0"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                {...register("status")}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Expiry Date
              </label>
              <input
                type="date"
                {...register("expiresAt")}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Usage Limit
            </label>
            <input
              type="number"
              {...register("usageLimit", { min: 1 })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="Leave empty for unlimited"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Applicable Products
            </label>
            <Controller
              control={control}
              name="applicableProducts"
              render={({ field }) => (
                <select
                  {...field}
                  multiple
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                >
                  {products.map((product) => (
                    <option key={product.product_id} value={product.product_id}>
                      {product.product_name}
                    </option>
                  ))}
                </select>
              )}
            />
            <small className="text-gray-500 text-xs">
              Hold Ctrl/Cmd to select multiple
            </small>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {isLoading ? "Creating..." : "Create Coupon"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCoupons;
