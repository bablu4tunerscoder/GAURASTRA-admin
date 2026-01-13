import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  useFetchProductsQuery,
  useDeleteProductByIdMutation,
  setEditMode,
} from "../Redux/Slices/productSlice";
import { useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import imgg from "../assets/placehold.png";

const ProductTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // RTK Query hooks
  const { data: products = [], isLoading, isError, error } = useFetchProductsQuery();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductByIdMutation();

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All products");
  const [genderFilter, setGenderFilter] = useState("");

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error?.data?.message || "Failed to load products"}</p>;

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProducts(products.map((product) => product.id));
    } else {
      setSelectedProducts([]);
    }
  };

  async function onProductDelete(id) {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id).unwrap();
        // No need to manually refetch - RTK Query auto-refetches due to cache invalidation
      } catch (err) {
        console.error("Failed to delete product:", err);
        alert("Failed to delete product. Please try again.");
      }
    }
  }

  function handleEditClick(id) {
    dispatch(setEditMode(true));
    navigate(`/edit-product/${id}`);
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
    <div className="w-full">
      <div className="bg-white shadow rounded-lg p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Products <span className="text-gray-500">({filteredProducts.length})</span>
          </h1>
          <button
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
            onClick={handleNewProductClick}
          >
            + New Product
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div className="flex gap-2 items-center">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setGenderFilter("");
              }}
              className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>All products</option>
              <option>Ethnic Wear</option>
              <option>Gaurastra products</option>
            </select>

            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
<<<<<<< HEAD
=======
              className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
>>>>>>> 7406ecfdb1b496bf8f9af7b0d29d04cb3b66a3a6
            >
              <option value="">All Genders</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
            </select>
          </div>

          <div className="flex gap-2 items-center">
            <button
              onClick={() => {
                setSelectedCategory("All products");
                setGenderFilter("");
                setSearchQuery("");
              }}
<<<<<<< HEAD
              className="btn-filter-gh"
=======
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition"
>>>>>>> 7406ecfdb1b496bf8f9af7b0d29d04cb3b66a3a6
            >
              Clear All
            </button>

            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full rounded-lg overflow-hidden">
            <thead className="bg-gray-600">
              <tr>
                <th className="px-4 py-3 text-white font-medium text-left">Product</th>
                <th className="px-4 py-3 text-white font-medium text-left">SKU</th>
                <th className="px-4 py-3 text-white font-medium text-left">
                  Original Price
                </th>
                <th className="px-4 py-3 text-white font-medium text-left">
                  Discounted Price
                </th>
                <th className="px-4 py-3 text-white font-medium text-center">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((product) => {
                const primaryImage =
                  product.images?.find((img) => img.is_primary)?.image_url || imgg;

                return (
                  <tr
                    key={product.product_id}
                    className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <td className="px-4 py-3 flex items-center gap-3">
                      <img
                        src={primaryImage}
                        alt={product.product_name}
                        loading="lazy"
                        decoding="async"
                        className="w-12 h-12 object-cover rounded"
                      />
                      <span>{product.product_name || "No Name"}</span>
                    </td>

                    <td className="px-4 py-3">
                      {product?.latest_pricing?.sku || "N/A"}
                    </td>

                    <td className="px-4 py-3">
                      ₹
                      {product?.latest_pricing?.price_detail?.original_price?.toFixed(
                        2
                      ) || "0.00"}
                    </td>

                    <td className="px-4 py-3">
                      ₹
                      {product?.latest_pricing?.price_detail?.discounted_price?.toFixed(
                        2
                      ) || "0.00"}
                    </td>

                    <td className="px-4 py-3 flex justify-center gap-2">
                      <button
                        className="px-3 py-1 bg-blue-500 text-white border border-blue-500 rounded hover:bg-blue-600 hover:border-blue-600 text-sm"
                        onClick={() => handleEditClick(product.product_id)}
                        disabled={isDeleting}
                      >
                        Edit
                      </button>
                      <button
                        className="px-3 py-1 bg-red-500 text-white border border-red-500 rounded hover:bg-red-600 hover:border-red-600 text-sm disabled:opacity-50"
                        onClick={() => onProductDelete(product.product_id)}
                        disabled={isDeleting}
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>


  );
};

export default ProductTable;