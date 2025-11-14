import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateNewProduct, editProduct } from "../Redux/Slices/productSlice";
import "./Pricing.scss";

const Pricing = () => {
  const dispatch = useDispatch();

  const isEditMode = useSelector((state) => state.product.isEditMode);
  const { pricing } = useSelector((state) =>
    isEditMode ? state.product.updateProduct : state.product.currentProduct
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue =
      name === "original_price" || name === "discount_percent"
        ? parseFloat(value)
        : value;

    if (isEditMode) {
      dispatch(
        editProduct({
          pricing: {
            ...pricing,
            [name]: parsedValue,
          },
        })
      );
    } else {
      dispatch(
        updateNewProduct({
          pricing: {
            ...pricing,
            [name]: parsedValue,
          },
        })
      );
    }
  };

  const calculateSalePrice = () => {
    if (pricing?.discount_percent && pricing?.original_price) {
      return (
        pricing.original_price -
        (pricing.original_price * pricing.discount_percent) / 100
      );
    }
    return pricing?.original_price || 0;
  };

  const salePrice = calculateSalePrice();

  return (
    <div className="pricing-container">
      <h2>Pricing</h2>
      <div className="form-group" id="priceinput">
        {isEditMode ? (
          <>
            <div>
              <label>Price</label>
              <input
                type="number"
                name="original_price"
                value={pricing?.price_detail?.original_price || ""}
                onChange={(e) =>
                  dispatch(
                    editProduct({
                      pricing: {
                        ...pricing,
                        price_detail: {
                          ...pricing?.latest_pricing?.price_detail,
                          original_price: parseFloat(e.target.value) || 0,
                        },
                      },
                    })
                  )
                }
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label>SKU</label>
              <input
                type="text"
                name="sku"
                value={pricing?.sku || ""}
                onChange={(e) =>
                  dispatch(
                    editProduct({
                      pricing: {
                        ...pricing,
                        sku: e.target.value,
                      },
                    })
                  )
                }
                placeholder="Product SKU"
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label>Price</label>
              <input
                type="number"
                name="original_price"
                value={pricing?.original_price || ""}
                onChange={handleChange}
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label>SKU</label>
              <input
                type="text"
                name="sku"
                value={pricing?.sku || ""}
                onChange={handleChange}
                placeholder="Product SKU"
              />
            </div>
          </>
        )}
      </div>

      {isEditMode ? (
        <div style={{ display: "flex", gap: "10px" }}>
          <div className="form-group discount">
            <div className="discount-wrapper">
              <label>Discount %</label>
              <input
                type="number"
                name="discount_percent"
                value={pricing?.price_detail?.discount_percent}
                onChange={(e) =>
                  dispatch(
                    editProduct({
                      pricing: {
                        ...pricing,
                        price_detail: {
                          ...pricing?.price_detail,
                          discount_percent: parseFloat(e.target.value),
                        },
                      },
                    })
                  )
                }
                className="discount-input"
                min="0"
                max="100"
                step="1"
              />
            </div>
          </div>
          <div className="form-group">
            <div className="discount-wrapper">
              <label>Sale price</label>
              <input
                type="number"
                value={
                  pricing?.price_detail?.original_price != null
                    ? (
                        pricing.price_detail.original_price -
                        (pricing.price_detail.original_price *
                          (pricing.price_detail.discount_percent || 0)) /
                          100
                      ).toFixed(2)
                    : "0.00"
                }
                readOnly
                className="sale-price-input"
              />
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", gap: "10px" }}>
          <div className="form-group discount">
            <div className="discount-wrapper">
              <label>Discount %</label>
              <input
                type="number"
                name="discount_percent"
                value={pricing?.discount_percent}
                onChange={handleChange}
                className="discount-input"
                min="0"
                max="100"
                step="1"
              />
            </div>
          </div>
          <div className="form-group">
            <div className="discount-wrapper">
              <label>Sale price</label>
              <input
                type="number"
                value={salePrice.toFixed(2)}
                readOnly
                className="sale-price-input"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pricing;
