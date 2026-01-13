<<<<<<< HEAD
import React, { useEffect, useState } from "react";
import "./workerList.scss";
import { useDispatch, useSelector } from "react-redux";
import { getAllWorkers, deleteWorkerById, downloadWorkersCSV, downloadBillingCSV } from "../../Redux/Slices/offlineUserSlice";
=======
import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";
>>>>>>> 7406ecfdb1b496bf8f9af7b0d29d04cb3b66a3a6
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDeleteWorkerByIdMutation, useGetAllWorkersQuery } from "../../Redux/Slices/offlineUserSlice";

const WorkerList = () => {
  const navigate = useNavigate();
<<<<<<< HEAD
  const { workers, loading } = useSelector((state) => state.offlineUser);
=======
>>>>>>> 7406ecfdb1b496bf8f9af7b0d29d04cb3b66a3a6
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");


  const { data, isLoading } = useGetAllWorkersQuery();
  const [deleteWorker] = useDeleteWorkerByIdMutation();

  const filteredWorkers = data?.users?.filter(
    (w) =>
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.email.toLowerCase().includes(search.toLowerCase())
  );

<<<<<<< HEAD
const handleDownload = async (type) => {
  try {
    let blob;
    let params = {};

    // Agar month/year diya hai to hi query bhejenge
    if (month) params.month = month;
    if (year) params.year = year;

    if (type === "workers") {
      blob = await dispatch(downloadWorkersCSV(params)).unwrap();
      downloadFile(blob, `workers-${month || "all"}-${year || "all"}.csv`);
    } else {
      blob = await dispatch(downloadBillingCSV(params)).unwrap();
      downloadFile(blob, `billing-${month || "all"}-${year || "all"}.csv`);
    }
  } catch (error) {
    console.error("Download failed:", error);
    alert("Download failed!");
  }
};

  const downloadFile = (blob, filename) => {
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="worker-list-container">
      <h2>All Workers</h2>
<div className="filter-box">
  <select value={month} onChange={(e) => setMonth(e.target.value)}>
    <option value="">All Months</option>
    <option value="1">January</option>
    <option value="2">February</option>
    <option value="3">March</option>
    <option value="4">April</option>
    <option value="5">May</option>
    <option value="6">June</option>
    <option value="7">July</option>
    <option value="8">August</option>
    <option value="9">September</option>
    <option value="10">October</option>
    <option value="11">November</option>
    <option value="12">December</option>
  </select>

  <input
    type="number"
    placeholder="Year (optional)"
    value={year}
    onChange={(e) => setYear(e.target.value)}
  />
</div>

      <div className="top-bar">
        <button className="download-btn" onClick={() => handleDownload("workers")}>
          <i className="fa-solid fa-download"></i> Download Workers CSV
        </button>
        <button className="download-btn" onClick={() => handleDownload("billing")}>
          <i className="fa-solid fa-download"></i> Download Billing CSV
        </button>

=======
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
>>>>>>> 7406ecfdb1b496bf8f9af7b0d29d04cb3b66a3a6
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
<<<<<<< HEAD
                  <tr key={worker._id}>
                    <td>{index + 1}</td>
                    <td>{worker.name}</td>
                    <td>{worker.email}</td>
                    <td>{worker.role}</td>
                    <td>{worker.createdAt?.split("T")[0]}</td>
                    <td className="action-btns">
=======
                  <tr key={worker._id} className="hover:bg-gray-50 even:bg-gray-100">
                    <td className="px-4 py-2  text-center">{index + 1}</td>
                    <td className="px-4 py-2 ">{worker.name}</td>
                    <td className="px-4 py-2 ">{worker.email}</td>
                    <td className="px-4 py-2 ">{worker.role}</td>
                    <td className="px-4 py-2 ">{new Date(worker.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-2  flex gap-2 justify-center">
>>>>>>> 7406ecfdb1b496bf8f9af7b0d29d04cb3b66a3a6
                      <button
                        className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                        onClick={() => navigate("/create-worker", { state: worker })}
                      >
                        <Edit />
                      </button>
                      <button
<<<<<<< HEAD
                        className="delete-btn"
                        onClick={() => {
                          if (window.confirm("Are you sure you want to delete this worker?")) {
                            dispatch(deleteWorkerById(worker._id));
                          }
                        }}
=======
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        onClick={() => handleDelete(worker._id)}
>>>>>>> 7406ecfdb1b496bf8f9af7b0d29d04cb3b66a3a6
                      >
                        <Trash2 />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
<<<<<<< HEAD
                  <td colSpan="6" className="no-data">No workers found</td>
=======
                  <td colSpan="6" className="text-center p-4">
                    No workers found
                  </td>
>>>>>>> 7406ecfdb1b496bf8f9af7b0d29d04cb3b66a3a6
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
