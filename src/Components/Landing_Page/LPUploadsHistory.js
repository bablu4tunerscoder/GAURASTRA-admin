import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLandingContent,
  deleteLandingContent,
  updateLandingContent,
} from "../../Redux/Slices/landingSlice";
import { BASE_URL } from "../Helper/axiosinstance";
import Sidebar from "../Sidebar/sidebar";

const LPUploadsHistory = () => {
  const dispatch = useDispatch();
  const { content, loading, error } = useSelector((state) => state.landing);

  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({
    heading1: "",
    heading2: "",
    description: "",
    newImage: null,
    imagePreview: "",
  });

  useEffect(() => {
    dispatch(fetchLandingContent());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this content?")) {
      dispatch(deleteLandingContent(id));
    }
  };

  const handleOpenModal = (item) => {
    setEditItem(item);
    setFormData({
      heading1: item.heading1,
      heading2: item.heading2,
      description: item.description,
      newImage: null,
      imagePreview: item.images?.[0] ? `${BASE_URL}${item.images[0]}` : "",
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        newImage: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleImageDelete = () => {
    setFormData((prev) => ({
      ...prev,
      newImage: null,
      imagePreview: "",
    }));
  };

  const handleUpdateSubmit = async () => {
    if (!editItem) return;

    const updatedForm = new FormData();
    updatedForm.append("heading1", formData.heading1);
    updatedForm.append("heading2", formData.heading2);
    updatedForm.append("description", formData.description);
    if (formData.newImage) {
      updatedForm.append("images", formData.newImage);
    }

    await dispatch(
      updateLandingContent({ id: editItem._id, updatedData: updatedForm })
    );
    dispatch(fetchLandingContent());
    setShowModal(false);
  };

  return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4" style={{ textAlign: "center" }}>Landing Page Upload History</h2>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}

<div
  className="
    grid grid-cols-1
    sm:grid-cols-2
    lg:grid-cols-3
    gap-4
    w-full
    px-4
    md:pl-[17rem]
  "
>

          {content?.length > 0 ? (
            content.map((item, index) => (
              <div key={index} className="border rounded-lg shadow-md p-4">
                <h3 className="font-semibold mb-1">Heading 1: {item.heading1}</h3>
                <h4 className="text-gray-600 mb-1">Heading 2: {item.heading2}</h4>
                <p className="text-sm text-gray-700 mb-2">
                  Description: {item.description}
                </p>

                {item.images && item.images.length > 0 && (
                  <img
                    src={`${BASE_URL}${item.images[0]}`}
                    alt={`upload-${index}`}
                    style={{ marginBottom: "10px" }}
                  />
                )}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "10px",
                  }}
                >
                  <button
                    style={{
                      backgroundColor: "#ef4444",
                      color: "white",
                      padding: "6px 12px",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </button>

                  <button
                    style={{
                      backgroundColor: "#3b82f6",
                      color: "white",
                      padding: "6px 12px",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleOpenModal(item)}
                  >
                    Update
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No uploads found.</p>
          )}
        </div>

        {/* MODAL */}
        {showModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "8px",
                width: "400px",
              }}
            >
              <h3 className="text-lg font-semibold mb-4">
                Update Landing Content
              </h3>

              <input
                type="text"
                name="heading1"
                value={formData.heading1}
                onChange={handleInputChange}
                placeholder="Heading 1"
                style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
              />

              <input
                type="text"
                name="heading2"
                value={formData.heading2}
                onChange={handleInputChange}
                placeholder="Heading 2"
                style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
              />

              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Description"
                rows={3}
                style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
              />

              {/* Image Preview */}
              {formData.imagePreview && (
                <div style={{ position: "relative", marginBottom: "10px" }}>
                  <img
                    src={formData.imagePreview}
                    alt="Preview"
                    style={{ width: "100%", height: "auto", borderRadius: "8px" }}
                  />
                  <button
                    onClick={handleImageDelete}
                    style={{
                      position: "absolute",
                      top: "5px",
                      right: "5px",
                      background: "red",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: "24px",
                      height: "24px",
                      cursor: "pointer",
                    }}
                  >
                    ×
                  </button>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ marginBottom: "10px" }}
              />

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button
                  onClick={handleUpdateSubmit}
                  style={{
                    backgroundColor: "#10b981",
                    color: "white",
                    padding: "6px 12px",
                    border: "none",
                    borderRadius: "4px",
                  }}
                >
                  Save
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  style={{
                    backgroundColor: "#9ca3af",
                    color: "white",
                    padding: "6px 12px",
                    border: "none",
                    borderRadius: "4px",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
  );
};

export default LPUploadsHistory;
