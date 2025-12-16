import { createSlice } from "@reduxjs/toolkit";
import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryOnline from "./api/baseQuery";

export const mediaApi = createApi({
  reducerPath: "mediaApi",
  baseQuery: baseQueryOnline,
  endpoints: (builder) => ({
    uploadMedia: builder.mutation({
      query: (files) => {
        const formData = new FormData();
        files.forEach((file) => {
          formData.append("media", file);
        });

        return {
          url: "/api/Productes/Productmedia",
          method: "POST",
          body: formData,
        };
      },
    }),

    deleteMedia: builder.mutation({
      query: (image_id) => ({
        url: `/api/Productes/delete-image/${image_id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useUploadMediaMutation,
  useDeleteMediaMutation,
} = mediaApi;

const initialState = {
  coverImage: "",
  otherImages: [],
  uploadedUrls: [],
  uploadedFiles: [],
  images: [],
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

      /* =======================
         UPLOAD MEDIA MATCHERS
      ======================== */

      .addMatcher(
        mediaApi.endpoints.uploadMedia.matchPending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addMatcher(
        mediaApi.endpoints.uploadMedia.matchFulfilled,
        (state, action) => {
          state.loading = false;

          const urls = action.payload?.productImages || [];

          const newImages = urls.map((url) => ({
            type: url.includes(".mp4") ? "video" : "image",
            url,
            id: null,
          }));

          state.uploadedUrls = [...state.uploadedUrls, ...newImages];
          state.images = [...state.images, ...newImages];
        }
      )

      .addMatcher(
        mediaApi.endpoints.uploadMedia.matchRejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.error?.message || "Media upload failed";
        }
      )

      /* =======================
         DELETE MEDIA MATCHERS
      ======================== */

      .addMatcher(
        mediaApi.endpoints.deleteMedia.matchPending,
        (state) => {
          state.saving = true;
          state.error = null;
        }
      )

      .addMatcher(
        mediaApi.endpoints.deleteMedia.matchFulfilled,
        (state, action) => {
          state.saving = false;

          const imageId =
            action.meta.arg.originalArgs;

          state.uploadedUrls = state.uploadedUrls.filter(
            (media) => media.id !== imageId
          );

          state.images = state.images.filter(
            (img) => img.id !== imageId
          );
        }
      )

      .addMatcher(
        mediaApi.endpoints.deleteMedia.matchRejected,
        (state, action) => {
          state.saving = false;
          state.error =
            action.error?.message || "Delete failed";
        }
      );
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
