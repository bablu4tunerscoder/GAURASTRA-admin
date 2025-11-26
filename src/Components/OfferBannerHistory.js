import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./OfferBannerHistory.scss";
import { fetchOfferBanners, deleteOfferBanner } from "../Redux/Slices/offerBannerSlice";
import Sidebar from "./Sidebar/sidebar";
import { toast } from "react-toastify";
import { BASE_URL } from "./Helper/axiosinstance";
import { useNavigate } from "react-router-dom";

const OfferBannerHistory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { banners, loading, error } = useSelector((state) => state.offerBanner);

  // Fetch banners on component mount
  useEffect(() => {
    dispatch(fetchOfferBanners());
  }, [dispatch]);

  // Helper to get the correct banner image URL
  const getBannerImageUrl = (image) => {
    if (!image) return "";
    return image.startsWith("http") ? image : `${BASE_URL}/uploads/banner/${image}`;
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      try {
        await dispatch(deleteOfferBanner(id)).unwrap();
        toast.success("Banner deleted successfully");
        // Refetch banners
        dispatch(fetchOfferBanners());
      } catch (err) {
        toast.error("Failed to delete banner");
      }
    }
  };

  const handleEdit = (banner) => {
    navigate("/OfferBanner", { state: { banner } });
  };

  return (
    <div className="offer-banner-history-wrapper">
      <Sidebar />

      <div className="offer-banner-history">
        <h2>Offer Banner History</h2>

        {loading ? (
          <p>Loading banners...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : banners?.length === 0 ? (
          <p>No banners uploaded yet.</p>
        ) : (
          <div className="banner-grid">
            {banners.map((banner) => (
              <div key={banner._id} className="banner-card">
                <img
                  src={getBannerImageUrl(banner.image)}
                  alt="Banner"
                  className="banner-img"
                />
                <div className="info">
                  <p><strong>Text:</strong> {banner.buttonText || "—"}</p>
                  <p><strong>URL:</strong> {banner.redirectURL || "—"}</p>
                </div>
                <div className="actions">
                  <button className="edit-btn" onClick={() => handleEdit(banner)}>
                    Edit
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(banner._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OfferBannerHistory;
