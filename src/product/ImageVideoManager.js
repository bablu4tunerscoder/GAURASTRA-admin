import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Controller, useWatch } from "react-hook-form";
import {
  removeMedia,
  reorderMedia,
  setInitialImages,
} from "../Redux/Slices/mediaSlice";
import {
  useDeleteMediaMutation,
  useUploadMediaMutation,
} from "../Redux/Slices/mediaSlice";
import { FaArrowsAlt, FaTimes, FaUpload } from "react-icons/fa";
import coverimg from "../assets/coverimg.png";
import placeimg from "../assets/placehold.png";
import { BASE_URL } from "../Components/Helper/axiosinstance";
import { getImageUrl } from "../utils/getImageUrl";
import "./ImageVideoManager.scss";

const ImageVideoManager = ({ control, errors, setValue }) => {
  const dispatch = useDispatch();

  /* =======================
     Redux State
  ======================== */
  const { uploadedUrls, loading, error } = useSelector(
    (state) => state.media
  );

  const isEditMode = useSelector((state) => state.product.isEditMode);

  /* =======================
     Watch form value for images
  ======================== */
  const formImages = useWatch({
    control,
    name: "images",
    defaultValue: []
  });

  /* =======================
     RTK Query Hooks
  ======================== */
  const [uploadMedia] = useUploadMediaMutation();
  const [deleteMedia] = useDeleteMediaMutation();

  /* =======================
     Local State
  ======================== */
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [initialized, setInitialized] = useState(false);

  /* =======================
     Initialize images from form value when in edit mode
  ======================== */
  useEffect(() => {
    if (isEditMode && formImages && formImages.length > 0 && !initialized && uploadedUrls.length === 0) {
      const mappedImages = formImages.map((img) => ({
        id: img.image_id,
        url: img.image_url.startsWith('http') ? img.image_url : `${BASE_URL}${img.image_url}`,
        type: "image",
        isCover: img.is_primary,
      }));
      dispatch(setInitialImages(mappedImages));
      setInitialized(true);
    }
  }, [isEditMode, formImages, initialized, dispatch, uploadedUrls.length]);

  /* =======================
     Sync Redux uploadedUrls to form
  ======================== */
  useEffect(() => {
    if (uploadedUrls.length > 0) {
      const imagesPayload = uploadedUrls.map((img, index) => ({
        image_url: img.url.replace(BASE_URL, ""),
        image_id: img.id || null,
        is_primary: index === 0,
      }));

      // Only update if different from current form value
      const currentPayload = JSON.stringify(imagesPayload);
      const formPayload = JSON.stringify(formImages);

      if (currentPayload !== formPayload) {
        setValue("images", imagesPayload, { shouldValidate: true });
      }
    }
  }, [uploadedUrls, setValue, formImages]);

  /* =======================
     Display Images (Single Source)
  ======================== */
  const displayImages = useMemo(() => {
    return uploadedUrls.map((item) => ({
      ...item,
      url: getImageUrl(item.url),
    }));
  }, [uploadedUrls]);

  /* =======================
     Drag & Drop
  ======================== */
  const handleDrop = (from, to) => {
    if (from === null || to === null || from === to) return;

    const list = [...displayImages];
    const moved = list.splice(from, 1)[0];
    list.splice(to, 0, moved);

    dispatch(reorderMedia(list));

    // Update React Hook Form value
    const imagesPayload = list.map((img, index) => ({
      image_url: img.url.replace(BASE_URL, ""),
      image_id: img.id || null,
      is_primary: index === 0,
    }));
    setValue("images", imagesPayload, { shouldValidate: true });
  };

  /* =======================
     Media Actions
  ======================== */
  const handleRemove = (index) => {
    dispatch(removeMedia(index));

    // Update React Hook Form value
    const updatedImages = displayImages.filter((_, i) => i !== index);
    const imagesPayload = updatedImages.map((img, i) => ({
      image_url: img.url.replace(BASE_URL, ""),
      image_id: img.id || null,
      is_primary: i === 0,
    }));
    setValue("images", imagesPayload, { shouldValidate: true });
  };

  const handleDelete = async (id, index) => {
    try {
      await deleteMedia(id).unwrap();
      dispatch(removeMedia(index));

      // Update React Hook Form value
      const updatedImages = displayImages.filter((_, i) => i !== index);
      const imagesPayload = updatedImages.map((img, i) => ({
        image_url: img.url.replace(BASE_URL, ""),
        image_id: img.id || null,
        is_primary: i === 0,
      }));
      setValue("images", imagesPayload, { shouldValidate: true });
    } catch (err) {
      setErrorMessage(err?.data?.message || "Delete failed");
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (displayImages.length + files.length > 8) {
      setErrorMessage("You can upload up to 8 media files only.");
      return;
    }

    setErrorMessage("");

    try {
      // Upload media - Redux will update automatically via the mutation
      await uploadMedia(files).unwrap();
      // The useEffect above will sync the uploadedUrls to form automatically
    } catch (err) {
      console.error("Upload error:", err);
      setErrorMessage(err?.data?.message || err?.message || "Upload failed");
    }
  };

  /* =======================
     UI
  ======================== */
  return (
    <div className="w-full bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Images and Videos</h2>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      {errorMessage && <p className="text-red-500 text-sm mb-2">{errorMessage}</p>}
      {errors?.images && <p className="text-red-500 text-sm mb-2">{errors.images.message}</p>}
      {loading && <p className="text-blue-500 text-sm mb-2">Uploading files...</p>}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Cover Image */}
        <div className="w-full lg:w-1/3">
          <div className="aspect-square border rounded-lg overflow-hidden">
            <img
              src={displayImages[0]?.url || coverimg}
              alt="Cover"
              className="w-full h-full object-cover"
              onError={(e) => (e.target.src = coverimg)}
            />
          </div>
        </div>

        {/* Image Grid */}
        <div className="w-full lg:w-2/3">
          <div className="flex flex-wrap gap-4">
            {displayImages.map((media, index) => (
              <div
                key={media.id || index}
                className="relative w-24 h-24 border rounded-lg overflow-hidden cursor-move group"
                draggable
                onDragStart={() => setDraggingIndex(index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(draggingIndex, index)}
              >
                <img
                  src={media.url}
                  alt="media"
                  className="w-full h-full object-cover"
                  onError={(e) => (e.target.src = placeimg)}
                />

                <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition">
                  <FaArrowsAlt className="text-white text-lg" />
                  <FaTimes
                    className="text-white text-lg cursor-pointer"
                    onClick={() =>
                      isEditMode && media.id
                        ? handleDelete(media.id, index)
                        : handleRemove(index)
                    }
                  />
                </div>
              </div>
            ))}

            {/* Upload Button */}
            {displayImages.length < 8 && (
              <div className="w-24 h-24 border-2 border-dashed rounded-lg flex items-center justify-center">
                <input
                  type="file"
                  id="fileInput"
                  accept="image/*,video/*"
                  multiple
                  hidden
                  onChange={handleFileUpload}
                />
                <label
                  htmlFor="fileInput"
                  className="flex flex-col items-center text-sm text-gray-600 cursor-pointer hover:text-blue-600"
                >
                  <FaUpload className="text-lg" />
                  <span>Upload</span>
                </label>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageVideoManager;