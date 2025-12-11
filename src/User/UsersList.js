import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar/sidebar";
import {
  useGetAllUsersQuery,
} from "../Redux/Slices/userSlice"; // RTK Query API
import "./UsersList.scss";

const UsersList = () => {
  const navigate = useNavigate();

  // Fetch users with RTK Query (Auto-fetches, caching, loading & error handled)
  const {
    data: allUsers = [],
    isLoading,
    isError,
  } = useGetAllUsersQuery();

  const handleEdit = (user) => {
    navigate(`/users/${user.user_id}`);
  };

  return (
    <div className="layout">
      <Sidebar />

      <div className="user-container">
        <div className="user-header">
          <h1>All User's</h1>
        </div>

        {isLoading ? (
          <p>Loading users...</p>
        ) : isError ? (
          <p className="error-message">Something Went Wrong</p>
        ) : allUsers.length === 0 ? (
          <p className="info-message">No User's Found</p>
        ) : (
          <div className="table-container">
            <table className="user-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {allUsers.map((user, index) => (
                  <tr key={user.user_id}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <button
                        className="view-btn"
                        onClick={() => handleEdit(user)}
                      >
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
