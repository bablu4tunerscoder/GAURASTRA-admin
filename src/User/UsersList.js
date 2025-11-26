import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {useNavigate} from "react-router-dom"
import { fetchAllUsers } from "../Redux/Slices/userSlice"; 
import "./UsersList.scss";
import Sidebar from "../Components/Sidebar/sidebar";

const UsersList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { allUsers, isLoading, error } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleEdit = (user) => {
    navigate(`/users/${user.user_id}`)
  };

  return (
    <div className="layout">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="user-container">
        <div className="user-header">
          <h1>All User's</h1>
        </div>

        {isLoading ? (
          <p>Loading users...</p>
        ) : error ? (
          <p className="error-message">{`Something Went Wrong`}</p>
        ) : allUsers.length === 0 ? (
          <p className="info-message">No User's Found</p>
        ) : (
          <div className="table-container">
            <table className="user-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map((users, index) => (
                  <tr key={users.user_id}>
                    <td>{index + 1}</td>
                    <td>{users.name}</td>
                    <td>{users.email}</td>
                    <td>
                      <button className="view-btn" onClick={() => handleEdit(users)}>
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersList;
