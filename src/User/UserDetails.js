import React from "react";
import { useParams } from "react-router-dom";
import { useGetUserByIdQuery } from "../Redux/Slices/userSlice";
import Sidebar from "../Components/Sidebar/sidebar";
import "./UserDetails.scss";

const UserDetails = () => {
  const { id } = useParams();

  // 🔥 RTK Query call (auto fetch)
  const { data: singleUser, isLoading, error } = useGetUserByIdQuery(id);

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>{error?.data?.message || "Error fetching user"}</div>;

  const handleNoData = (value, fallback, isPhone = false) => {
    if (isPhone && (value === "0" || value === 0)) return <span>No data provided</span>;
    if (!value) return <span>{fallback}</span>;
    return value;
  };

  return (
    <div className="layout">
      <Sidebar />

      <div className="user-details">
        <h1>User Details</h1>

        {singleUser && (
          <div className="user-card">

            <div className="user-info-box">

              {/* PROFILE IMAGE */}
              <div className="user-image-container">
                <img
                  src={singleUser.profileImage || "/default-avatar.png"}
                  alt="Profile"
                  className="user-image"
                />
                <p className="image-status">
                  {singleUser.profileImage ? "" : "No image uploaded"}
                </p>
              </div>

              {/* BASIC INFO */}
              <div className="user-contact">
                <p><strong>Name:</strong> {handleNoData(singleUser.name, "No data provided")}</p>
                <p><strong>Email:</strong> {handleNoData(singleUser.email, "No data provided")}</p>
                <p><strong>Phone:</strong> {handleNoData(singleUser.phone, "No data provided", true)}</p>
              </div>

            </div>

            {/* OTHER DETAILS */}
            <div className="user-other-details">
              <p><strong>Address:</strong> {handleNoData(singleUser.address, "No data provided")}</p>
              <p><strong>Role:</strong> {handleNoData(singleUser.role, "No data provided")}</p>
              <p><strong>Location:</strong> {handleNoData(singleUser.networkAddress, "No data provided")}</p>
              <p><strong>IP Address:</strong> {handleNoData(singleUser.ipAddress, "No data provided")}</p>
              <p><strong>Status:</strong> {handleNoData(singleUser.status, "No data provided")}</p>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetails;
