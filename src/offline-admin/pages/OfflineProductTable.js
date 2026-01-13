import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { FaEdit, FaTrash } from "react-icons/fa";
<<<<<<< HEAD
import { FaChevronRight, FaChevronDown } from "react-icons/fa";

=======
import imgg from "../../assets/placehold.png";

import {
    useFetchOfflineProductsQuery,
    useDeleteOfflineProductMutation,
    useUpdateOfflineProductMutation,
} from "../../Redux/Slices/offlineProductSlice";
>>>>>>> 7406ecfdb1b496bf8f9af7b0d29d04cb3b66a3a6

const OfflineProductTable = () => {
    const navigate = useNavigate();
    const [expandedId, setExpandedId] = useState(null);
    const [search, setSearch] = useState("");

    const { data: products = [], isLoading } = useFetchOfflineProductsQuery();
    const [deleteProduct] = useDeleteOfflineProductMutation();
    const [updateProduct, { isLoading: saving }] =
        useUpdateOfflineProductMutation();

    const { control, reset, handleSubmit } = useForm({
        defaultValues: { variants: [] },
    });

    const { fields } = useFieldArray({
        control,
        name: "variants",
    });

    const toggleRow = (product) => {
        if (expandedId === product._id) {
            setExpandedId(null);
        } else {
            setExpandedId(product._id);
            reset({ variants: product.variants });
        }
    };

    const onSave = async (product, data) => {
        const variants = data.variants.map((v) => ({
            ...v,
            stock: Number(v.stock),
            actual_price: Number(v.actual_price),
            offer: Number(v.offer),
            discounted_price:
                v.offer_type === "percentage"
                    ? v.actual_price - (v.actual_price * v.offer) / 100
                    : v.actual_price - v.offer,
        }));

        await updateProduct({
            unique_id: product.unique_id,
<<<<<<< HEAD
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
=======
            updateData: {
                title: product.title,
                images: product.images,
                variants,
            },
        }).unwrap();

        setExpandedId(null);
    };

    const handlePrintQR = (src) => {
        const w = window.open("", "_blank");
        w.document.write(`<img src="${src}" style="width:200px;margin:auto;display:block" />`);
        w.print();
>>>>>>> 7406ecfdb1b496bf8f9af7b0d29d04cb3b66a3a6
    };

    const filtered = products.filter((p) =>
        p.title?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="bg-white rounded-xl shadow p-6">

                {/* HEADER */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">
                        Offline Products <span className="text-gray-500">({filtered.length})</span>
                    </h2>

                    <button
                        onClick={() => navigate("/AddProduct")}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        + Add Product
                    </button>
                </div>

                {/* SEARCH */}
                <div className="flex gap-3 mb-4">
                    <input
                        placeholder="Search product..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border rounded px-4 py-2 w-64"
                    />
                    <button
                        onClick={() => setSearch("")}
                        className="border px-4 py-2 rounded"
                    >
                        Clear
                    </button>
                </div>

<<<<<<< HEAD
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
=======
                {/* TABLE */}
                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b text-left">
                                <th className="p-3">Product</th>
                                <th>Price</th>
                                <th>Discounted</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filtered.map((product) => {
                                const first = product.variants?.[0] || {};
                                return (
                                    <React.Fragment key={product._id}>
                                        {/* MAIN ROW */}
                                        <tr
                                            onClick={() => toggleRow(product)}
                                            className="border-b hover:bg-gray-50 cursor-pointer"
                                        >
                                            <td className="p-3 flex items-center gap-3">
                                                <img
                                                    src={product.images?.[0] || imgg}
                                                    className="w-10 h-10 rounded object-cover"
>>>>>>> 7406ecfdb1b496bf8f9af7b0d29d04cb3b66a3a6
                                                />
                                                {product.title}
                                            </td>

                                            <td>₹{first.actual_price || "—"}</td>
                                            <td>₹{first.discounted_price || "—"}</td>

<<<<<<< HEAD
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
=======
                                            <td>
                                                <div className="flex gap-3">
                                                    <FaEdit
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate("/AddProduct", { state: { product } });
                                                        }}
                                                        className="text-blue-600 cursor-pointer"
                                                    />
                                                    <FaTrash
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (window.confirm("Delete product?")) {
                                                                deleteProduct(product._id);
                                                            }
                                                        }}
                                                        className="text-red-600 cursor-pointer"
                                                    />
                                                </div>
>>>>>>> 7406ecfdb1b496bf8f9af7b0d29d04cb3b66a3a6
                                            </td>
                                        </tr>

                                        {/* EXPANDED ROW */}
                                        {expandedId === product._id && (
                                            <tr>
                                                <td colSpan="4" className="bg-gray-50 p-4">
                                                    <form
                                                        onSubmit={handleSubmit((d) => onSave(product, d))}
                                                        className="space-y-4"
                                                    >
                                                        {fields.map((v, idx) => (
                                                            <div
                                                                key={v.id}
                                                                className="flex justify-between gap-4 border p-4 rounded bg-white"
                                                            >
                                                                <div className="grid grid-cols-3 gap-3 flex-1">
                                                                    <input {...control.register(`variants.${idx}.color`)} className="input" placeholder="Color" />
                                                                    <input {...control.register(`variants.${idx}.size`)} className="input" placeholder="Size" />
                                                                    <input type="number" {...control.register(`variants.${idx}.stock`)} className="input" placeholder="Stock" />
                                                                    <input type="number" {...control.register(`variants.${idx}.actual_price`)} className="input" placeholder="Price" />
                                                                    <input type="number" {...control.register(`variants.${idx}.offer`)} className="input" placeholder="Offer" />
                                                                    <select {...control.register(`variants.${idx}.offer_type`)} className="input">
                                                                        <option value="percentage">%</option>
                                                                        <option value="flat">Flat</option>
                                                                    </select>
                                                                </div>

                                                                <div className="text-center">
                                                                    {v.qrcode_url ? (
                                                                        <>
                                                                            <img src={v.qrcode_url} className="w-20 mx-auto" />
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => handlePrintQR(v.qrcode_url)}
                                                                                className="text-blue-600 text-sm mt-2"
                                                                            >
                                                                                Print QR
                                                                            </button>
                                                                        </>
                                                                    ) : (
                                                                        <p className="text-gray-400">No QR</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}

                                                        <button
                                                            type="submit"
                                                            disabled={saving}
                                                            className="bg-green-600 text-white px-6 py-2 rounded"
                                                        >
                                                            {saving ? "Saving..." : "Save Changes"}
                                                        </button>
                                                    </form>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default OfflineProductTable;
