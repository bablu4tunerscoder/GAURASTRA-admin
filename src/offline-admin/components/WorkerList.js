import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDeleteWorkerByIdMutation, useGetAllWorkersQuery } from "../../Redux/Slices/offlineUserSlice";

const WorkerList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const { data, isLoading } = useGetAllWorkersQuery();
  const [deleteWorker] = useDeleteWorkerByIdMutation();

  const filteredWorkers = data?.users?.filter(
    (w) =>
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this worker?")) {
      try {
        await deleteWorker(id).unwrap();
        toast.success("✅ Worker deleted successfully!");
      } catch (err) {
        toast.error("❌ Failed to delete worker!");
      }
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold mb-4">All Workers</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-3 py-2 border rounded shadow-sm"
        />
      </div>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        {isLoading ? (
          <p className="p-4 text-center">Loading workers...</p>
        ) : (
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-gray-500 text-white">
              <tr>
                <th className="px-4 py-2">S.No</th>
                <th className="px-4 py-2">Worker Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Created At</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredWorkers && filteredWorkers.length > 0 ? (
                filteredWorkers.map((worker, index) => (
                  <tr key={worker._id} className="hover:bg-gray-50 even:bg-gray-100">
                    <td className="px-4 py-2  text-center">{index + 1}</td>
                    <td className="px-4 py-2 ">{worker.name}</td>
                    <td className="px-4 py-2 ">{worker.email}</td>
                    <td className="px-4 py-2 ">{worker.role}</td>
                    <td className="px-4 py-2 ">{new Date(worker.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-2  flex gap-2 justify-center">
                      <button
                        className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                        onClick={() => navigate("/create-worker", { state: worker })}
                      >
                        <Edit />
                      </button>
                      <button
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        onClick={() => handleDelete(worker._id)}
                      >
                        <Trash2 />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center p-4">
                    No workers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default WorkerList;
