import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useFetchOfferBannersQuery,
  useDeleteOfferBannerMutation,
} from "../Redux/Slices/offerBannerSlice";
import { BASE_URL } from "./Helper/axiosinstance";

const OfferBannerHistory = () => {
  const navigate = useNavigate();

  // RTK Query hooks
  const { data: banners = [], isLoading, isError, error } = useFetchOfferBannersQuery();
  const [deleteOfferBanner] = useDeleteOfferBannerMutation();

  // Helper to get the correct banner image URL
  const getBannerImageUrl = (image) => {
    if (!image) return "";
    return image.startsWith("http") ? image : `${BASE_URL}/uploads/banner/${image}`;
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      try {
        await deleteOfferBanner(id).unwrap();
        toast.success("Banner deleted successfully");
      } catch (err) {
        toast.error("Failed to delete banner");
      }
    }
  };

  const handleEdit = (banner) => {
    navigate("/OfferBanner", { state: { banner } });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold mb-6">Offer Banner History</h2>

        {isLoading ? (
          <p className="text-gray-500">Loading banners...</p>
        ) : isError ? (
          <p className="text-red-500">{error?.message || "Failed to load banners"}</p>
        ) : banners.length === 0 ? (
          <p className="text-gray-500">No banners uploaded yet.</p>
        ) : (
          <div className="flex flex-wrap gap-6">
            {banners?.data?.map?.((banner) => (
              <div
                key={banner._id}
                className="
        flex flex-col
        w-full sm:w-[48%] md:w-[31%] lg:w-[23%]
        bg-white rounded-2xl shadow-sm
        hover:shadow-lg transition-shadow duration-300
        overflow-hidden
      "
              >
                {/* Image */}
                <div className="relative w-full h-48 bg-gray-100">
                  <img
                    src={getBannerImageUrl(banner.image)}
                    alt="Banner"
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col justify-between flex-1 p-4">
                  <div className="space-y-1 mb-4">
                    <p className="text-sm text-gray-700 truncate">
                      <span className="font-semibold">Text:</span>{" "}
                      {banner.buttonText || "—"}
                    </p>

                    <p className="text-sm text-gray-700 truncate">
                      <span className="font-semibold">URL:</span>{" "}
                      {banner.redirectURL || "—"}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(banner)}
                      className="
              flex-1 bg-blue-600 hover:bg-blue-700
              text-white text-sm font-medium
              py-2 rounded-lg transition
            "
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(banner._id)}
                      className="
              flex-1 bg-red-600 hover:bg-red-700
              text-white text-sm font-medium
              py-2 rounded-lg transition
            "
                    >
                      Delete
                    </button>
                  </div>
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
