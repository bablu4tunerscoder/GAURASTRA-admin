import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteBlog } from "../Redux/Slices/BlogSlice";
import { BASE_URL } from "../Components/Helper/axiosinstance";
import Sidebar from "../Components/Sidebar/sidebar";

function BlogDescription() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const url = state?.thumbnail?.secure_url
    ?.replace(/\\/g, "/")
    .replace(/^\/+/, "");
  const content = state?.blog_content;

  async function onBlogDelete(id) {
    if (window.confirm("Are you sure you want to delete the blog?")) {
      await dispatch(deleteBlog(id));
      navigate("/blogs");
    }
  }

  return (
    
      <div className="min-h-[90vh] mb-8 pt-12 md:px-20 flex flex-col items-center justify-center text-gray-800">
        <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-lg">
          {/* Blog Title */}
          <h1 className="text-4xl font-semibold text-blue-600 mb-4 text-center">
            {state?.blog_title}
          </h1>

          {/* Blog Thumbnail */}
          {url && (
            <div className="mb-6">
              <img
                className="w-full h-72 object-cover rounded-lg shadow-md"
                alt="thumbnail"
                src={`${BASE_URL}/${url}`}
              />
            </div>
          )}

          {/* Blog Content */}
          <div className="text-lg text-gray-700 mb-6">
            <p className="text-blue-600 font-semibold">Content:</p>
            <p
              className="text-gray-600 whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>

          {/* Thin Black Line */}
          <div className="w-full border-t border-black my-4"></div>

          {/* Author and Published Date */}
          <div className="flex justify-start items-start">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">{state?.author}</p>
              <p className="text-xs text-gray-400">{state?.blog_published}</p>
            </div>
          </div>
          <div className="flex justify-end gap-4">
            {/* Edit Button */}
            <button
              onClick={() =>
                navigate(`/blog/edit/${state?.blog_id}`, {
                  state: { ...state },
                })
              }
              className="text-white font-semibold px-4 py-2 border-2 bg-blue-500 border-blue-500 rounded-lg hover:bg-blue-600 transition-all ease-in-out duration-300"
            >
              Edit
            </button>

            {/* Delete Button */}
            <button
              onClick={() => onBlogDelete(state?.blog_id)}
              className="text-white font-semibold px-4 py-2 border-2 bg-red-500 border-red-500 rounded-lg hover:bg-red-600 transition-all ease-in-out duration-300"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

  );
}

export default BlogDescription;
