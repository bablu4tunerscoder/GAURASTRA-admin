import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { createNewBlog } from "../Redux/Slices/BlogSlice";
import { useNavigate } from "react-router-dom";
import TagInput from "./TagInput";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Sidebar from "../Components/Sidebar/sidebar";

const CreateBlog = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const thumbnailRef = useRef(null);
  const [blog_content_type, setBlogContentType] = useState("1"); // Default tab

  const [blogData, setBlogData] = useState({
    author: "",
    blogTitle: "",
    blogContent: "",
    blogStatus: "Published",
    blogPublished: "",
    blogSlug: "",
    thumbnail: null,
    seo: {
      pageTitle: "",
      metaKeywords: [],
      metaDescription: "",
    },
  });

  const [previewImage, setPreviewImage] = useState(null); // Preview image state

  const handleChange = (event, fieldName) => {
    // Handle the case for ReactQuill separately
    if (fieldName === "blogContent") {
      setBlogData((prevData) => ({
        ...prevData,
        [fieldName]: event, // ReactQuill provides the content directly
      }));
    } else {
      const { name, value } = event.target;
      // If the name is inside the seo object, update the seo sub-object
      if (name === "pageTitle" || name === "metaDescription") {
        setBlogData((prevData) => ({
          ...prevData,
          seo: {
            ...prevData.seo,
            [name]: value, // Update specific seo field
          },
        }));
      }
      // Handle other fields (like blogTitle, blogContent, etc.)
      else {
        setBlogData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
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

    const {
      author,
      blogTitle,
      blogContent,
      blogStatus,
      blogPublished,
      blogSlug,
      thumbnail,
      seo: { pageTitle, metaKeywords, metaDescription },
    } = blogData;

    if (!thumbnail) {
      alert("Thumbnail is required");
      return;
    }

    // Restructure the SEO data to match the required format
    const seoData = {
      page_title: pageTitle,
      meta_keywords: metaKeywords,
      meta_description: metaDescription,
    };

    // Prepare the data for dispatch
    const blogDataToSubmit = {
      author,
      blogTitle,
      blogContent,
      blogStatus,
      blogPublished,
      blogSlug,
      thumbnail,
      seo: seoData, // Pass the formatted SEO data here
    };

    // Dispatch the blog data to Redux store
    const response = await dispatch(createNewBlog(blogDataToSubmit));
    if (response.meta.requestStatus === "fulfilled") {
      navigate("/blogs");
    }
  };
  return (
    <>
    <div>
      <Sidebar/>
      <div className="min-h-screen bg-gray-50 mb-8 " style={{marginLeft:"270px"}}>
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
                      <div className="flex justify-center mt-4">
                        <h1 className="text-black text-xl font-bold px-6 py-3">
                          Create Blog
                        </h1>
                      </div>
                    </div>

                    <div className="p-6 pt-0">
                      <div className="space-y-4">
                        <div>
                          <label
                            className="text-2xl font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
                            handleChange(value, "blogContent")
                          }
                          modules={{
                            toolbar: [
                              [{ header: [1, 2, 3, false] }],
                              ["bold", "italic", "underline"],
                              [{ list: "ordered" }, { list: "bullet" }],
                              ["link"],
                            ],
                          }}
                          formats={[
                            "header",
                            "bold",
                            "italic",
                            "underline",
                            "list",
                            "bullet",
                            "link",
                          ]}
                          theme="snow"
                          placeholder="Write your content here..."
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

                  {blog_content_type === "1" && (
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
                  )}
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
                        {/* hover:bg-primary/90 */}
                        Create
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
                      <div
                        onClick={() => thumbnailRef.current?.click()}
                        className="border-2 border-dashed rounded-lg p-4 text-center"
                      >
                        <input
                          className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 hidden"
                          type="file"
                          id="thumbnail"
                          accept="image/*"
                          onChange={handleImageUpload}
                          ref={thumbnailRef}
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

export default CreateBlog;
