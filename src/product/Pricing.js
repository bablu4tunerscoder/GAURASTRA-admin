import { useWatch } from "react-hook-form";

const Pricing = ({ register, control, errors }) => {
  // Watch pricing fields to calculate sale price in real-time
  const originalPrice = useWatch({
    control,
    name: "pricing.original_price",
    defaultValue: 0
  });

  const discountPercent = useWatch({
    control,
    name: "pricing.discount_percent",
    defaultValue: 0
  });

  // Calculate sale price automatically
  const calculateSalePrice = () => {
    const price = parseFloat(originalPrice) || 0;
    const discount = parseFloat(discountPercent) || 0;

    if (price && discount) {
      return price - (price * discount) / 100;
    }
    return price;
  };

  const salePrice = calculateSalePrice();

  return (
    <div className="w-full bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">Pricing</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Original Price */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            Price <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            {...register("pricing.original_price", {
              required: "Price is required",
              min: {
                value: 0.01,
                message: "Price must be greater than 0"
              },
              valueAsNumber: true
            })}
            min="0"
            step="0.01"
            placeholder="0.00"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
          {errors?.pricing?.original_price && (
            <p className="text-red-500 text-xs mt-1">
              {errors.pricing.original_price.message}
            </p>
          )}
        </div>

        {/* SKU */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">SKU</label>
          <input
            type="text"
            {...register("pricing.sku", {
              pattern: {
                value: /^[A-Za-z0-9-_]+$/,
                message: "SKU can only contain letters, numbers, hyphens and underscores"
              }
            })}
            placeholder="Product SKU"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
          {errors?.pricing?.sku && (
            <p className="text-red-500 text-xs mt-1">
              {errors.pricing.sku.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Discount Percent */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            Discount %
          </label>
          <input
            type="number"
            {...register("pricing.discount_percent", {
              min: {
                value: 0,
                message: "Discount cannot be negative"
              },
              max: {
                value: 100,
                message: "Discount cannot exceed 100%"
              },
              valueAsNumber: true
            })}
            min="0"
            max="100"
            step="1"
            placeholder="0"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
          {errors?.pricing?.discount_percent && (
            <p className="text-red-500 text-xs mt-1">
              {errors.pricing.discount_percent.message}
            </p>
          )}
        </div>

        {/* Sale Price (Calculated) */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            Sale Price (Calculated)
          </label>
          <div className="relative">
            <input
              type="text"
              value={salePrice.toFixed(2)}
              readOnly
              className="border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 cursor-not-allowed text-gray-600 w-full"
            />
            {discountPercent > 0 && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-green-600 font-medium">
                {discountPercent}% OFF
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500">
            Automatically calculated based on price and discount
          </p>
        </div>
      </div>

      {/* Currency (Hidden field) */}
      <input
        type="hidden"
        {...register("pricing.currency")}
        value="INR"
      />

      {/* Discounted Price (Hidden field for backend) */}
      <input
        type="hidden"
        {...register("pricing.discounted_price")}
        value={salePrice.toFixed(2)}
      />
    </div>
  );
};

export default Pricing;