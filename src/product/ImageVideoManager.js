import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  saveImages,
  uploadMedia,
  reorderMedia,
  removeMedia,
  deleteMedia,
  setInitialImages,
} from "../Redux/Slices/mediaSlice";
import { updateNewProduct, editProduct } from "../Redux/Slices/productSlice";
import { FaTimes, FaArrowsAlt, FaUpload } from "react-icons/fa";
import "./ImageVideoManager.scss";
import coverimg from "../assets/coverimg.png";
import placeimg from "../assets/placehold.png";
import { BASE_URL } from "../Components/Helper/axiosinstance";

const ImageVideoManager = () => {
  const dispatch = useDispatch();
  const {
    uploadedUrls,
    coverImage,
    otherImages,
    loading,
    saving,
    updating,
    error,
  } = useSelector((state) => state.media);

  const isEditMode = useSelector((state) => state.product.isEditMode);
  const product = useSelector((state) =>
    isEditMode ? state.product.updateProduct : state.product.currentProduct
  );

  const [draggingIndex, setDraggingIndex] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [initialImagesLoaded, setInitialImagesLoaded] = useState(false);

  // Get images from product or default empty array
  const images = product?.images || [];
  // Initialize images when component mounts or product changes
  useEffect(() => {
    if (isEditMode && images.length > 0 && !initialImagesLoaded) {
      // Sort: put is_primary image first
      const sortedImages = [
        ...images.filter((img) => img.is_primary),
        ...images.filter((img) => !img.is_primary),
      ];

      const initialImages = sortedImages.map((img) => ({
        url: img.image_url,
        type: "image",
        id: img.image_id,
        isCover: img.is_primary,
      }));

      dispatch(setInitialImages(initialImages));
      setInitialImagesLoaded(true);
    }
  }, [images, isEditMode, dispatch, initialImagesLoaded]);

  // Helper function to get complete image URL
const getMediaUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http") || url.startsWith("blob:")) {
    return url;
  }
  return `${BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
};

  // Combine uploaded URLs with existing images
  const displayImages = React.useMemo(() => {
    // If we have uploaded URLs, use them (including reordered ones)
    if (uploadedUrls?.length > 0) {
      return uploadedUrls.map((item) => ({
        ...item,
        url: getMediaUrl(item?.url),
        isCover: false,
      }));
    }

    // Otherwise use the existing images from the product
    if (images?.length > 0) {
      const coverImage = images.find((img) => img.is_primary);
      const otherImages = images.filter((img) => !img.is_primary);

      return [
        ...(coverImage
          ? [
              {
                url: getMediaUrl(coverImage.image_url),
                type: "image",
                id: coverImage.image_id,
                isCover: true,
              },
            ]
          : []),
        ...otherImages.map((img) => ({
          url: getMediaUrl(img.image_url),
          type: "image",
          id: img.image_id,
          isCover: false,
        })),
      ].filter((img) => img.url);
    }

    return [];
  }, [uploadedUrls, images]);

  // Drag and drop handlers
  const handleDragStart = (index) => {
    setDraggingIndex(index);
  };
console.log("first",uploadedUrls)
  // const handleDropOnMain = (index) => {
  //   if (index === null || index === 0) return;
  //   const newList = [...displayImages];
  //   [newList[0], newList[index]] = [newList[index], newList[0]];
  //   dispatch(reorderMedia(newList));
  // };

  const handleDrop = (fromIndex, toIndex) => {
  if (fromIndex === null || toIndex === null || fromIndex === toIndex) return;

  const newList = [...displayImages];
  const movedItem = newList.splice(fromIndex, 1)[0]; // Remove dragged item
  newList.splice(toIndex, 0, movedItem); // Insert at dropped position

  dispatch(reorderMedia(newList));
};


  const handleRemove = (index) => {
    dispatch(removeMedia(index));
  };

  const handleDelete = (id, index) => {
    dispatch(deleteMedia(id));
    dispatch(removeMedia(index));
  };

  const handleFileUpload = (event) => {
  const files = Array.from(event.target.files);
  if (files.length === 0) return;

  const totalFiles = displayImages.length + files.length;
  if (totalFiles > 8) {
    setErrorMessage("You can upload up to 8 media files only.");
    return;
  }

  setErrorMessage("");
  dispatch(uploadMedia(files));
};


  const handleSaveImages = async () => {
    if (displayImages.length === 0) {
      alert("No images uploaded!");
      return;
    }

    try {
      const coverImage = displayImages[0]?.url || "";
      const mediaUrls = displayImages
        .slice(1)
        .map((item) => item?.url)
        .filter(Boolean);

      dispatch(
        updateNewProduct({
          cover_image: coverImage,
          mediaUrls: mediaUrls,
        })
      );

      dispatch(
        saveImages({
          coverImage: coverImage,
          otherImages: mediaUrls,
        })
      );

      alert("Images saved successfully!");
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save images");
    }
  };

  // Handle update for existing product
  const handleUpdateImages = async () => {
    if (displayImages.length === 0) {
      alert("No images to update!");
      return;
    }

    try {
      // Prepare images data with their IDs and URLs
      const imagesPayload = displayImages.map((img, index) => ({
        image_url: img.url.replace(BASE_URL, ""),
        image_id: img.id || null, // Keep existing ID or null for new images
        is_primary: index === 0, // First image is cover
      }));

      // Separate cover image and other images
      const coverImage = imagesPayload[0].image_url;
      const otherImages = imagesPayload.slice(1);

      // Prepare the payload for backend
      const payload = {
        cover_image: coverImage,
        mediaUrls: otherImages.map((img) => img.image_url),
        images: imagesPayload, // Send full images data including IDs
      };

      // Dispatch to update product state
      dispatch(editProduct(payload));

      alert("Images updated successfully!");
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update images");
    }
  };

  return (
    <div className="image-video-manager">
      <h2 className="title">Images and Videos</h2>
      {error && <p className="error-message">{error}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {loading && <p className="loading-message">Uploading files...</p>}
      {saving && <p className="loading-message">Saving images...</p>}

      <div className="media-wrapper">
        {/* <div
          className="main-image"
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDropOnMain(draggingIndex)}
        >
          {displayImages?.[0]?.url ? (
            <img
              src={displayImages[0].url}
              alt="Main"
              className="media-content"
              onError={(e) => {
                e.target.src = coverimg;
              }}
            />
          ) : (
            <img src={coverimg} alt="Placeholder" className="media-content" />
          )}
        </div> */}
        <div className="main-image">
  {displayImages?.[0]?.url ? (
    <img
      src={displayImages[0].url}
      alt="Main"
      className="media-content"
      onError={(e) => {
        e.target.src = coverimg;
      }}
    />
  ) : (
    <img src={coverimg} alt="Placeholder" className="media-content" />
  )}
</div>


        <div className="media-container">
          
{/* {displayImages?.length > 1 ? (
  displayImages.slice(1).map((media, index) => (
    <div
      key={media.id || index}
      className="media-item"
      draggable
      onDragStart={() => handleDragStart(index + 1)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => handleDropOnMain(index + 1)}
    >
      {media.type === "video" ? (
        <video className="media-content" controls>
          <source src={media.url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <img
          src={media.url}
          alt="uploaded"
          className="media-content"
          onError={(e) => {
            e.target.src = placeimg;
          }}
        />
      )}
      <div className="overlay">
        <FaArrowsAlt className="drag-icon" />
        <FaTimes
          className="remove-icon"
          onClick={() => {
            if (isEditMode && media.id) {
              handleDelete(media.id, index + 1);
            } else {
              handleRemove(index + 1);
            }
          }}
        />
      </div>
    </div>
  ))
) : (
  <div className="media-item">
    <img src={placeimg} alt="Placeholder" className="media-content" />
  </div>
)} */}
{displayImages.map((media, index) => (
  <div
    key={media.id || index}
    className="media-item"
    draggable
    onDragStart={() => handleDragStart(index)}
    onDragOver={(e) => e.preventDefault()}
    onDrop={() => handleDrop(draggingIndex, index)}
  >
    {media.type === "video" ? (
      <video className="media-content" controls>
        <source src={media.url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    ) : (
      <img
        src={media.url}
        alt="uploaded"
        className="media-content"
        onError={(e) => {
          e.target.src = placeimg;
        }}
      />
    )}
    <div className="overlay">
      <FaArrowsAlt className="drag-icon" />
      <FaTimes
        className="remove-icon"
        onClick={() => {
          if (isEditMode && media.id) {
            handleDelete(media.id, index);
          } else {
            handleRemove(index);
          }
        }}
      />
    </div>
  </div>
))}

          {displayImages?.length < 8 && (
            <div className="upload-box">
              <input
                type="file"
                id="fileInput"
                // accept="image/*"
                  accept="image/*,video/*"
                multiple
                onChange={handleFileUpload}
                style={{ display: "none" }}
                disabled={loading || saving}
              />
              <label htmlFor="fileInput" className="upload-btn">
                <FaUpload className="upload-icon" />
                <span>Upload</span>
              </label>
            </div>
          )}
        </div>
      </div>

      <div className="save-images-container">
        <p>Cover Image</p>
        <button
          onClick={isEditMode ? handleUpdateImages : handleSaveImages}
          className="save-images-btn"
          disabled={
            loading ||
            (isEditMode ? updating : saving) ||
            displayImages.length === 0
          }
        >
          {isEditMode
            ? updating
              ? "Updating..."
              : "Update Images"
            : saving
            ? "Saving..."
            : "Save Images"}
        </button>
      </div>
    </div>
  );
};

export default ImageVideoManager;
