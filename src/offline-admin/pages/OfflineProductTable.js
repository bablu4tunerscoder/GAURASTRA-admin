import React, { useState, useEffect } from "react";
import "./offlineProduct.scss";
import imgg from "../../assets/placehold.png";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOfflineProducts, deleteOfflineProduct, updateOfflineProduct } from "../../Redux/Slices/offlineProductSlice";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FaChevronRight, FaChevronDown } from "react-icons/fa";


const OfflineProductTable = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [expandedRow, setExpandedRow] = useState(null);
    const [editableVariants, setEditableVariants] = useState({});

    const { products = [], loading } = useSelector(
        (state) => state.offlineProducts
    );

    const toggleRow = (id, variants) => {
        if (expandedRow === id) {
            setExpandedRow(null);
        } else {
            setExpandedRow(id);
            setEditableVariants((prev) => ({
                ...prev,
                [id]: variants
            }));
        }
    };


    const handleVariantChange = (productId, idx, field, value) => {
        setEditableVariants((prev) => ({
            ...prev,
            [productId]: prev[productId].map((v, i) =>
                i === idx ? { ...v, [field]: value } : v
            )
        }));
    };
    const handleSave = (product) => {
        const updatedVariantData = editableVariants[product._id].map(v => ({
            color: v.color,
            size: v.size,
            stock: Number(v.stock),
            actual_price: Number(v.actual_price),
            discounted_price: Number(
                v.offer_type === "percentage"
                    ? v.actual_price - (v.actual_price * v.offer) / 100
                    : v.actual_price - v.offer
            ),
            offer: Number(v.offer),
            offer_type: v.offer_type
        }));

        const updateData = {
            title: product.title,
            images: product.images,
            variants: updatedVariantData,
        };

        dispatch(updateOfflineProduct({
            unique_id: product.unique_id,
            updateData
        })).then(() => {
            setTimeout(() => {
                window.location.reload();
            }, 500);
        });
    };


    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        dispatch(fetchOfflineProducts());
    }, [dispatch]);

    const filteredProducts = (products || []).filter((product) => {
        if (!product || !product.title) return false;

        return product.title.toLowerCase().includes(searchQuery.toLowerCase());
    });


    const handleDelete = (id) => {
        if (window.confirm("Are you sure want to delete this product?")) {
            dispatch(deleteOfflineProduct(id));
        }
    };

    const handlePrintQR = (url) => {
        const printWindow = window.open("", "_blank", "width=400,height=400");

        printWindow.document.write(`
    <html>
      <head><title>Print QR</title></head>
      <body style="display:flex;justify-content:center;align-items:center;height:100vh;margin:0;">
        <img id="printQR" src="${url}" style="width:200px;height:200px;" />
      </body>
    </html>
  `);

        printWindow.document.close();

        printWindow.onload = () => {
            const img = printWindow.document.getElementById("printQR");
            img.onload = () => printWindow.print();
        };
    };

    return (
        <div className="offline-container">
            <div className="offline-header">
                <h3>
                    Offline Products <span>{filteredProducts.length}</span>
                </h3>

                <button className="btn-add-offline"
                    onClick={() => navigate("/AddProduct")}> + Add Offline Product</button>
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
                            <th>Product Name</th>
                            <th>Total Stock</th>
                            <th>Discounted Price</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map((product) => {
                            const firstVariant = product.variants?.[0] || {};

                            return (
                                <>
                                    <tr key={product._id} onClick={() => toggleRow(product._id, product.variants)}>
                                        <td data-label="Product Name" className="name-col arrow-col">
                                            <span className="arrow-icon">
                                                {expandedRow === product._id ? (
                                                    <FaChevronDown />
                                                ) : (
                                                    <FaChevronRight />
                                                )}
                                            </span>
                                            <span>{product.title}</span>
                                        </td>


                                        <td data-label="Total Stock">₹{firstVariant.stock || "N/A"}</td>
                                        <td data-label="Discounted Price">₹{firstVariant.discounted_price || "N/A"}</td>
                                        <td data-label="Status">{product.active ? "Active" : "Inactive"}</td>


                                        <td data-label="Actions">
                                            <div className="action-box">
                                                <FaEdit
                                                    className="icon-edit"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate("/AddProduct", { state: { product } });
                                                    }}
                                                />

                                                <FaTrash
                                                    className="icon-delete"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(product._id);
                                                    }}
                                                />
                                            </div>
                                        </td>
                                    </tr>

                                    {expandedRow === product._id && (
                                        <tr className="variant-row">
                                            <td colSpan="4">
                                                <div className="variant-header">
                                                    <span>Color</span>
                                                    <span>Size</span>
                                                    <span>Stock</span>
                                                    <span>Actual Price</span>
                                                    <span>Offer</span>
                                                    <span>Offer Type</span>
                                                    <span>QR</span>
                                                </div>
                                                {editableVariants[product._id]?.map((v, idx) => (
                                                    <div key={idx} className="variant-box-row">

                                                        <div className="variant-inline">
                                                            <input
                                                                type="text"
                                                                className="input"
                                                                placeholder="Color"
                                                                value={v.color}
                                                                onChange={(e) =>
                                                                    handleVariantChange(product._id, idx, "color", e.target.value)
                                                                }
                                                            />

                                                            <input
                                                                type="text"
                                                                className="input"
                                                                placeholder="Size"
                                                                value={v.size}
                                                                onChange={(e) =>
                                                                    handleVariantChange(product._id, idx, "size", e.target.value)
                                                                }
                                                            />

                                                            <input
                                                                type="number"
                                                                className="input"
                                                                placeholder="Stock"
                                                                value={v.stock}
                                                                onChange={(e) =>
                                                                    handleVariantChange(product._id, idx, "stock", e.target.value)
                                                                }
                                                            />

                                                            <input
                                                                type="number"
                                                                className="input"
                                                                placeholder="Actual Price"
                                                                value={v.actual_price}
                                                                onChange={(e) =>
                                                                    handleVariantChange(product._id, idx, "actual_price", e.target.value)
                                                                }
                                                            />

                                                            <input
                                                                type="number"
                                                                className="input"
                                                                placeholder="Offer"
                                                                value={v.offer}
                                                                onChange={(e) =>
                                                                    handleVariantChange(product._id, idx, "offer", e.target.value)
                                                                }
                                                            />

                                                            {/* OFFER TYPE = ₹ / % */}
                                                            <select
                                                                className="input"
                                                                value={v.offer_type}
                                                                onChange={(e) =>
                                                                    handleVariantChange(product._id, idx, "offer_type", e.target.value)
                                                                }
                                                            >
                                                                <option value="percentage">%</option>
                                                                <option value="flat">₹</option>
                                                            </select>

                                                            {/* PRINT ICON */}
                                                            <span
                                                                className="print-icon"
                                                                onClick={() => handlePrintQR(v.qrcode_url)}
                                                            >
                                                                🖨️
                                                            </span>

                                                            {/* UPDATE BUTTON */}
                                                            <button
                                                                className="btn-update"
                                                                onClick={() => handleSave(product)}
                                                            >
                                                                Update
                                                            </button>

                                                        </div>

                                                    </div>
                                                ))}
                                            </td>
                                        </tr>
                                    )}

                                </>
                            );
                        })}
                    </tbody>

                </table>
            )}
        </div>
    );
};

export default OfflineProductTable;
