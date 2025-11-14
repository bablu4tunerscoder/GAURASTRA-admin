import React, { useState, useEffect } from "react";
import "./OfferBannerForm.scss";
import { toast } from "react-toastify";
import Sidebar from "./Sidebar/sidebar";
import { useDispatch, useSelector } from "react-redux";
import { updateOfferBanner, uploadOfferBanner } from "../Redux/Slices/offerBannerSlice";
import { useLocation } from "react-router-dom";
import { BASE_URL } from "./Helper/axiosinstance";
import { useNavigate } from "react-router-dom";

const OfferBannerForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [buttonText, setButtonText] = useState("Shop Now");
  const [redirectURL, setRedirectURL] = useState("");
  const location = useLocation();
  const editingBanner = location.state?.banner || null;

  const { loading, error } = useSelector((state) => state.offerBanner);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
 useEffect(() => {
  if (editingBanner) {
    setButtonText(editingBanner.buttonText);
    setRedirectURL(editingBanner.redirectURL);
    
    // Check if image is full URL or just a file name
    if (editingBanner.image?.startsWith("http")) {
      setImagePreview(editingBanner.image);
    } else {
      setImagePreview(`${BASE_URL}/uploads/banner/${editingBanner.image}`);
    }
  }
}, [editingBanner]);


  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!redirectURL || !buttonText) {
  //     toast.error("Please fill all fields");
  //     return;
  //   }

  //   const formData = new FormData();
  //   if (image) formData.append("banner", image); // Only if new image selected
  //   formData.append("buttonText", buttonText);
  //   formData.append("redirectURL", redirectURL);

  //   try {
  //     if (editingBanner) {
  //       await dispatch(updateOfferBanner({ id: editingBanner._id, formData })).unwrap();
  //       toast.success("Banner updated successfully!");
  //     } else {
  //       // 🆕 Create Mode
  //       await dispatch(uploadOfferBanner(formData)).unwrap();
  //       toast.success("Banner created successfully!");
  //     }

  //     // Reset Form
  //     setImage(null);
  //     setImagePreview(null);
  //     setButtonText("Shop Now");
  //     setRedirectURL("");

  //       navigate("/OfferBannerHistory");

  //   } catch (err) {
  //     toast.error(err || "Failed to submit banner");
  //   }
  // };

  const handleSubmit = async (e) => {
  e.preventDefault();

  // ✅ Create mode में image required है, बाकी optional
  if (!editingBanner && !image) {
    toast.error("Please upload a banner image");
    return;
  }

  const formData = new FormData();
  if (image) formData.append("banner", image);
  formData.append("buttonText", buttonText);
  formData.append("redirectURL", redirectURL);

  try {
    if (editingBanner) {
      await dispatch(updateOfferBanner({ id: editingBanner._id, formData })).unwrap();
      toast.success("Banner updated successfully!");
    } else {
      await dispatch(uploadOfferBanner(formData)).unwrap();
      toast.success("Banner created successfully!");
    }

    // Reset form
    setImage(null);
    setImagePreview(null);
    setButtonText("Shop Now");
    setRedirectURL("");

    navigate("/OfferBannerHistory");
  } catch (err) {
    toast.error(err || "Failed to submit banner");
  }
};

  return (
    <>
      <Sidebar />
      <div className="offer-banner-form">
        <h2>Upload Offer Banner</h2>
        {/* <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Banner Image</label>
            <input type="file" accept="image/*" name="banner" onChange={handleImageChange} />
          </div>

          <div className="form-group">
            <label>Button Text</label>
            <input
              type="text"
              value={buttonText}
              onChange={(e) => setButtonText(e.target.value)}
              placeholder="e.g., Shop Now"
            />
          </div>

          <div className="form-group">
            <label>Redirect URL</label>
            <input
              type="text"
              value={redirectURL}
              onChange={(e) => setRedirectURL(e.target.value)}
              placeholder="e.g., /product/12345 or /deals"
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Uploading..." : editingBanner ? "Update Banner" : "Submit Banner"}
          </button>

          {error && <p className="error-message"> {error}</p>}
        </form> */}

<form onSubmit={handleSubmit}>
  <div className="form-group">
    <label>
      Banner Image {!editingBanner && <span style={{ color: "red" }}>*</span>}
    </label>
    <input type="file" accept="image/*" name="banner" onChange={handleImageChange} />
    {!editingBanner && (
      <small className="field-hint">* Image is required while creating a new banner</small>
    )}
  </div>

  <div className="form-group">
    <label>
      Button Text <span style={{ fontWeight: "normal", color: "#999" }}>(optional)</span>
    </label>
    <input
      type="text"
      value={buttonText}
      onChange={(e) => setButtonText(e.target.value)}
      placeholder="e.g., Shop Now"
    />
  </div>
{buttonText.trim() !== "" && (
  <div className="form-group">
    <label>
      Redirect URL <span style={{ fontWeight: "normal", color: "#999" }}>(optional)</span>
    </label>
    <input
      type="text"
      value={redirectURL}
      onChange={(e) => setRedirectURL(e.target.value)}
      placeholder="e.g., /product/12345 or /deals"
    />
  </div>
  )}
  <button type="submit" className="submit-btn" disabled={loading}>
    {loading ? "Uploading..." : editingBanner ? "Update Banner" : "Submit Banner"}
  </button>

  {error && <p className="error-message">{error}</p>}
</form>

        {imagePreview && (
          <div className="banner-preview">
            <h4>Live Banner Preview</h4>
            <div className="banner-box">
              <img src={imagePreview} alt="Banner Preview" />
              <a
                className="banner-button"
                href={redirectURL || "#"}
                target="_blank"
                rel="noopener noreferrer"
              >
                {buttonText}
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default OfferBannerForm;
