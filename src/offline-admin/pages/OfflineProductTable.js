import React, { useState, useEffect } from "react";
import "./offlineProduct.scss";
import imgg from "../../assets/placehold.png";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOfflineProducts, deleteOfflineProduct, updateOfflineProduct } from "../../Redux/Slices/offlineProductSlice";
import { FaEdit, FaTrash } from "react-icons/fa";

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
                window.location.reload();   // 🔥 Page reload after update
            }, 500);
        });
    };


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
                                <>
                                    {/* MAIN ROW */}
                                    <tr key={product._id} onClick={() => toggleRow(product._id, product.variants)}>
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
                                                {editableVariants[product._id]?.map((v, idx) => (
                                                    <div key={idx} className="variant-box">

                                                        {/* LEFT SIDE FORM (Two Rows of 3 Inputs) */}
                                                        <div className="variant-left">

                                                            <div className="grid-3">
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
                                                            </div>

                                                            <div className="grid-3">
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

                                                                <select
                                                                    className="input"
                                                                    value={v.offer_type}
                                                                    onChange={(e) =>
                                                                        handleVariantChange(product._id, idx, "offer_type", e.target.value)
                                                                    }
                                                                >
                                                                    <option value="percentage">Percentage</option>
                                                                    <option value="flat">Flat</option>
                                                                </select>
                                                            </div>

                                                        </div>

                                                        {/* RIGHT SIDE QR BOX */}
                                                        <div className="qr-section">
                                                            {v.qrcode_url ? (
                                                                <>
                                                                    <img src={v.qrcode_url} alt="QR" className="qr-img" />
                                                                    <button
                                                                        type="button"
                                                                        className="print-btn"
                                                                        onClick={() => handlePrintQR(v.qrcode_url)}
                                                                    >
                                                                        Print QR
                                                                    </button>
                                                                </>
                                                            ) : (
                                                                <p>No QR</p>
                                                            )}
                                                        </div>
                                                    </div>

                                                ))}

                                                {/* SAVE BUTTON */}
                                                <button
                                                    className="btn-save"
                                                    onClick={() => handleSave(product)}
                                                >
                                                    Save Changes
                                                </button>
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
