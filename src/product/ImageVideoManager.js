import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  removeMedia,
  reorderMedia,
  saveImages,
  setInitialImages,
} from "../Redux/Slices/mediaSlice";
import {
  useDeleteMediaMutation,
  useUploadMediaMutation,
} from "../Redux/Slices/mediaSlice";
import { useUpdateProductByIdMutation } from "../Redux/Slices/productSlice";
import { FaArrowsAlt, FaTimes, FaUpload } from "react-icons/fa";
import coverimg from "../assets/coverimg.png";
import placeimg from "../assets/placehold.png";
import { BASE_URL } from "../Components/Helper/axiosinstance";
import { getImageUrl } from "../utils/getImageUrl";
import "./ImageVideoManager.scss";

const ImageVideoManager = ({ images = [] }) => {
  const dispatch = useDispatch();

  /* =======================
     Redux State
  ======================== */
  const { uploadedUrls, loading, saving, error } = useSelector(
    (state) => state.media
  );

  const isEditMode = useSelector((state) => state.product.isEditMode);

  /* =======================
     RTK Query Hooks
  ======================== */
  const [uploadMedia] = useUploadMediaMutation();
  const [deleteMedia] = useDeleteMediaMutation();
  const [updateProduct, { isLoading: updating }] =
    useUpdateProductByIdMutation();

  /* =======================
     Local State
  ======================== */
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [initialized, setInitialized] = useState(false);

  /* =======================
     Initialize Media From Props (Edit Mode)
  ======================== */
  useEffect(() => {
    if (!isEditMode || initialized || !images.length) return;

    const sortedImages = [
      ...images.filter((img) => img.is_primary),
      ...images.filter((img) => !img.is_primary),
    ];

    const mappedImages = sortedImages.map((img) => ({
      id: img.image_id,
      url: img.image_url,
      type: "image",
      isCover: img.is_primary,
    }));

    dispatch(setInitialImages(mappedImages));
    setInitialized(true);
  }, [isEditMode, images, initialized, dispatch]);

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
  };

  /* =======================
     Media Actions
  ======================== */
  const handleRemove = (index) => {
    dispatch(removeMedia(index));
  };

  const handleDelete = async (id, index) => {
    await deleteMedia(id).unwrap();
    dispatch(removeMedia(index));
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (displayImages.length + files.length > 8) {
      setErrorMessage("You can upload up to 8 media files only.");
      return;
    }

    setErrorMessage("");
    await uploadMedia(files).unwrap();
  };

  /* =======================
     Save / Update Images
  ======================== */
  const handleSaveImages = () => {
    if (!displayImages.length) return;

    const coverImage = displayImages[0].url;
    const mediaUrls = displayImages.slice(1).map((img) => img.url);

    dispatch(saveImages({ coverImage, otherImages: mediaUrls }));
    alert("Images saved successfully!");
  };

  const handleUpdateImages = async () => {
    if (!displayImages.length) return;

    const imagesPayload = displayImages.map((img, index) => ({
      image_url: img.url.replace(BASE_URL, ""),
      image_id: img.id || null,
      is_primary: index === 0,
    }));

    await updateProduct({
      images: imagesPayload,
    }).unwrap();

    alert("Images updated successfully!");
  };

  /* =======================
     UI
  ======================== */
  return (
    <div className="image-video-manager">
      <h2 className="title">Images and Videos</h2>

      {error && <p className="error-message">{error}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {loading && <p className="loading-message">Uploading files...</p>}
      {saving && <p className="loading-message">Saving images...</p>}

      <div className="media-wrapper">
        <div className="main-image">
          <img
            src={displayImages[0]?.url || coverimg}
            alt="Cover"
            className="media-content"
            onError={(e) => (e.target.src = coverimg)}
          />
        </div>

        <div className="media-container">
          {displayImages.map((media, index) => (
            <div
              key={media.id || index}
              className="media-item"
              draggable
              onDragStart={() => setDraggingIndex(index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(draggingIndex, index)}
            >
              <img
                src={media.url}
                alt="media"
                className="media-content"
                onError={(e) => (e.target.src = placeimg)}
              />

              <div className="overlay">
                <FaArrowsAlt className="drag-icon" />
                <FaTimes
                  className="remove-icon"
                  onClick={() =>
                    isEditMode && media.id
                      ? handleDelete(media.id, index)
                      : handleRemove(index)
                  }
                />
              </div>
            </div>
          ))}

          {displayImages.length < 8 && (
            <div className="upload-box">
              <input
                type="file"
                id="fileInput"
                accept="image/*,video/*"
                multiple
                hidden
                onChange={handleFileUpload}
              />
              <label htmlFor="fileInput" className="upload-btn">
                <FaUpload />
                <span>Upload</span>
              </label>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={isEditMode ? handleUpdateImages : handleSaveImages}
        className="save-images-btn"
        disabled={loading || saving || updating}
      >
        {isEditMode ? "Update Images" : "Save Images"}
      </button>
    </div>
  );
};

export default ImageVideoManager;
