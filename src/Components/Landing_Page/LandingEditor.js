import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createLandingContent,
  resetLandingState,
} from "../../Redux/Slices/landingSlice";
import "./LandingEditor.scss";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar/sidebar";

const LandingEditor = () => {
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.landing);
  const navigate = useNavigate();

  const [heading1, setHeading1] = useState("");
  const [heading2, setHeading2] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [imageError, setImageError] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      if (img.width >= 1500 && img.height >= 900) {
        setImage(file);
        setPreview(img.src);
        setImageError(false);
      } else {
        alert("Image must be at least 1500x900 pixels!");
        e.target.value = "";
        setImage(null);
        setPreview("");
        setImageError(true);
      }
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return alert("Please upload a valid image!");

    const formData = new FormData();
    formData.append("heading1", heading1);
    formData.append("heading2", heading2);
    formData.append("description", description);
    formData.append("images", image);

    dispatch(createLandingContent(formData)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        alert("Content saved successfully!");
        setHeading1("");
        setHeading2("");
        setDescription("");
        setImage(null);
        setPreview("");
        dispatch(resetLandingState());
        navigate("/lp-uploads-history"); // ✅ REDIRECT AFTER SUCCESS
      }
    });
  };

  return (
    <div>
      <Sidebar/>
      <div className="admin-landing-editor">
        <h2>Landing Page Content Editor</h2>
        <form onSubmit={handleSubmit}>
          <label>Heading 1:</label>
          <input
            type="text"
            value={heading1}
            onChange={(e) => setHeading1(e.target.value)}
          />

          <label>Heading 2:</label>
          <input
            type="text"
            value={heading2}
            onChange={(e) => setHeading2(e.target.value)}
          />

          <label>Description:</label>
          <textarea
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label>Background Image (1920x1080):</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />

          {preview && <img src={preview} alt="Preview" className="preview-img" />}

          <button type="submit" disabled={!image || loading}>
            {loading ? "Saving..." : "Save Content"}
          </button>
        </form>

        {imageError && (
          <p style={{ color: "red" }}>Image must be at least 1920x1080 pixels!</p>
        )}

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>Content saved successfully!</p>}
      </div>
    </div>
  );
};

export default LandingEditor;
