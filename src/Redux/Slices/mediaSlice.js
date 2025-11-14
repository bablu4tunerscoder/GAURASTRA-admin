import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../Components/Helper/axiosinstance";

export const uploadMedia = createAsyncThunk(
  "media/uploadMedia",
  async (files, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("media", file);
      });

      const response = await axios.post(
        `${BASE_URL}/api/Productes/Productmedia`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return {
        urls: response?.data?.productImages,
        files: files,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Upload failed");
    }
  }
);

export const deleteMedia = createAsyncThunk(
  "media/deleteMedia",
  async (image_id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/api/Productes/delete-image/${image_id}`
      );
      return {
        image_id,
        message: response.data.message,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Delete failed");
    }
  }
);

const initialState = {
  coverImage: "",
  otherImages: [],
  uploadedUrls: [],
  uploadedFiles: [],
  images: [], // Stores both new and existing images with IDs
  loading: false,
  saving: false,
  error: null,
};

const mediaSlice = createSlice({
  name: "media",
  initialState,
  reducers: {
    saveImages: (state, action) => {
      state.coverImage = action.payload.coverImage;
      state.otherImages = action.payload.otherImages;
    },
    reorderMedia: (state, action) => {
      state.uploadedUrls = action.payload;
      // Also update images array to maintain consistency
      state.images = action.payload.map((item, index) => ({
        ...item,
        isCover: index === 0,
      }));
    },
    removeMedia: (state, action) => {
      const index = action.payload;
      state.uploadedUrls.splice(index, 1);
      state.uploadedFiles.splice(index, 1);
      state.images.splice(index, 1);
    },
    clearMedia: (state) => {
      state.uploadedUrls = [];
      state.uploadedFiles = [];
      state.images = [];
      state.error = null;
    },
    setInitialImages: (state, action) => {
      const images = action.payload || [];
      state.images = images;
      state.uploadedUrls = images;
      if (images.length > 0) {
        state.coverImage = images[0].url;
        state.otherImages = images.slice(1).map((img) => img.url);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload Media
      .addCase(uploadMedia.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadMedia.fulfilled, (state, action) => {
        state.loading = false;
        const newImages = action.payload.urls.map((url) => ({
          type: url.includes(".mp4") ? "video" : "image",
          url,
          id: null, // New images don't have IDs yet
        }));
        state.uploadedUrls = [...state.uploadedUrls, ...newImages];
        state.images = [...state.images, ...newImages];
        state.uploadedFiles = [...state.uploadedFiles, ...action.payload.files];
      })
      .addCase(uploadMedia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Media
      .addCase(deleteMedia.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(deleteMedia.fulfilled, (state, action) => {
        state.saving = false;
        // Filter out the deleted image from all relevant arrays
        state.uploadedUrls = state.uploadedUrls.filter(
          (media) => !media.url.includes(action.payload.image_id)
        );
        state.images = state.images.filter(
          (img) => img.id !== action.payload.image_id
        );
      })
      .addCase(deleteMedia.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      });
  },
});

export const {
  saveImages,
  reorderMedia,
  removeMedia,
  clearMedia,
  setInitialImages,
} = mediaSlice.actions;

export default mediaSlice.reducer;
