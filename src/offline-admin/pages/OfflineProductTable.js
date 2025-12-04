import React, { useState, useEffect } from "react";
import "./offlineProduct.scss";
import imgg from "../../assets/placehold.png";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOfflineProducts,deleteOfflineProduct } from "../../Redux/Slices/offlineProductSlice";
import { FaEdit, FaTrash } from "react-icons/fa";

const OfflineProductTable = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { products = [], loading } = useSelector(
        (state) => state.offlineProducts
    );



    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        dispatch(fetchOfflineProducts());
    }, [dispatch]);

    // ───────── FILTER LOGIC ─────────
    const filteredProducts = products.filter((product) => {
        const matchSearch = product.title
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase());

        return matchSearch;
    });
    const handleDelete = (id) => {
        if (window.confirm("Are you sure want to delete this product?")) {
            dispatch(deleteOfflineProduct(id));
        }
    };
    return (
        <div className="offline-container">
            <div className="offline-header">
                <h3>
                    Offline Products <span>{filteredProducts.length}</span>
                </h3>

                <button className="btn-add-offline" 
                onClick={()=> navigate("/AddProduct")}> + Add Offline Product</button>
            </div>

            <div className="offline-filters">
                <div className="filter-right">
                    <button
                        onClick={() => setSearchQuery("")}
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

            {loading ? (
                <p className="loading-text">Loading products...</p>
            ) : (
                <table className="offline-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Original Price</th>
                            <th>Discounted Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredProducts.map((product) => {
                            const primaryImage = product.images?.[0] || imgg;

                            const firstVariant = product.variants?.[0] || {};

                            return (
                                <tr key={product._id}>
                                    <td className="name-col">
                                        <img src={primaryImage} alt="img" className="prod-img" />
                                        <span>{product.title}</span>
                                    </td>

                                    <td>₹{firstVariant.actual_price || "N/A"}</td>

                                    <td>₹{firstVariant.discounted_price || "N/A"}</td>

                                    <td>
                                        <div className="action-box">
                                            <FaEdit
                                                className="icon-edit"
                                                onClick={() =>
                                                    navigate("/AddProduct", {
                                                        state: { product },
                                                    })
                                                }
                                            />

                                            <FaTrash
                                                className="icon-delete"
                                                onClick={() => handleDelete(product._id)}
                                            />

                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default OfflineProductTable;
