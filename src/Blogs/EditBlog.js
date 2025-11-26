import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateBlog } from "../Redux/Slices/BlogSlice";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import TagInput from "./TagInput";
import Sidebar from "../Components/Sidebar/sidebar";
import { BASE_URL } from "../Components/Helper/axiosinstance";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const EditBlog = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id } = useParams();

  const url = state.thumbnail.secure_url.replace(/\\/g, "/").replace(/^\/+/, '');
  const Imageurl = `${BASE_URL}/${url}`;


  const [blogData, setBlogData] = useState({
    blog_id: id,
    author: state.author,
    blogTitle: state.blog_title,
    blogContent: state.blog_content,
    blogStatus: state.blog_status,
    blogPublished: state.blog_published,
    blogSlug: state.blog_slug,
    thumbnail: null,
    seo: {
      pageTitle: state.seo.page_title,
      metaKeywords: state.seo.meta_keywords,
      metaDescription: state.seo.meta_description,
    },
  });

  const [previewImage, setPreviewImage] = useState(Imageurl); // Preview image state

  const handleChange = (event) => {
    // Check if event.target is valid
    if (event && event.target) {
      const { name, value } = event.target;

      // Handle SEO fields separately
      if (name === "pageTitle" || name === "metaDescription") {
        setBlogData((prevData) => ({
          ...prevData,
          seo: {
            ...prevData.seo,
            [name]: value, // Update specific seo field
          },
        }));
      } else {
        // Handle other fields (like blogTitle, blogContent, etc.)
        setBlogData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    } else {
      console.error("Event target is undefined or null");
    }
  };

  // Function to update metaKeywords when tags change
  const handleMetaKeywordsChange = (newTags) => {
    setBlogData((prevData) => ({
      ...prevData,
      seo: {
        ...prevData.seo,
        metaKeywords: newTags, // Ensure it's an array
      },
    }));
  };

  // Handle image upload and preview
  const handleImageUpload = (e) => {
    const uploadedImage = e.target.files[0];
    if (!uploadedImage) {
      alert("Thumbnail is required.");
      return;
    }

    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(uploadedImage.type)) {
      alert("Invalid file type. Please upload a JPG or PNG image.");
      return;
    }
    if (uploadedImage.size > 25 * 1024 * 1024) {
      alert("File size exceeds 25MB. Please upload a smaller image.");
      return;
    }

    // Set image preview
    setPreviewImage(URL.createObjectURL(uploadedImage));

    // Store the uploaded image in the state
    setBlogData((prevData) => ({
      ...prevData,
      thumbnail: uploadedImage,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const seoData = {
      page_title: blogData.seo.pageTitle,
      meta_keywords: blogData.seo.metaKeywords,
      meta_description: blogData.seo.metaDescription,
    };

    const blogDataToSubmit = {
      blog_id: id,
      author: blogData.author,
      blogTitle: blogData.blogTitle,
      blogContent: blogData.blogContent,
      blogStatus: blogData.blogStatus,
      blogPublished: blogData.blogPublished,
      blogSlug: blogData.blogSlug,
      thumbnail: blogData.thumbnail,
      seo: seoData,
    };

    const response = await dispatch(updateBlog(blogDataToSubmit));

    if (response.meta.requestStatus === "fulfilled") {
      navigate("/blogs");
    }
  };

  return (
    <>
    <div>
      <Sidebar/>
      <div className="min-h-screen bg-gray-50 mb-8" style={{marginLeft:"270px"}}>
          <main className="container mx-auto px-4 py-6">
            <form onSubmit={handleSubmit} method="post">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="md:col-span-2">
                  <div className="space-y-6">
                    <div
                      className="rounded-lg border bg-card text-card-foreground shadow-sm"
                      data-v0-t="card"
                    >
                      <div className="flex flex-col space-y-1.5 p-6">
                        <div
                          className="flex justify-center mt-4"
                          style={{ listStyle: "none" }}
                        >
                        <h1 className="text-black text-xl font-bold px-6 py-3">
                          Update Blog
                        </h1>
                        </div>
                      </div>

                      <div className="p-6 pt-0">
                        <div className="space-y-4">
                          <div>
                            <label
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              htmlFor="blogTitle"
                            >
                              Title
                            </label>
                            <input
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              id="blogTitle"
                              name="blogTitle"
                              placeholder="Enter title"
                              value={blogData.blogTitle}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <ReactQuill
                            value={blogData.blogContent}
                            onChange={(value) =>
                              setBlogData((prevData) => ({
                                ...prevData,
                                blogContent: value,
                              }))
                            }
                            className="bg-white border rounded-md mb-4"
                            theme="snow"
                            placeholder="Write your content here..."
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div
                      className="rounded-lg border bg-card text-card-foreground shadow-sm"
                      data-v0-t="card"
                    >
                      <div className="flex flex-col space-y-1.5 p-6">
                        <h3 className="text-2xl font-semibold leading-none tracking-tight">
                          Author
                        </h3>
                      </div>
                      <div className="p-6 pt-0">
                        <input
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Author name"
                          name="author"
                          value={blogData.author}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                      <div
                        className="rounded-lg border bg-card text-card-foreground shadow-sm"
                        data-v0-t="card"
                      >
                        <div className="flex flex-col space-y-1.5 p-6">
                          <h3 className="text-2xl font-semibold leading-none tracking-tight">
                            SEO
                          </h3>
                        </div>
                        <div className="p-6 pt-0 space-y-4">
                          <div>
                            <label
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              htmlFor="pageTitle"
                            >
                              Page Title
                            </label>
                            <input
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              id="pageTitle"
                              name="pageTitle"
                              placeholder="Enter Meta Tilte"
                              value={blogData.seo.pageTitle}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div>
                            <TagInput
                              tags={blogData.seo.metaKeywords}
                              setTags={handleMetaKeywordsChange}
                            />
                          </div>
                          <div>
                            <label
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              htmlFor="metaDescription"
                            >
                              Meta Description
                            </label>
                            <input
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              id="metaKeywords"
                              name="metaDescription"
                              placeholder="Enter meta description"
                              value={blogData.seo.metaDescription}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                      </div>
                  </div>
                </div>
                <div className="md:col-span-1">
                  <div className="space-y-6">
                    <div
                      className="rounded-lg border bg-card text-card-foreground shadow-sm"
                      data-v0-t="card"
                    >
                      <div className="flex flex-col space-y-1.5 p-6 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <h3 className="text-2xl font-semibold leading-none tracking-tight">
                            Publish
                          </h3>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-chevron-up h-4 w-4"
                          >
                            <path d="m18 15-6-6-6 6"></path>
                          </svg>
                        </div>
                      </div>
                      <div className="p-6 pt-0 space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Status
                          </label>
                          <select
                            name="blogStatus"
                            value={blogData.blogStatus}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="Published">Published</option>
                            <option value="Draft">Draft</option>
                            <option value="Archived">Archived</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Published on
                          </label>
                          <input
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            type="date"
                            name="blogPublished"
                            value={blogData.blogPublished}
                            onChange={handleChange}
                          />
                        </div>
                        <button
                          type="submit"
                          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 text-white bg-blue-500 hover:bg-blue-600 xt-primary-foreground h-10 px-4 py-2 w-full"
                        >
                          Update
                        </button>
                      </div>
                    </div>
                    <div
                      className="rounded-lg border bg-card text-card-foreground shadow-sm"
                      data-v0-t="card"
                    >
                      <div className="flex flex-col space-y-1.5 p-6 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <h3 className="text-2xl font-semibold leading-none tracking-tight">
                            Upload Thumbnail
                          </h3>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-chevron-up h-4 w-4"
                          >
                            <path d="m18 15-6-6-6 6"></path>
                          </svg>
                        </div>
                      </div>
                      <div className="p-6 pt-0">
                        <div className="border-2 border-dashed rounded-lg p-4 text-center">
                          <input
                            className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 hidden"
                            type="file"
                            id="featured-image"
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                          <label
                            className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-sm text-gray-600"
                            htmlFor="featured-image"
                          >
                            Choose File
                          </label>
                          <p className="text-xs text-gray-400 mt-1">
                            No file chosen
                          </p>
                          {/* Display image preview if uploaded */}
                          {previewImage && (
                            <div className="mt-4">
                              <img
                                src={previewImage}
                                alt="Thumbnail Preview"
                                className="w-32 h-32 object-cover rounded-md mx-auto"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </main>
        </div>
    </div>
    </>
  );
};

export default EditBlog;
