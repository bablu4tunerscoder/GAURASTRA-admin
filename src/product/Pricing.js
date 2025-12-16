import { useDispatch, useSelector } from "react-redux";
import { selectFormData, selectIsEditMode, updateFormData } from "../Redux/Slices/productSlice";

const Pricing = () => {
  const dispatch = useDispatch();
  const formData = useSelector(selectFormData);
  const isEditMode = useSelector(selectIsEditMode);

  const handleChange = (field, value) => {
    dispatch(
      updateFormData({
        pricing: {
          ...formData.pricing,
          [field]: value,
        },
      })
    );
  };

  const handlePriceDetailChange = (field, value) => {
    dispatch(
      updateFormData({
        pricing: {
          ...formData.pricing,
          price_detail: {
            ...formData.pricing.price_detail,
            [field]: parseFloat(value) || 0,
          },
        },
      })
    );
  };


  const calculateSalePrice = () => {
    if (isEditMode && formData.pricing?.price_detail) {
      const { original_price, discount_percent } = formData.pricing.price_detail;
      if (original_price && discount_percent) {
        return original_price - (original_price * discount_percent) / 100;
      }
      return original_price || 0;
    } else {
      const { original_price, discount_percent } = formData.pricing || {};
      if (original_price && discount_percent) {
        return original_price - (original_price * discount_percent) / 100;
      }
      return original_price || 0;
    }
  };

  const salePrice = calculateSalePrice();

  return (
    <div className="w-full bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">Pricing</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            Price <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={
              isEditMode
                ? formData.latest_pricing?.price_detail?.original_price || ""
                : formData.pricing?.original_price || ""
            }
            onChange={(e) =>
              isEditMode
                ? handlePriceDetailChange("original_price", e.target.value)
                : handleChange("original_price", parseFloat(e.target.value) || 0)
            }
            min="0"
            step="0.01"
            placeholder="0.00"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">SKU</label>
          <input
            type="text"
            value={formData.pricing?.sku || ""}
            onChange={(e) => handleChange("sku", e.target.value)}
            placeholder="Product SKU"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            Discount %
          </label>
          <input
            type="number"
            value={
              isEditMode
                ? formData.latest_pricing?.price_detail?.discount_percent || ""
                : formData.pricing?.discount_percent || ""
            }
            onChange={(e) =>
              isEditMode
                ? handlePriceDetailChange("discount_percent", e.target.value)
                : handleChange("discount_percent", parseFloat(e.target.value) || null)
            }
            min="0"
            max="100"
            step="1"
            placeholder="0"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            Sale Price
          </label>
          <input
            type="number"
            value={salePrice.toFixed(2)}
            readOnly
            className="border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 cursor-not-allowed text-gray-600"
          />
        </div>
      </div>
    </div>
  );
};

export default Pricing;
