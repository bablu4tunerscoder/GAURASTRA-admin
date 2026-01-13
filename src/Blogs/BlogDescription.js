import { useLocation, useNavigate } from "react-router-dom";
import { useDeleteBlogMutation } from "../Redux/Slices/BlogSlice";
import { getImageUrl } from "../utils/getImageUrl";

function BlogDescription() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [deleteBlog, { isLoading: isDeleting }] =
    useDeleteBlogMutation();

  const url = state?.thumbnail?.secure_url
    ?.replace(/\\/g, "/")
    .replace(/^\/+/, "");


  const content = state?.blog_content;

  const handleDelete = async (id) => {
    if (!id) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete the blog?"
    );
    if (!confirmed) return;

    try {
      await deleteBlog(id).unwrap();
      navigate("/blogs");
    } catch (err) {
      alert(err?.data?.message || "Failed to delete blog");
    }
  };

  return (
    <div className="min-h-[90vh] mb-8 pt-12 md:px-20 flex flex-col items-center justify-center text-gray-800">
      <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-lg">
        {/* BLOG TITLE */}
        <h1 className="text-4xl font-semibold text-blue-600 mb-4 text-center">
          {state?.blog_title}
        </h1>

        {/* BLOG THUMBNAIL */}
        {url && (
          <div className="mb-6">
            <img
              className="w-full object-cover rounded-lg shadow-md"
              alt="thumbnail"
              src={getImageUrl(url)}
            />
          </div>
        )}

        {/* BLOG CONTENT */}
        <div className="text-lg text-gray-700 mb-6">
          <p className="text-blue-600 font-semibold">Content:</p>
          <div
            className="text-gray-600 whitespace-pre-line"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>

        {/* DIVIDER */}
        <div className="w-full border-t border-black my-4"></div>

        {/* AUTHOR INFO */}
        <div className="flex justify-start items-start mb-4">
          <div className="space-y-1">
            <p className="text-sm text-gray-500">{state?.author}</p>
            <p className="text-xs text-gray-400">
              {state?.blog_published}
            </p>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-4">
          <button
            onClick={() =>
              navigate(`/blog/edit/${state?.blog_id}`, {
                state: { ...state },
              })
            }
            className="text-white font-semibold px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition"
          >
            Edit
          </button>

          <button
            onClick={() => handleDelete(state?.blog_id)}
            disabled={isDeleting}
            className={`text-white font-semibold px-4 py-2 rounded-lg transition
              ${isDeleting
                ? "bg-red-300 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600"
              }`}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BlogDescription;
