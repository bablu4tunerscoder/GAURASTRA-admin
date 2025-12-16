import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  createLandingContent,
  resetLandingState,
} from "../../Redux/Slices/landingSlice";

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
    <div className="flex justify-center px-4">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl p-6 mt-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Landing Page Content Editor
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Heading 1 */}
          <div className="flex flex-col gap-1">
            <label className="font-medium text-gray-700">Heading 1:</label>
            <input
              type="text"
              value={heading1}
              onChange={(e) => setHeading1(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          {/* Heading 2 */}
          <div className="flex flex-col gap-1">
            <label className="font-medium text-gray-700">Heading 2:</label>
            <input
              type="text"
              value={heading2}
              onChange={(e) => setHeading2(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="font-medium text-gray-700">Description:</label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          {/* Background Image */}
          <div className="flex flex-col gap-1">
            <label className="font-medium text-gray-700">
              Background Image <span className="text-sm text-gray-500">(1920×1080)</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="border border-gray-300 rounded-lg p-2 bg-white"
            />
          </div>

          {/* Preview Image */}
          {preview && (
            <div>
              <img
                src={preview}
                alt="Preview"
                className="w-full rounded-lg shadow-md border mb-2"
              />
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={!image || loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-lg transition disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Content"}
          </button>
        </form>

        {/* Messages */}
        {imageError && (
          <p className="text-red-500 mt-3">
            Image must be at least 1920×1080 pixels!
          </p>
        )}

        {error && (
          <p className="text-red-500 mt-3">
            {error}
          </p>
        )}

        {success && (
          <p className="text-green-600 mt-3">
            Content saved successfully!
          </p>
        )}
      </div>
    </div>

  );
};

export default LandingEditor;
