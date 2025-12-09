import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  setEditMode,
  deleteProductById,
  fetchProductById,
} from "../Redux/Slices/productSlice";
import "./product.scss";
import { useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Sidebar from "../Components/Sidebar/sidebar";
import imgg from "../assets/placehold.png";

const ProductTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { products, status, error } = useSelector((state) => state.product);

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All products");
  const [genderFilter, setGenderFilter] = useState("");
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (status === "loading") return <p>Loading...</p>;
  if (status === "failed") return <p>Error: {error}</p>;

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProducts(products.map((product) => product.id));
    } else {
      setSelectedProducts([]);
    }
  };

  async function onProductDelete(id) {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await dispatch(deleteProductById(id));
      await dispatch(fetchProducts());
    }
  }

  async function handleEditClick(id) {
    localStorage.setItem("ProductId", id);
    await dispatch(fetchProductById(id));
    dispatch(setEditMode(true));
    navigate("/NewProduct");
  }

  const handleSelectProduct = (id) => {
    setSelectedProducts((prev) =>
      prev.includes(id)
        ? prev.filter((productId) => productId !== id)
        : [...prev, id]
    );
  };

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  const filteredProducts = products.filter((product) => {
  const matchSearch = product.product_name
    ?.toLowerCase()
    .includes(searchQuery.toLowerCase());

  const matchCategory =
    selectedCategory === "All products"
      ? true
      : selectedCategory === "Ethnic Wear"
      ? product.category?.category_name === "Ethnic Wear"
      : selectedCategory === "Gaurastra products"
      ? product.category?.category_name !== "Ethnic Wear"
      : true;

  const matchGender =
    genderFilter === ""
      ? true
      : product.attributes?.gender === genderFilter;

  return matchSearch && matchCategory && matchGender;
});

  const handleNewProductClick = () => {
    dispatch(setEditMode(false));
    navigate("/NewProduct");
  };
  return (
    <div className="dashsidebar" style={{ display: "flex" }}>
      <Sidebar />
      <div className="product-table-container-gh">
        <div className="table-header-gh">
          <div className="header-left-gh">
            <h3>
              Products <span>{filteredProducts.length}</span>
            </h3>
          </div>
          <div className="header-right-gh">
            <button
              className="btn-new-product-gh"
              onClick={handleNewProductClick}
            >
              + New Product
            </button>
          </div>
        </div>

        <div className="header-row-gh">
          <div className="filter-options-gh">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value)
                setGenderFilter("");
              }}
            >
              <option>All products</option>
              <option>Ethnic Wear</option>
              <option>Gaurastra products</option>
            </select>
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
            >
              <option value="">All Genders</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
            </select>
          </div>
          <div className="filter-search-gh">
                        <button
              onClick={() => {
                setSelectedCategory("All products");
                setGenderFilter("");
                setSearchQuery("");
              }}
              className="btn-filter-gh"
            >
              Clear All
            </button>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <table className="product-table-gh">
          <thead>
            <tr>
              <th>Name</th>
              <th>SKU</th>
              <th>Original Price</th>
              <th>Discounted Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => {
              const primaryImage =
                product.images?.find((img) => img.is_primary)?.image_url ||
                imgg;

              return (
                <tr key={product.id}>
                  <td>
                    <img
                      src={primaryImage}
                      alt={product.product_name}
                      width="50"
                    />
                    <span>{product.product_name || "No Name"}</span>
                  </td>
                  <td>{product?.latest_pricing?.sku || "N/A"}</td>
                  <td>
                    ₹
                    {product?.latest_pricing?.price_detail?.original_price?.toFixed(
                      2
                    ) || "0.00"}
                  </td>
                  <td>
                    ₹
                    {product?.latest_pricing?.price_detail?.discounted_price?.toFixed(
                      2
                    ) || "0.00"}
                  </td>
                  <td>
                    <div className="action-buttons-gh">
                      <button
                        className="edit-btn-gh"
                        onClick={() => {
                          handleEditClick(product.product_id);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn-gh"
                        onClick={() => {
                          onProductDelete(product.product_id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;
