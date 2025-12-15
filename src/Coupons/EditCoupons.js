import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  useGetCategoriesQuery,
  useGetSubcategoriesQuery,
} from "../Redux/Slices/categorySlice";
import { useFetchProductsQuery } from "../Redux/Slices/productSlice";
import { useUpdateUserCouponMutation } from "../Redux/Slices/couponSlice";

const EditCoupons = ({ coupon, onClose }) => {
  const { data: products = [] } = useFetchProductsQuery();
  const { data: categories = [] } = useGetCategoriesQuery();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const selectedCategories = watch("applicableCategories") || [];

  const { data: subcategoriesMap = {} } = useGetSubcategoriesQuery(
    selectedCategories,
    { skip: selectedCategories.length === 0 }
  );

  const [updateCoupon, { isLoading }] = useUpdateUserCouponMutation();

  useEffect(() => {
    reset({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      applicableProducts: coupon.applicableProducts || [],
      applicableCategories: coupon.applicableCategories || [],
      applicableSubcategories: coupon.applicableSubcategories || [],
      minCartAmount: coupon.minCartAmount || "",
      status: coupon.status,
      expiresAt: coupon.expiresAt?.split("T")[0] || "",
      usageLimit: coupon.usageLimit || "",
    });
  }, [coupon, reset]);

  const onSubmit = async (data) => {
    await updateCoupon({
      id: coupon.coupon_id,
      couponData: data,
    }).unwrap();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-3xl rounded-xl bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Edit Coupon</h2>
          <button onClick={onClose} className="text-xl">&times;</button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Code */}
          <input
            {...register("code", { required: "Coupon code is required" })}
            className="w-full rounded border px-3 py-2"
            placeholder="Coupon Code"
          />
          {errors.code && <p className="text-sm text-red-500">{errors.code.message}</p>}

          {/* Discount */}
          <div className="grid grid-cols-2 gap-4">
            <select {...register("discountType")} className="rounded border px-3 py-2">
              <option value="percentage">Percentage</option>
              <option value="flat">Flat</option>
            </select>

            <input
              type="number"
              {...register("discountValue", {
                required: "Discount value required",
                validate: (v) =>
                  watch("discountType") === "percentage" && v > 100
                    ? "Percentage cannot exceed 100"
                    : true,
              })}
              className="rounded border px-3 py-2"
              placeholder="Discount Value"
            />
          </div>
          {errors.discountValue && (
            <p className="text-sm text-red-500">{errors.discountValue.message}</p>
          )}

          {/* Products */}
          <select
            multiple
            {...register("applicableProducts")}
            className="w-full rounded border px-3 py-2"
          >
            {products.map((p) => (
              <option key={p.product_id} value={p.product_id}>
                {p.product_name}
              </option>
            ))}
          </select>

          {/* Categories */}
          <select
            multiple
            {...register("applicableCategories")}
            onChange={(e) =>
              setValue(
                "applicableCategories",
                Array.from(e.target.selectedOptions).map((o) => o.value)
              )
            }
            className="w-full rounded border px-3 py-2"
          >
            {categories.map((c) => (
              <option key={c.category_id} value={c.category_id}>
                {c.category_name}
              </option>
            ))}
          </select>

          {/* Subcategories */}
          {selectedCategories.length > 0 && (
            <select
              multiple
              {...register("applicableSubcategories")}
              className="w-full rounded border px-3 py-2"
            >
              {selectedCategories.flatMap((catId) =>
                (subcategoriesMap[catId] || []).map((sub) => (
                  <option
                    key={sub.Subcategory_id}
                    value={sub.Subcategory_id}
                  >
                    {sub.Subcategory_name}
                  </option>
                ))
              )}
            </select>
          )}

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded border px-4 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded bg-blue-600 px-5 py-2 text-white"
            >
              {isLoading ? "Updating..." : "Update Coupon"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCoupons;
