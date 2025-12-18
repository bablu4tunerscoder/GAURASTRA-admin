import { Link } from "react-router-dom";
import { useGetAllBlogsQuery } from "../Redux/Slices/BlogSlice";
import BlogCard from "./BlogCard";

function BlogList() {

  // 🔥 RTK Query auto-fetch
  const {
    data: blogData = [],
    isLoading,
    isError,
    error,
  } = useGetAllBlogsQuery();

  if (isLoading) {
    return (
      <div className="min-h-[90vh] flex items-center justify-center text-gray-500">
        Loading blogs...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[90vh] flex items-center justify-center text-red-500">
        {error?.data?.message || "Failed to load blogs"}
      </div>
    );
  }

  return (
    <div className="min-h-[90vh] flex flex-col gap-10 text-black">
      <div className="flex justify-between">
        <h1 className="text-center text-3xl font-semibold">
          Explore the Blogs made by
          <span className="font-bold text-yellow-500"> You</span>
        </h1>
        <Link to="/blog/create"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-300"

        >
          Create Blog
        </Link>
      </div>


      {blogData.length === 0 ? (
        <p className="text-center text-gray-500 mt-8">
          No Content Available
        </p>
      ) : (
        <div className="columns-1 md:columns-2 lg:columns-3 space-y-4">
          {blogData.map((blog) => (
            <BlogCard key={blog._id} data={blog} />
          ))}
        </div>
      )}
    </div>
  );
}

export default BlogList;
