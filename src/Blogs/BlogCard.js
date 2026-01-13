import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../utils/getImageUrl";

function BlogCard({ data }) {
  const navigate = useNavigate();
  const url = data?.thumbnail?.secure_url?.replace(/\\/g, '/').replace(/^\/+/, '');

  return (
    <div
      onClick={() => navigate("/blog/description/", { state: { ...data } })}
      className="w-[20rem] shadow-lg rounded-lg cursor-pointer group overflow-hidden bg-white hover:scale-105 transition-transform duration-300"
    >
      <div className="overflow-hidden relative">
        <img
          className="h-48 w-full rounded-tl-lg rounded-tr-lg group-hover:scale-110 transition-all duration-300 object-cover"
          src={getImageUrl(url)}
          alt="course thumbnail"
        />
        <div className="absolute top-2 left-2 bg-black text-white px-3 py-1 rounded-md text-sm font-semibold">
          {data.blog_status}
        </div>
      </div>
      <div className="p-5 space-y-2 text-gray-700">
        <h2 className="text-xl font-semibold text-black line-clamp-2">{data?.blog_title}</h2>
        <p className="text-sm line-clamp-2">{data?.description}</p>
        <p className="font-semibold">
          <span className="text-black font-bold">Author: </span>
          {data?.author}
        </p>
        <p className="font-semibold">
          <span className="text-black font-bold">Published: </span>
          {data.blog_published}
        </p>
      </div>
    </div>
  );
}

export default BlogCard;
