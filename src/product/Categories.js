import { Controller, useWatch } from "react-hook-form";
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

  // ✅ Watch selected subcategory (FIXED NAME)
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
    // console.log(subcategories)
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
      <div className="w-full bg-white rounded-xl p-6 shadow-sm">
        <div className="text-center text-gray-500">Loading Categories...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full bg-white rounded-xl p-6 shadow-sm">
        <div className="text-center text-red-500">
          Failed to load categories
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">
        Categories & Subcategories
      </h2>

      <Controller
        name="category_id"
        control={control}
        rules={{ required: "Please select a category" }}
        render={() => (
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category.category_id}>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    checked={categoryId === category.category_id}
                    onChange={() => handleCategorySelect(category)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="capitalize text-gray-700">
                    {category.category_name}
                  </span>
                </label>

                {/* ✅ SUBCATEGORY AUTO-RENDER */}
                {categoryId === category.category_id && (
                  <Controller
                    name="subcategory_id"
                    control={control}
                    rules={{ required: "Please select a subcategory" }}
                    render={() => (
                      <div className="ml-7 mt-3 space-y-2 bg-gray-50 rounded-lg p-3">
                        {subcategories.length > 0 ? (
                          subcategories.map((sub) => (

                            <label
                              key={sub.Subcategory_id}
                              className="flex items-center gap-3 cursor-pointer"
                            >
                              {/* {console.log(sub)} */}
                              <input
                                type="radio"
                                checked={
                                  subcategoryId === sub.Subcategory_id
                                }
                                onChange={() =>
                                  handleSubcategorySelect(sub)
                                }
                                className="w-4 h-4 text-blue-600"
                              />
                              <span className="text-sm text-gray-600">
                                {renderSubcategoryLabel(sub)}
                              </span>
                            </label>
                          ))
                        ) : (
                          <p className="text-sm italic text-gray-500">
                            No subcategories found
                          </p>
                        )}
                      </div>
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      />

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
