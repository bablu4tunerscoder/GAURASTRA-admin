import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCoupon } from "../Redux/Slices/couponSlice";
import "./CouponModal.scss";
import { useFetchProductsQuery } from "../Redux/Slices/productSlice";

const AddCoupons = ({ onClose }) => {
  const dispatch = useDispatch();
  const { data: products = [], isLoading, isError } = useFetchProductsQuery();


  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    applicableProducts: [],
    minCartAmount: "",
    status: "Active",
    expiresAt: "",
    usageLimit: "",
  });

  const [errors, setErrors] = useState({});


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
      dispatch(createCoupon(formData))
        .unwrap()
        .then(() => {
          onClose();
        })
        .catch((error) => {
          console.error("Error creating coupon:", error);
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

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Create New Coupon</h2>
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

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Create Coupon
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCoupons;
