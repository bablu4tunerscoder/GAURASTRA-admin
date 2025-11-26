import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import BlogCard from "./BlogCard";
import { getAllBlogs } from "../Redux/Slices/BlogSlice";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import Sidebar from "../Components/Sidebar/sidebar";

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
      <Sidebar/>
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
          <p className="text-center text-gray-500 mt-8">No Content Available</p>
        ) : (
          <>
            {/* Swiper for Smaller Screens */}
            <div className="flex lg:hidden w-full">
              <Swiper
                modules={[Pagination, Autoplay]}
                pagination={{
                  clickable: true,
                  dynamicBullets: true,
                  dynamicMainBullets: 5,
                }}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                spaceBetween={10}
                breakpoints={{
                  325: { slidesPerView: 1 },
                  375: { slidesPerView: 1 },
                  425: { slidesPerView: 1 },
                  768: { slidesPerView: 1 },
                }}
              >
                {blogData.map((element) => (
                  <SwiperSlide key={element._id}>
                    <div className="w-full flex justify-center">
                      <BlogCard data={element} />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Grid View for Larger Screens */}
            <div className="hidden lg:grid xl:grid-cols-3 md:grid-cols-2 mx-auto gap-16 grid-cols-1 text-center mb-10" style={{marginLeft: "300px" }}>
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
