import { useNavigate } from "react-router-dom";
import {
  useGetAllUsersQuery,
} from "../Redux/Slices/userSlice"; // RTK Query API
import "./UsersList.scss";

const UsersList = () => {
  const navigate = useNavigate();

  // Fetch users with RTK Query (Auto-fetches, caching, loading & error handled)
  const {
    data: allUsers = [],
    success,
  } = useGetAllUsersQuery();


  const handleEdit = (user) => {
    navigate(`/users/${user.user_id}`);
  };

  return (
    <div className="w-full">
      <div className="bg-white shadow rounded-lg p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">All Users</h1>
        </div>

        {/* States */}
        {success ? (
          <p className="text-red-600 font-medium">Something went wrong</p>
        ) : allUsers.count === 0 ? (
          <p className="text-gray-600 italic">No Users Found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full rounded-lg overflow-hidden">
              <thead className="bg-gray-600">
                <tr>
                  <th className="px-4 py-3 text-white font-medium text-left">S.No</th>
                  <th className="px-4 py-3 text-white font-medium text-left">Name</th>
                  <th className="px-4 py-3 text-white font-medium text-left">Email</th>
                  <th className="px-4 py-3 text-white font-medium text-center">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {allUsers.data && allUsers.data.length > 0 ? (
                  allUsers.data.map((user, index) => (
                    <tr
                      key={user.user_id}
                      className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition"
                    >
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3">{user.name}</td>
                      <td className="px-4 py-3">{user.email}</td>
                      <td className="px-4 py-3 flex justify-center">
                        <button
                          onClick={() => handleEdit(user)}
                          className="px-3 py-1 bg-blue-500 text-white border border-blue-500 rounded hover:bg-blue-600 hover:border-blue-600 text-sm"
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
                      className="px-4 py-6 text-center text-gray-600"
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
