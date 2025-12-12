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
    <div className="pt-10">
      <div className="bg-white p-6 rounded-xl shadow-md max-w-xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Upload Offer Banner</h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Banner Image */}
          <div className="flex flex-col gap-1">
            <label className="font-medium">
              Banner Image{" "}
              {!editingBanner && <span className="text-red-500">*</span>}
            </label>

            <input
              type="file"
              accept="image/*"
              name="banner"
              onChange={handleImageChange}
              className="border border-gray-300 rounded-lg p-2 bg-white"
            />

            {!editingBanner && (
              <small className="text-sm text-gray-500">
                * Image is required while creating a new banner
              </small>
            )}
          </div>

          {/* Button Text */}
          <div className="flex flex-col gap-1">
            <label className="font-medium">
              Button Text{" "}
              <span className="font-normal text-gray-400">(optional)</span>
            </label>

            <input
              type="text"
              value={buttonText}
              onChange={(e) => setButtonText(e.target.value)}
              placeholder="e.g., Shop Now"
              className="border border-gray-300 rounded-lg p-2 outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          {/* Redirect URL (only when text typed) */}
          {buttonText.trim() !== "" && (
            <div className="flex flex-col gap-1">
              <label className="font-medium">
                Redirect URL{" "}
                <span className="font-normal text-gray-400">(optional)</span>
              </label>

              <input
                type="text"
                value={redirectURL}
                onChange={(e) => setRedirectURL(e.target.value)}
                placeholder="e.g., /product/12345 or /deals"
                className="border border-gray-300 rounded-lg p-2 outline-none focus:ring focus:ring-blue-300"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-lg transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Uploading..." : editingBanner ? "Update Banner" : "Submit Banner"}
          </button>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>

        {/* Live Preview */}
        {imagePreview && (
          <div className="mt-8">
            <h4 className="text-lg font-semibold mb-3">Live Banner Preview</h4>

            <div className="relative border rounded-lg overflow-hidden shadow">
              <img src={imagePreview} alt="Banner Preview" className="w-full" />

              {buttonText && (
                <a
                  href={redirectURL || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  {buttonText}
                </a>
              )}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default OfferBannerForm;
