import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import BlogCard from "./BlogCard";
import { getAllBlogs } from "../Redux/Slices/BlogSlice";

function BlogList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { blogData } = useSelector((state) => state.blog);

  async function loadCourses() {
    await dispatch(getAllBlogs());
  }

  useEffect(() => {
    loadCourses();
  }, []);

  return (
    <div>
      <div className="min-h-[90vh] pt-12 flex flex-col gap-10 text-black">
        <h1 className="text-center text-3xl font-semibold">
          Explore the Blogs made by
          <span className="font-bold text-yellow-500"> You</span>
        </h1>
        <div className="flex justify-center">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-300"
            onClick={() => {
              navigate("/blog/create");
            }}
          >
            Create Blog
          </button>
        </div>

        {blogData.length === 0 ? (
          <p className="text-center hidden text-gray-500 mt-8">No Content Available</p>
        ) : (
          <>
            {/* Grid View for Larger Screens */}
            <div className="flex flex-wrap justify-center items-center gap-4">
              {blogData.map((element) => (
                <BlogCard key={element._id} data={element} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default BlogList;