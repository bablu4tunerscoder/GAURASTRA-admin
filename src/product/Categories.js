import { useWatch } from "react-hook-form";
import {
  useGetCategoriesQuery,
  useGetSubcategoriesQuery,
} from "../Redux/Slices/categorySlice";

const Categories = ({ control, setValue, errors }) => {
  // ✅ Watch selected category
  const categoryId = useWatch({
    control,
    name: "category_id",
  });

  // ✅ Watch selected subcategory
  const subcategoryId = useWatch({
    control,
    name: "subcategory_id",
  });

  const {
    data: categories = [],
    isLoading,
    isError,
  } = useGetCategoriesQuery();

  const { data: subcategories = [] } = useGetSubcategoriesQuery(categoryId, {
    skip: !categoryId,
  });

  const handleCategorySelect = (category) => {
    if (categoryId === category.category_id) {
      // Deselect
      setValue("category_id", "", { shouldValidate: true });
      setValue("subcategory_id", "", { shouldValidate: true });
    } else {
      setValue("category_id", category.category_id, {
        shouldValidate: true,
      });
      setValue("subcategory_id", "", { shouldValidate: true });
    }
  };

  const handleSubcategorySelect = (subcategory) => {
    setValue("subcategory_id", subcategory.Subcategory_id, {
      shouldValidate: true,
    });
  };

  const renderSubcategoryLabel = (sub) => {
    const selectedCat = categories.find(
      (cat) => cat.category_id === categoryId
    );

    if (selectedCat?.category_name?.toLowerCase() === "ethnic wear") {
      return `${sub.Subcategory_name} - ${sub.gender || "Unisex"}`;
    }
    return sub.Subcategory_name;
  };

  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-xl p-6 shadow-sm text-center text-gray-500">
        Loading Categories...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full bg-white rounded-xl p-6 shadow-sm text-center text-red-500">
        Failed to load categories
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">
        Categories & Subcategories
      </h2>

      <div className="space-y-4">
        {categories.map((category) => (
          <div
            key={category.category_id}
            className="border-b border-gray-200 pb-4 last:border-b-0"
          >
            {/* Category */}
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="category"
                checked={categoryId === category.category_id}
                onChange={() => handleCategorySelect(category)}
                className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm capitalize font-medium text-gray-700 group-hover:text-blue-600 transition">
                {category.category_name}
              </span>
            </label>

            {/* Subcategories */}
            {categoryId === category.category_id && (
              <div className="ml-7 mt-3 space-y-2 bg-gray-50 rounded-lg p-3">
                {subcategories.length > 0 ? (
                  subcategories.map((sub) => (
                    <label
                      key={sub.Subcategory_id}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="radio"
                        name="subcategory"
                        checked={subcategoryId === sub.Subcategory_id}
                        onChange={() => handleSubcategorySelect(sub)}
                        className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm capitalize text-gray-600 group-hover:text-blue-600 transition">
                        {renderSubcategoryLabel(sub)}
                      </span>
                    </label>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    No subcategories found
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Errors */}
      {errors?.category_id && (
        <p className="text-red-500 text-xs mt-2">
          {errors.category_id.message}
        </p>
      )}
      {errors?.subcategory_id && (
        <p className="text-red-500 text-xs mt-2">
          {errors.subcategory_id.message}
        </p>
      )}
    </div>
  );
};

export default Categories;
