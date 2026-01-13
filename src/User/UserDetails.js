import React from "react";
import { useParams } from "react-router-dom";
import { useGetUserByIdQuery } from "../Redux/Slices/userSlice";
import { BASE_URL } from "../Components/Helper/axiosinstance";

const UserDetails = () => {
  const { id } = useParams();




  const getImageUrl = (image) => {
    if (!image) return "/default-avatar.png";
    if (image.startsWith("http")) return image;
    return `${BASE_URL}${image}`;
  };
  const { data: singleUser, isLoading, error } = useGetUserByIdQuery(id);
  if (isLoading || !singleUser) return (
    <div className="flex h-screen items-center justify-center text-gray-500">
      Loading...
    </div>
  );

  if (error)
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        {error?.data?.message || "Error fetching user"}
      </div>
    );

  const handleNoData = (value, fallback, isPhone = false) => {
    if (isPhone && (value === "0" || value === 0))
      return <span className="text-gray-400">No data provided</span>;
    if (!value)
      return <span className="text-gray-400">{fallback}</span>;
    return value;
  };


  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-6 text-2xl font-semibold text-gray-800">
          User Details
        </h1>

        {singleUser && (
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            {/* TOP SECTION */}
            <div className="flex flex-col gap-6 md:flex-row">
              {/* IMAGE */}
              <div className="flex w-full flex-col items-center md:w-1/3">
                <img
                  src={getImageUrl(singleUser.profileImage)}
                  onError={(e) => (e.target.src = "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png")}
                  alt="Profile"
                  className="h-32 w-32 rounded-full border object-cover"
                />

                {!singleUser.profileImage && (
                  <p className="mt-2 text-sm text-gray-400">
                    No image uploaded
                  </p>
                )}
              </div>

              {/* BASIC INFO */}
              <div className="w-full md:w-2/3 space-y-3">
                <p className="text-gray-700">
                  <span className="font-medium">Name:</span>{" "}
                  {handleNoData(singleUser.name, "No data provided")}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Email:</span>{" "}
                  {handleNoData(singleUser.email, "No data provided")}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Phone:</span>{" "}
                  {handleNoData(singleUser.phone, "No data provided", true)}
                </p>
              </div>
            </div>

            {/* DIVIDER */}
            <div className="my-6 h-px bg-gray-200" />

            {/* OTHER DETAILS */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <p className="text-gray-700">
                <span className="font-medium">Address:</span>{" "}
                {handleNoData(singleUser.address, "No data provided")}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Role:</span>{" "}
                {handleNoData(singleUser.role, "No data provided")}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Location:</span>{" "}
                {handleNoData(singleUser.networkAddress, "No data provided")}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">IP Address:</span>{" "}
                {handleNoData(singleUser.ipAddress, "No data provided")}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Status:</span>{" "}
                <span
                  className={`ml-1 inline-flex rounded-full px-3 py-1 text-xs font-medium ${singleUser.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                    }`}
                >
                  {handleNoData(singleUser.status, "No data provided")}
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetails;
