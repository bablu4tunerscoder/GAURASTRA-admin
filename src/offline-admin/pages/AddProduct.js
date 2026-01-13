import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
<<<<<<< HEAD
import { createOfflineProduct, updateOfflineProduct, uploadOfflineImage } from "../../Redux/Slices/offlineProductSlice";
import "./AddProduct.scss";
=======
import { useForm, useFieldArray } from "react-hook-form";
import {
  useCreateOfflineProductMutation,
  useUpdateOfflineProductMutation,
} from "../../Redux/Slices/offlineProductSlice";

const defaultVariant = {
  color: "",
  size: "",
  stock: "",
  actual_price: "",
  offer: "",
  offer_type: "percentage",
  qrcode_url: "",
};
>>>>>>> 7406ecfdb1b496bf8f9af7b0d29d04cb3b66a3a6

const AddProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const productToEdit = location.state?.product;

  const [createProduct, { isLoading: creating }] =
    useCreateOfflineProductMutation();
  const [updateProduct, { isLoading: updating }] =
    useUpdateOfflineProductMutation();

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
  } = useForm({
    defaultValues: {
      title: "",
      details: "",
      images: [],
      active: true,
      variants: [defaultVariant],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  const images = watch("images");

  // EDIT MODE PREFILL
  useEffect(() => {
    if (productToEdit) {
      reset({
        title: productToEdit.title,
        details: productToEdit.details,
        images: productToEdit.images || [],
        active: productToEdit.active,
        variants: productToEdit.variants?.length
          ? productToEdit.variants
          : [defaultVariant],
      });
    }
  }, [productToEdit, reset]);

  // ADD IMAGE URL
<<<<<<< HEAD
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
  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
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
=======
  const addImage = (url) => {
    if (!url) return;
    reset((prev) => ({
      ...prev,
      images: [...prev.images, url],
>>>>>>> 7406ecfdb1b496bf8f9af7b0d29d04cb3b66a3a6
    }));
  };

  const onSubmit = async (formData) => {
    const payload = {
      ...formData,
      variants: formData.variants.map((v) => ({
        ...v,
        stock: Number(v.stock),
        actual_price: Number(v.actual_price),
        offer: Number(v.offer),
      })),
    };

<<<<<<< HEAD
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
          navigate("/OffProductTable");

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
=======
    try {
      if (productToEdit) {
        await updateProduct({
          unique_id: productToEdit.unique_id,
          updateData: payload,
        }).unwrap();
        alert("Product Updated");
        navigate("/OffProductTable");
      } else {
        await createProduct(payload).unwrap();
        alert("Product Created");
        reset();
      }
    } catch (err) {
      alert("Error occurred");
>>>>>>> 7406ecfdb1b496bf8f9af7b0d29d04cb3b66a3a6
    }
  };

<<<<<<< HEAD
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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const result = await dispatch(uploadOfflineImage(file)).unwrap();
      console.log("UPLOAD RESULT:", result);

      const imageURL = result.data?.url;

      if (!imageURL) {
        alert("Image upload API did not return a URL!");
        return;
      }

      setImages(prev => [...prev, imageURL]);
      alert("Image uploaded!");

    } catch (err) {
      alert("Upload failed: " + err);
    }
  };

=======
  const handlePrintQR = (src) => {
    const win = window.open("", "_blank");
    win.document.write(`
      <img src="${src}" style="width:200px;margin:auto;display:block" />
    `);
    win.print();
  };
>>>>>>> 7406ecfdb1b496bf8f9af7b0d29d04cb3b66a3a6

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-semibold mb-6">
          {productToEdit ? "Edit Product" : "Add Product"}
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

<<<<<<< HEAD
          <label>Product Title</label>
=======
          {/* TITLE */}
>>>>>>> 7406ecfdb1b496bf8f9af7b0d29d04cb3b66a3a6
          <input
            {...register("title")}
            placeholder="Product title"
            className="w-full border rounded px-4 py-2"
          />

          {/* DESCRIPTION */}
          <textarea
            {...register("details")}
            placeholder="Description"
            rows={4}
            className="w-full border rounded px-4 py-2"
          />

<<<<<<< HEAD
          <label>Upload Product Images</label>
          <input
            type="file"
            className="input"
            accept="image/*"
            onChange={(e) => handleImageUpload(e)}
          />


          {/* PREVIEW GRID */}
          <div className="image-preview-grid">
            {images.map((img, idx) => (
              <div key={idx} className="preview-wrapper">
                <img src={img} className="preview-img" alt="" />

                <button
                  type="button"
                  className="remove-img-btn"
                  onClick={() => removeImage(idx)}
                >
                  ✕
                </button>
              </div>
=======
          {/* IMAGES */}
          <div className="flex gap-2">
            <input
              id="img"
              placeholder="Image URL"
              className="flex-1 border rounded px-4 py-2"
            />
            <button
              type="button"
              onClick={() =>
                addImage(document.getElementById("img").value)
              }
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Add
            </button>
          </div>

          <div className="flex gap-3 flex-wrap">
            {images?.map((img, i) => (
              <img
                key={i}
                src={img}
                alt=""
                className="w-20 h-20 object-cover rounded border"
              />
>>>>>>> 7406ecfdb1b496bf8f9af7b0d29d04cb3b66a3a6
            ))}
          </div>
          
          {/* STATUS */}
          <select
            {...register("active")}
            className="border rounded px-4 py-2"
          >
            <option value={true}>Active</option>
            <option value={false}>Inactive</option>
          </select>

          {/* VARIANTS */}
<<<<<<< HEAD
          <div className="variant-headerr">
            <h2>Product Variants</h2>
          </div>
          {variants.map((v, idx) => (
            <div key={idx} className="variant-box">
=======
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Variants</h2>
>>>>>>> 7406ecfdb1b496bf8f9af7b0d29d04cb3b66a3a6

            {fields.map((field, idx) => (
              <div
                key={field.id}
                className="border rounded-lg p-4 flex justify-between gap-4"
              >
                <div className="grid grid-cols-3 gap-3 flex-1">
                  <input {...register(`variants.${idx}.color`)} placeholder="Color" className="input" />
                  <input {...register(`variants.${idx}.size`)} placeholder="Size" className="input" />
                  <input type="number" {...register(`variants.${idx}.stock`)} placeholder="Stock" className="input" />

                  <input type="number" {...register(`variants.${idx}.actual_price`)} placeholder="Actual Price" className="input" />
                  <input type="number" {...register(`variants.${idx}.offer`)} placeholder="Offer" className="input" />

                  <select {...register(`variants.${idx}.offer_type`)} className="input">
                    <option value="percentage">%</option>
                    <option value="flat">Flat</option>
                  </select>
                </div>

<<<<<<< HEAD
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
                {v.qrcode_url && (
                  <>
                    <img
                      id={`qr-${idx}`}
                      src={v.qrcode_url}
                      alt="QR Code"
                      className="qr-img"
                    />
=======
                <div className="flex flex-col items-center gap-2">
                  {field.qrcode_url ? (
                    <>
                      <img src={field.qrcode_url} className="w-24 h-24" />
                      <button
                        type="button"
                        onClick={() => handlePrintQR(field.qrcode_url)}
                        className="text-blue-600 text-sm"
                      >
                        Print QR
                      </button>
                    </>
                  ) : (
                    <span className="text-gray-400 text-sm">No QR</span>
                  )}
>>>>>>> 7406ecfdb1b496bf8f9af7b0d29d04cb3b66a3a6

                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(idx)}
                      className="text-red-500 text-sm"
                    >
                      Remove
                    </button>
<<<<<<< HEAD
                  </>
                )}
=======
                  )}
                </div>
>>>>>>> 7406ecfdb1b496bf8f9af7b0d29d04cb3b66a3a6
              </div>
            ))}

            <button
              type="button"
              onClick={() => append(defaultVariant)}
              className="px-4 py-2 border rounded"
            >
              + Add Variant
            </button>
          </div>

          {/* SAVE */}
          <button
            type="submit"
            disabled={creating || updating}
            className="w-full bg-green-600 text-white py-3 rounded-lg"
          >
            {creating || updating ? "Saving..." : "Save Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
