import React, { useState, useEffect } from "react";
import "./offlineProduct.scss";
import imgg from "../../assets/placehold.png";
import { useNavigate } from "react-router-dom";
import OfflineSidebar from "../components/OfflineSidebar";

const OfflineProductTable = () => {
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [genderFilter, setGenderFilter] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All products");
    const navigate = useNavigate();

    useEffect(() => {
        const dummy = [
            {
                id: 1,
                product_name: "Offline Kurta",
                category: { category_name: "Ethnic Wear" },
                attributes: { gender: "Men" },
                latest_pricing: {
                    sku: "SKU-101",
                    price_detail: { original_price: 999, discounted_price: 799 },
                },
                images: [{ image_url: imgg, is_primary: true }],
            },
        ];
        setProducts(dummy);
    }, []);

    const filteredProducts = products.filter((product) => {
        const matchSearch = product.product_name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase());

        const matchCategory =
            selectedCategory === "All products"
                ? true
                : selectedCategory === "Ethnic Wear"
                    ? product.category?.category_name === "Ethnic Wear"
                    : selectedCategory === "Offline Items"
                        ? product.category?.category_name !== "Ethnic Wear"
                        : true;

        const matchGender =
            genderFilter === "" ? true : product.attributes?.gender === genderFilter;

        return matchSearch && matchCategory && matchGender;
    });

    return (
        <div className="offline-layout">
      <OfflineSidebar/>
            <div className="offline-container">

                <div className="offline-header">
                    <h3>
                        Offline Products <span>{filteredProducts.length}</span>
                    </h3>

                    <button className="btn-add-offline">+ Add Offline Product</button>
                </div>

                <div className="offline-filters">
                    <div className="filter-left">
                        <select
                            value={selectedCategory}
                            onChange={(e) => {
                                setSelectedCategory(e.target.value);
                                setGenderFilter("");
                            }}
                        >
                            <option>All products</option>
                            <option>Ethnic Wear</option>
                            <option>Offline Items</option>
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

                    <div className="filter-right">
                        <button
                            onClick={() => {
                                setSelectedCategory("All products");
                                setGenderFilter("");
                                setSearchQuery("");
                            }}
                            className="btn-clear"
                        >
                            Clear
                        </button>

                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <table className="offline-table">
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
                                        <img src={primaryImage} alt="img" />
                                        <span>{product.product_name}</span>
                                    </td>

                                    <td>{product?.latest_pricing?.sku || "N/A"}</td>
                                    <td>₹{product.latest_pricing?.price_detail?.original_price}</td>
                                    <td>
                                        ₹{product.latest_pricing?.price_detail?.discounted_price}
                                    </td>

                                    <td>
                                        <div className="action-box">
                                            <button
                                                className="btn-edit"
                                                onClick={() =>
                                                    navigate("/AddProduct", { state: { product } })
                                                }
                                            >
                                                Edit
                                            </button>
                                            <button className="btn-delete">Delete</button>
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

export default OfflineProductTable;
