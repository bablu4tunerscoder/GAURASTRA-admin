import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchUserById } from "../Redux/Slices/userSlice";
import Sidebar from "../Components/Sidebar/sidebar";
import "./UserDetails.scss";

const UserDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams(); // Getting userId from URL params
  const { singleUser, isLoading, error } = useSelector((state) => state.user);

  // Dispatch action to fetch user details by ID
  useEffect(() => {
    dispatch(fetchUserById(id));
  }, [dispatch, id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Helper function to handle empty values
  const handleNoData = (data, label, isPhone = false) => {
    // If it's the phone field and its value is 0, return "No data provided"
    if (isPhone && data === "0") {
      return <span>No data provided</span>;
    }
    if (!data) {
      return <span>{label}</span>;
    }
    return data;
  };

  return (
    <div className="layout">
      <Sidebar/>
      <div className="user-details">
        <h1>User Details</h1>
        {singleUser && (
          <div className="user-card">
            <div className="user-info-box">
              {/* Image Box */}
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
              <div className="user-contact">
                <p>
                  <strong>Name:</strong>{" "}
                  {handleNoData(singleUser.name, "No data provided")}
                </p>
                <p>
                  <strong>Email:</strong>{" "}
                  {handleNoData(singleUser.email, "No data provided")}
                </p>
                <p>
                  <strong>Phone:</strong>{" "}
                  {handleNoData(singleUser.phone, "No data provided", true)}
                </p>
              </div>
            </div>
            <div className="user-other-details">
              <p>
                <strong>Address:</strong>{" "}
                {handleNoData(singleUser.address, "No data provided")}
              </p>
              <p>
                <strong>Role:</strong>{" "}
                {handleNoData(singleUser.role, "No data provided")}
              </p>
              <p>
                <strong>Location:</strong>{" "}
                {handleNoData(singleUser.networkAddress, "No data provided")}
              </p>
              <p>
                <strong>IP Address:</strong>{" "}
                {handleNoData(singleUser.ipAddress, "No data provided")}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {handleNoData(singleUser.status, "No data provided")}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetails;
