import React, { useEffect, useState } from "react";
import "./workerList.scss";
import { useDispatch, useSelector } from "react-redux";
import { getAllWorkers, deleteWorkerById, downloadWorkersCSV, downloadBillingCSV } from "../../Redux/Slices/offlineUserSlice";
import { useNavigate } from "react-router-dom";

const WorkerList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { workers, loading } = useSelector((state) => state.offlineUser);
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");


  useEffect(() => {
    dispatch(getAllWorkers());
  }, [dispatch]);

  const filteredWorkers = workers?.filter((w) =>
    w.name.toLowerCase().includes(search.toLowerCase()) ||
    w.email.toLowerCase().includes(search.toLowerCase())
  );

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

        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-box"
        />
      </div>

      <div className="table-wrapper">
        {loading ? (
          <p className="loading-text">Loading workers...</p>
        ) : (
          <table className="worker-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Worker Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredWorkers && filteredWorkers.length > 0 ? (
                filteredWorkers.map((worker, index) => (
                  <tr key={worker._id}>
                    <td>{index + 1}</td>
                    <td>{worker.name}</td>
                    <td>{worker.email}</td>
                    <td>{worker.role}</td>
                    <td>{worker.createdAt?.split("T")[0]}</td>
                    <td className="action-btns">
                      <button
                        className="edit-btn"
                        onClick={() => navigate("/create-worker", { state: worker })}
                      >
                        <i className="fa-solid fa-pen"></i>
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => {
                          if (window.confirm("Are you sure you want to delete this worker?")) {
                            dispatch(deleteWorkerById(worker._id));
                          }
                        }}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data">No workers found</td>
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
