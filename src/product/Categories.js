import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedCategory,
  setSelectedSubcategory,
  useGetCategoriesQuery,
  useGetSubcategoriesQuery,
} from "../Redux/Slices/categorySlice";
import { selectFormData, selectIsEditMode, updateFormData } from "../Redux/Slices/productSlice";

const Categories = () => {
  const dispatch = useDispatch();
  const formData = useSelector(selectFormData);
  const isEditMode = useSelector(selectIsEditMode);

  const { category_id, Subcategory_id } = formData;



  const { data: categories = [], isLoading, isError } = useGetCategoriesQuery();
  const { data: subcategories = [] } = useGetSubcategoriesQuery(category_id, {
    skip: !category_id,
  });

  // Initialize selected category/subcategory in edit mode
  useEffect(() => {
    if (isEditMode && formData.category_id) {
      dispatch(
        setSelectedCategory({
          id: formData.category_id,
          name: formData.category_name,
        })
      );

      if (formData.Subcategory_id) {
        dispatch(
          setSelectedSubcategory({
            id: formData.Subcategory_id,
            name: formData.Subcategory_name,
          })
        );
      }
    }
  }, [dispatch, isEditMode, formData]);


  const handleCategorySelect = (category) => {
    if (category_id === category.category_id) {
      dispatch(setSelectedCategory(null));
      dispatch(setSelectedSubcategory(null));
      dispatch(
        updateFormData({
          category_id: "",
          category_name: "",
          Subcategory_id: "",
          Subcategory_name: "",
        })
      );
    } else {
      dispatch(
        setSelectedCategory({
          id: category.category_id,
          name: category.category_name,
        })
      );
      dispatch(setSelectedSubcategory(null));
      dispatch(
        updateFormData({
          category_id: category.category_id,
          category_name: category.category_name,
          Subcategory_id: "",
          Subcategory_name: "",
        })
      );
    }
  };

  const handleSubcategorySelect = (subcategory) => {
    console.log(subcategory)
    dispatch(
      setSelectedSubcategory({
        id: subcategory.Subcategory_id,
        name: subcategory.Subcategory_name,
      })
    );
    dispatch(
      updateFormData({
        Subcategory_id: subcategory.Subcategory_id,
        Subcategory_name: subcategory.Subcategory_name,
      })
    );
  };

  const renderSubcategoryLabel = (sub) => {
    const selectedCat = categories.find((cat) => cat.category_id === category_id);
    if (selectedCat?.category_name === "Ethnic Wear") {
      return `${sub.Subcategory_name} - ${sub.gender || "Unisex"}`;
    }
    return sub.Subcategory_name;
  };

  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-xl p-6 shadow-sm">
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-500">Loading Categories...</div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full bg-white rounded-xl p-6 shadow-sm">
        <div className="flex justify-center items-center py-8">
          <div className="text-red-500">Failed to load categories</div>
        </div>
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
          <div key={category.category_id}>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="category"
                checked={category_id === category.category_id}
                onChange={() => handleCategorySelect(category)}
                className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm font-medium capitalize text-gray-700 group-hover:text-blue-600 transition">
                {category.category_name}
              </span>
            </label>

            {category_id === category.category_id && (
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
                        checked={Subcategory_id === sub.Subcategory_id}
                        onChange={() => handleSubcategorySelect(sub)}
                        className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm capitalize text-gray-600 group-hover:text-blue-600 transition">
                        {renderSubcategoryLabel(sub)}
                      </span>
                    </label>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic">No subcategories found</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
