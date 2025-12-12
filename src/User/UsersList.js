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
    <div className="flex p-6">
      <div className="w-full max-w-6xl">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">All Users</h1>
        </div>

        {/* Loading & Error */}
        {isLoading ? (
          <p className="text-gray-500">Loading users...</p>
        ) : isError ? (
          <p className="text-red-500">Something went wrong</p>
        ) : allUsers.length === 0 ? (
          <p className="text-gray-600">No Users Found</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full border-collapse text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 font-semibold text-gray-700 border-b">S.No</th>
                  <th className="px-4 py-3 font-semibold text-gray-700 border-b">Name</th>
                  <th className="px-4 py-3 font-semibold text-gray-700 border-b">Email</th>
                  <th className="px-4 py-3 font-semibold text-gray-700 border-b">Actions</th>
                </tr>
              </thead>

              <tbody>
                {allUsers.map ? (
                  allUsers.map((user, index) => (
                    <tr key={user.user_id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 border-b">{index + 1}</td>
                      <td className="px-4 py-3 border-b">{user.name}</td>
                      <td className="px-4 py-3 border-b">{user.email}</td>
                      <td className="px-4 py-3 border-b">
                        <button
                          onClick={() => handleEdit(user)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center text-red-500 py-4"
                    >
                      No Users Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>

  );
};

export default UsersList;
