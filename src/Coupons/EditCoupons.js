import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCoupon } from "../Redux/Slices/couponSlice";
import { fetchProducts } from "../Redux/Slices/productSlice";
import { fetchCategories } from "../Redux/Slices/categorySlice";
import { fetchSubcategories } from "../Redux/Slices/categorySlice";
import "./CouponModal.scss";

const EditCoupons = ({ coupon, onClose }) => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.product);
  const { categories } = useSelector((state) => state.category);
  const { subcategories } = useSelector((state) => state.category);

  const [formData, setFormData] = useState({
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    applicableProducts: coupon.applicableProducts || [],
    // applicableCategories: coupon.applicableCategories || [],
    // applicableSubcategories: coupon.applicableSubcategories || [],
    minCartAmount: coupon.minCartAmount || "",
    status: coupon.status,
    expiresAt: coupon.expiresAt ? coupon.expiresAt.split("T")[0] : "",
    usageLimit: coupon.usageLimit || "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());

    // Fetch subcategories for each category in the coupon
    if (coupon.applicableCategories && coupon.applicableCategories.length > 0) {
      coupon.applicableCategories.forEach((categoryId) => {
        dispatch(fetchSubcategories(categoryId));
      });
    }
  }, [dispatch, coupon]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleMultiSelect = (e, field) => {
    const options = e.target.options;
    const selectedValues = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(options[i].value);
      }
    }
    setFormData({
      ...formData,
      [field]: selectedValues,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      dispatch(updateCoupon({ id: coupon.coupon_id, couponData: formData }))
        .unwrap()
        .then(() => {
          onClose();
        })
        .catch((error) => {
          console.error("Error updating coupon:", error);
        });
    } else {
      setErrors(validationErrors);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.code) errors.code = "Coupon code is required";
    if (!formData.discountValue)
      errors.discountValue = "Discount value is required";
    if (
      formData.discountType === "percentage" &&
      formData.discountValue > 100
    ) {
      errors.discountValue = "Percentage discount cannot exceed 100%";
    }
    return errors;
  };

  const handleCategoryChange = (e) => {
    const selectedCategoryIds = Array.from(e.target.selectedOptions).map(
      (option) => option.value
    );
    setFormData({
      ...formData,
      applicableCategories: selectedCategoryIds,
      applicableSubcategories: [], // Reset subcategories when categories change
    });

    // Fetch subcategories for each selected category
    selectedCategoryIds.forEach((categoryId) => {
      dispatch(fetchSubcategories(categoryId));
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Edit Coupon</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Coupon Code*</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="e.g., SUMMER20"
            />
            {errors.code && <span className="error">{errors.code}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Discount Type*</label>
              <select
                name="discountType"
                value={formData.discountType}
                onChange={handleChange}
              >
                <option value="percentage">Percentage</option>
                <option value="flat">Flat Amount</option>
              </select>
            </div>

            <div className="form-group">
              <label>
                Discount Value*
                {formData.discountType === "percentage" ? " (%)" : " (₹)"}
              </label>
              <input
                type="number"
                name="discountValue"
                value={formData.discountValue}
                onChange={handleChange}
                placeholder={
                  formData.discountType === "percentage" ? "10" : "100"
                }
                min="0"
                max={formData.discountType === "percentage" ? "100" : undefined}
              />
              {errors.discountValue && (
                <span className="error">{errors.discountValue}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Minimum Cart Amount (₹)</label>
            <input
              type="number"
              name="minCartAmount"
              value={formData.minCartAmount}
              onChange={handleChange}
              placeholder="0"
              min="0"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="form-group">
              <label>Expiry Date</label>
              <input
                type="date"
                name="expiresAt"
                value={formData.expiresAt}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Usage Limit</label>
            <input
              type="number"
              name="usageLimit"
              value={formData.usageLimit}
              onChange={handleChange}
              placeholder="Leave empty for unlimited"
              min="1"
            />
          </div>

          <div className="form-group">
            <label>Applicable Products</label>
            <select
              multiple
              value={formData.applicableProducts}
              onChange={(e) => handleMultiSelect(e, "applicableProducts")}
            >
              {products.map((product) => (
                <option key={product.product_id} value={product.product_id}>
                  {product.product_name}
                </option>
              ))}
            </select>
            <small>Hold Ctrl/Cmd to select multiple</small>
          </div>
          {/* 
          <div className="form-group">
            <label>Applicable Categories</label>
            <select
              multiple
              value={formData.applicableCategories}
              onChange={handleCategoryChange}
            >
              {categories.map((category) => (
                <option key={category.category_id} value={category.category_id}>
                  {category.category_name}
                </option>
              ))}
            </select>
            <small>Hold Ctrl/Cmd to select multiple</small>
          </div>

          {formData.applicableCategories.length > 0 && (
            <div className="form-group">
              <label>Applicable Subcategories</label>
              <select
                multiple
                value={formData.applicableSubcategories}
                onChange={(e) =>
                  handleMultiSelect(e, "applicableSubcategories")
                }
              >
                {formData.applicableCategories.flatMap((categoryId) => {
                  const categorySubs = subcategories[categoryId] || [];
                  return categorySubs.map((sub) => (
                    <option key={sub.subcategory_id} value={sub.subcategory_id}>
                      {sub.subcategory_name}
                    </option>
                  ));
                })}
              </select>
              <small>Hold Ctrl/Cmd to select multiple</small>
            </div>
          )} */}

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Update Coupon
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCoupons;
