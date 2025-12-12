import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteOfferBanner, fetchOfferBanners } from "../Redux/Slices/offerBannerSlice";
import { BASE_URL } from "./Helper/axiosinstance";
import "./OfferBannerHistory.scss";

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
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl  p-6 mx-auto">
        <h2 className="text-2xl font-bold mb-6">Offer Banner History</h2>

        {loading ? (
          <p className="text-gray-500">Loading banners...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : banners?.length === 0 ? (
          <p className="text-gray-500">No banners uploaded yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {banners.length > 0 && banners.map((banner) => (
              <div
                key={banner._id}
                className="bg-white shadow-md rounded-xl overflow-hidden flex flex-col"
              >
                <img
                  src={getBannerImageUrl(banner.image)}
                  alt="Banner"
                  className="w-full h-48 object-cover"
                />

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div className="mb-4">
                    <p className="text-gray-700">
                      <strong>Text:</strong> {banner.buttonText || "—"}
                    </p>
                    <p className="text-gray-700">
                      <strong>URL:</strong> {banner.redirectURL || "—"}
                    </p>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                      onClick={() => handleEdit(banner)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                      onClick={() => handleDelete(banner._id)}
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
