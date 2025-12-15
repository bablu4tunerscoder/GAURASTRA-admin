import { ArrowLeft, Save, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getImageUrl } from "../utils/getImageUrl";
import TagInput from "./TagInput";
import { useUpdateBlogMutation } from "../Redux/Slices/BlogSlice";
import toast from "react-hot-toast";

const EditBlog = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id } = useParams();
  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();
  console.log(state)

  const imageUrl = state?.thumbnail?.secure_url ? getImageUrl(state.thumbnail.secure_url) : null;
  const [previewImage, setPreviewImage] = useState(imageUrl);
  const [thumbnailFile, setThumbnailFile] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      author: state?.author || "",
      blogTitle: state?.blog_title || "",
      blogContent: state?.blog_content || "",
      blogStatus: state?.blog_status || "Draft",
      blogPublished: state?.blog_published || "",
      seo: {
        pageTitle: state?.seo?.page_title || "",
        metaDescription: state?.seo?.meta_description || "",
        metaKeywords: state?.seo?.meta_keywords || [],
      },
    },
  });

  // Handle image upload and preview
  const handleImageUpload = (e) => {
    const uploadedImage = e.target.files[0];
    if (!uploadedImage) return;

    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(uploadedImage.type)) {
      toast.error("Invalid file type. Please upload a JPG or PNG image.");
      return;
    }

    if (uploadedImage.size > 25 * 1024 * 1024) {
      toast.error("File size exceeds 25MB. Please upload a smaller image.");
      return;
    }

    setPreviewImage(URL.createObjectURL(uploadedImage));
    setThumbnailFile(uploadedImage);
  };

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      // Append text fields
      formData.append("author", data.author);
      formData.append("blog_title", data.blogTitle);
      formData.append("blog_content", data.blogContent);
      formData.append("blog_status", data.blogStatus);
      formData.append("blog_published", data.blogPublished);

      // Append SEO data
      formData.append("seo[page_title]", data.seo.pageTitle);
      formData.append("seo[meta_description]", data.seo.metaDescription);
      formData.append("seo[meta_keywords]", JSON.stringify(data.seo.metaKeywords));

      // Append thumbnail if new file uploaded
      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile);
      }

      await updateBlog({ id, formData }).unwrap();
      toast.success("Blog updated successfully!");
      navigate("/blogs");
    } catch (err) {
      console.error("Failed to update blog:", err);
      toast.error(err?.data?.message || "Failed to update blog");
    }
  };



  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Update Blog</h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              {...register("blogTitle", { required: "Title is required" })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter blog title"
            />
            {errors.blogTitle && (
              <p className="mt-1 text-sm text-red-600">{errors.blogTitle.message}</p>
            )}
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <Controller
              name="blogContent"
              control={control}
              rules={{ required: "Content is required" }}
              render={({ field }) => (
                <ReactQuill
                  {...field}
                  theme="snow"
                  className="bg-white rounded-lg"
                  placeholder="Write your blog content..."
                />
              )}
            />
            {errors.blogContent && (
              <p className="mt-1 text-sm text-red-600">{errors.blogContent.message}</p>
            )}
          </div>

          {/* Author */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Author
            </label>
            <input
              type="text"
              {...register("author", { required: "Author is required" })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter author name"
            />
            {errors.author && (
              <p className="mt-1 text-sm text-red-600">{errors.author.message}</p>
            )}
          </div>
        </div>

        {/* SEO Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">SEO</h2>

          {/* Page Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Page Title
            </label>
            <input
              type="text"
              {...register("seo.pageTitle")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter SEO page title"
            />
          </div>

          {/* Meta Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Description
            </label>
            <textarea
              {...register("seo.metaDescription")}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter meta description"
            />
          </div>

          {/* Meta Keywords */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Keywords
            </label>
            <Controller
              name="seo.metaKeywords"
              control={control}
              render={({ field }) => (
                <TagInput
                  tags={field.value}
                  setTags={field.onChange}
                />
              )}
            />
          </div>
        </div>

        {/* Publish Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Publish</h2>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              {...register("blogStatus")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
              <option value="Archived">Archived</option>
            </select>
          </div>

          {/* Published Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Published on
            </label>
            <input
              type="date"
              {...register("blogPublished")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Thumbnail */}
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Thumbnail</h2>

          <div className="flex items-center space-x-4">
            <label>
              <div className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">

                <Upload className="w-4 h-4" />
                <span>Choose File</span>
              </div>
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                onChange={handleImageUpload}
                // The input is hidden
                className="hidden"
              />
            </label>
            <span className="text-sm text-gray-500">
              {thumbnailFile ? thumbnailFile.name : "No new file chosen"}
            </span>
          </div>

          {/* Image Preview */}
          {previewImage && (
            <div className="mt-4">
              <div className="relative w-full h-64  bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={previewImage}
                  alt="Blog thumbnail preview"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            disabled={isUpdating}
            className={`flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors ${isUpdating ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <Save className="w-5 h-5" />
            <span>{isUpdating ? "Updating..." : "Update Blog"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBlog;