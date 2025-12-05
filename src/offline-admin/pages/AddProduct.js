import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { createOfflineProduct, updateOfflineProduct } from "../../Redux/Slices/offlineProductSlice";
import "./AddProduct.scss";

const AddProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const productToEdit = location.state?.product;

  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [images, setImages] = useState([]);
  const [active, setActive] = useState(true);
  const productUniqueId = productToEdit?.unique_id;

  const [variants, setVariants] = useState([
    {
      color: "",
      size: "",
      stock: "",
      actual_price: "",
      offer: "",
      offer_type: "percentage"
    }
  ]);

  useEffect(() => {
    if (productToEdit) {
      setTitle(productToEdit.title);
      setDetails(productToEdit.details);
      setImages(productToEdit.images || []);
      setActive(productToEdit.active);
      setVariants(productToEdit.variants?.map(v => ({
        color: v.color || "",
        size: v.size || "",
        stock: v.stock || "",
        actual_price: v.actual_price || "",
        offer: v.offer || "",
        offer_type: v.offer_type || "percentage",
        qrcode_url: v.qrcode_url || ""
      })) || [{
        color: "",
        size: "",
        stock: "",
        actual_price: "",
        offer: "",
        offer_type: "percentage",
        qrcode_url: ""
      }]);
    }
  }, [productToEdit]);


  // ADD IMAGE URL
  const addImageUrl = () => {
    if (imageUrl.trim() !== "") {
      setImages([...images, imageUrl]);
      setImageUrl("");
    }
  };

  // ADD VARIANT
  const addVariant = () => {
    setVariants([
      ...variants,
      {
        color: "",
        size: "",
        stock: "",
        actual_price: "",
        offer: "",
        offer_type: "percentage"
      }
    ]);
  };

  // REMOVE VARIANT
  const removeVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  // HANDLE VARIANT CHANGE
  const handleVariantChange = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formattedVariants = variants.map(v => ({
      ...v,
      stock: Number(v.stock),
      actual_price: Number(v.actual_price),
      offer: Number(v.offer)
    }));

    const finalData = {
      title,
      details,
      images,
      active,
      variants: formattedVariants,
    };

    if (productToEdit) {
      // UPDATE PRODUCT
      dispatch(updateOfflineProduct({ unique_id: productUniqueId, updateData: finalData }))
        .unwrap()
        .then(() => {
          alert("Product Updated Successfully!");
          navigate("/OffProductTable"); // back to table
        })
        .catch(err => alert("Error: " + err));
    } else {
      dispatch(createOfflineProduct(finalData))
        .unwrap()
        .then((res) => {
          alert("Product Created Successfully!");
          console.log("Response:", res);

          // form reset
          setTitle("");
          setDetails("");
          setImages([]);
          setVariants([
            {
              color: "",
              size: "",
              stock: "",
              actual_price: "",
              offer: "",
              offer_type: "percentage",
            },
          ]);
        })
        .catch(err => alert("Error: " + err));
    }
  };
  useEffect(() => {
    console.log("Editing product:", productToEdit);
    console.log("Product ID:", productToEdit?._id);
  }, [productToEdit]);

const handlePrintQR = (index) => {
  const qrImage = document.getElementById(`qr-${index}`).src;

  const printWindow = window.open("", "_blank", "width=400,height=400");
  printWindow.document.write(`
    <html>
      <head>
        <title>Print QR</title>
      </head>
      <body style="display:flex;justify-content:center;align-items:center;height:100vh;">
        <img src="${qrImage}" style="width:200px;height:200px;object-fit:contain;" />
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.print();
};

  return (
    <div className="add-product-container">
      <h1 className="heading">{productToEdit ? "Edit Product" : "Add New Product"}</h1>

      <div className="form-box">
        <form onSubmit={handleSubmit}>

          {/* PRODUCT TITLE */}
          <label>Product Title</label>
          <input
            type="text"
            className="input"
            placeholder="Enter product name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* DESCRIPTION */}
          <label>Description</label>
          <textarea
            className="textarea"
            rows="4"
            placeholder="Write full description..."
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />

          {/* IMAGE URL */}
          <label>Product Images (URL)</label>
          <div className="image-url-box">
            <input
              type="text"
              className="input"
              placeholder="Enter image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            <button type="button" className="btn-outline" onClick={addImageUrl}>
              Add
            </button>
          </div>

          {/* PREVIEW GRID */}
          <div className="image-preview-grid">
            {images.map((img, idx) => (
              <img key={idx} src={img} className="preview-img" alt="" />
            ))}
          </div>

          {/* STATUS */}
          <label>Status</label>
          <select
            className="input"
            value={active ? "true" : "false"}
            onChange={(e) => setActive(e.target.value === "true")}
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>


          {/* VARIANTS */}
          <div className="variant-header">
            <h2>Product Variants</h2>
          </div>
          {variants.map((v, idx) => (
            <div key={idx} className="variant-box">

              {/* LEFT SIDE INPUTS */}
              <div>
                <div className="grid-3">
                  <input
                    type="text"
                    className="input"
                    placeholder="Color"
                    value={v.color}
                    onChange={(e) => handleVariantChange(idx, "color", e.target.value)}
                  />

                  <input
                    type="text"
                    className="input"
                    placeholder="Size"
                    value={v.size}
                    onChange={(e) => handleVariantChange(idx, "size", e.target.value)}
                  />

                  <input
                    type="number"
                    className="input"
                    placeholder="Stock"
                    value={v.stock}
                    onChange={(e) => handleVariantChange(idx, "stock", e.target.value)}
                  />
                </div>

                <div className="grid-3">
                  <input
                    type="number"
                    className="input"
                    placeholder="Actual Price"
                    value={v.actual_price}
                    onChange={(e) => handleVariantChange(idx, "actual_price", e.target.value)}
                  />

                  <input
                    type="number"
                    className="input"
                    placeholder="Offer Price"
                    value={v.offer}
                    onChange={(e) => handleVariantChange(idx, "offer", e.target.value)}
                  />

                  <select
                    className="input"
                    value={v.offer_type}
                    onChange={(e) => handleVariantChange(idx, "offer_type", e.target.value)}
                  >
                    <option value="percentage">Percentage</option>
                    <option value="flat">Flat</option>
                  </select>
                </div>

                {variants.length > 1 && (
                  <button
                    className="btn-danger"
                    type="button"
                    onClick={() => removeVariant(idx)}
                  >
                    Remove Variant
                  </button>
                )}
              </div>
              <div className="qr-box">
                {v.qrcode_url ? (
                  <>
                    <img
                      id={`qr-${idx}`}
                      src={v.qrcode_url}
                      alt="QR Code"
                      className="qr-img"
                    />

                    <button
                      type="button"
                      className="print-btn"
                      onClick={() => handlePrintQR(idx)}
                    >
                      Print QR
                    </button>
                  </>
                ) : (
                  <p>No QR Available</p>
                )}
              </div>
            </div>
          ))}


          <button type="button" className="btn-outline" onClick={addVariant}>
            + Add Variant
          </button>

          {/* SAVE */}
          <button className="btn-primary" type="submit">{productToEdit ? "Update Product" : "Save Product"}</button>

        </form>
      </div>
    </div>
  );
};

export default AddProduct;
