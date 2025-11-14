import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  fetchSubcategories,
  setSelectedCategory,
  setSelectedSubcategory,
} from "../Redux/Slices/categorySlice";
import { updateNewProduct, editProduct } from "../Redux/Slices/productSlice";
import "./Categories.scss";

const Categories = () => {
  const dispatch = useDispatch();

  const updateProduct = useSelector((state) => state.product.updateProduct);

  const isEditMode = useSelector((state) => state.product.isEditMode);

  const {
    categories,
    subcategories,
    selectedCategory,
    selectedSubcategory,
    isLoading,
    error,
  } = useSelector((state) => state.category);

  const { category_id, Subcategory_id } = useSelector((state) =>
    isEditMode ? state.product.updateProduct : state.product.currentProduct
  );

  useEffect(() => {
    dispatch(fetchCategories()).then(() => {
      if (isEditMode && updateProduct?.category_id) {
        dispatch(
          setSelectedCategory({
            id: updateProduct.category_id,
            name: updateProduct.category_name,
          })
        );
        dispatch(
          editProduct({
            category_id: updateProduct.category_id,
            category_name: updateProduct.category_name,
          })
        );

        dispatch(fetchSubcategories(updateProduct.category_id)).then(() => {
          if (updateProduct.subcategory_id) {
            dispatch(
              setSelectedSubcategory({
                id: updateProduct.subcategory_id,
                name: updateProduct.subcategory_name,
              })
            );
            dispatch(
              editProduct({
                Subcategory_id: updateProduct.subcategory_id,
                Subcategory_name: updateProduct.subcategory_name,
              })
            );
          }
        });
      }
    });
  }, [dispatch, isEditMode]);

  const handleCategorySelect = (category) => {
    if (selectedCategory?.id === category.category_id) {
      dispatch(setSelectedCategory(null));
      dispatch(setSelectedSubcategory(null));
      dispatch(
        updateNewProduct({
          category_id: "",
          Subcategory_id: "",
        })
      );
    } else {
      dispatch(fetchSubcategories(category.category_id));
      dispatch(
        setSelectedCategory({
          id: category.category_id,
          name: category.category_name,
        })
      );
      dispatch(setSelectedSubcategory(null));
      dispatch(
        updateNewProduct({
          category_id: category.category_id,
          Subcategory_id: "",
          category_name: category.category_name,
        })
      );
    }
  };

  const handleSubcategorySelect = (subcategory) => {
    dispatch(
      setSelectedSubcategory({
        id: subcategory.Subcategory_id,
        name: subcategory.Subcategory_name,
      })
    );
    dispatch(
      updateNewProduct({
        Subcategory_id: subcategory.Subcategory_id,
        Subcategory_name: subcategory.Subcategory_name,
      })
    );
  };

  const editCategorySelect = (category) => {
    if (selectedCategory?.id === category.category_id) {
      dispatch(setSelectedCategory(null));
      dispatch(setSelectedSubcategory(null));
      dispatch(
        editProduct({
          category_id: "",
          Subcategory_id: "",
        })
      );
    } else {
      dispatch(fetchSubcategories(category.category_id));
      dispatch(
        setSelectedCategory({
          id: category.category_id,
          name: category.category_name,
        })
      );
      dispatch(setSelectedSubcategory(null));
      dispatch(
        editProduct({
          category_id: category.category_id,
          Subcategory_id: "",
          category_name: category.category_name,
        })
      );
    }
  };

  const editSubcategorySelect = (subcategory) => {
    dispatch(
      setSelectedSubcategory({
        id: subcategory.Subcategory_id,
        name: subcategory.Subcategory_name,
      })
    );
    dispatch(
      editProduct({
        Subcategory_id: subcategory.Subcategory_id,
        Subcategory_name: subcategory.Subcategory_name,
      })
    );
  };

  const renderSubcategoryLabel = (sub) => {
    const selectedCat = categories.find(
      (cat) => cat.category_id === category_id
    );
    if (selectedCat?.category_name === "Ethnic Wear") {
      return `${sub.Subcategory_name} - ${sub.gender || "Unisex"}`;
    }
    return sub.Subcategory_name;
  };

  return (
    <div className="categories-container">
      <h2>Categories & Subcategories</h2>

      {isLoading ? (
        <p>Loading Categories...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <>
          {isEditMode ? (
            <div className="categories-list">
              {categories.map((category) => (
                <div key={category.category_id} className="category-item">
                  <label>
                    <input
                      type="radio"
                      name="category"
                      checked={category_id === category.category_id}
                      onChange={() => editCategorySelect(category)}
                    />{" "}
                    {category.category_name}
                  </label>

                  {category_id === category.category_id && (
                    <div className="subcategories-list">
                      {subcategories[category.category_id]?.length > 0 ? (
                        subcategories[category.category_id].map((sub) => (
                          <label
                            key={sub.Subcategory_id}
                            className="subcategory-item"
                          >
                            <input
                              type="radio"
                              name="subcategory"
                              checked={Subcategory_id === sub.Subcategory_id}
                              onChange={() => editSubcategorySelect(sub)}
                            />{" "}
                            {renderSubcategoryLabel(sub)}
                          </label>
                        ))
                      ) : (
                        <p>No subcategories found</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="categories-list">
              {categories.map((category) => (
                <div key={category.category_id} className="category-item">
                  <label>
                    <input
                      type="radio"
                      name="category"
                      checked={category_id === category.category_id}
                      onChange={() => handleCategorySelect(category)}
                    />{" "}
                    {category.category_name}
                  </label>

                  {category_id === category.category_id && (
                    <div className="subcategories-list">
                      {subcategories[category.category_id]?.length > 0 ? (
                        subcategories[category.category_id].map((sub) => (
                          <label
                            key={sub.Subcategory_id}
                            className="subcategory-item"
                          >
                            <input
                              type="radio"
                              name="subcategory"
                              checked={Subcategory_id === sub.Subcategory_id}
                              onChange={() => handleSubcategorySelect(sub)}
                            />{" "}
                            {renderSubcategoryLabel(sub)}
                          </label>
                        ))
                      ) : (
                        <p>No subcategories found</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Categories;
