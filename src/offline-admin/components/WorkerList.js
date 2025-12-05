import React, { useEffect, useState } from "react";
import "./workerList.scss";
import { useDispatch, useSelector } from "react-redux";
import { getAllWorkers, deleteWorkerById } from "../../Redux/Slices/offlineUserSlice";
import { useNavigate } from "react-router-dom";

const WorkerList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { workers, loading } = useSelector((state) => state.offlineUser);

  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(getAllWorkers());
  }, [dispatch]);

  const filteredWorkers = workers?.filter((w) =>
    w.name.toLowerCase().includes(search.toLowerCase()) ||
    w.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="worker-list-container">
      <h2>All Workers</h2>

      <div className="top-bar">
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
                          const confirmDelete = window.confirm(
                            "Are you sure you want to delete this worker?"
                          );
                          if (confirmDelete) {
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
                  <td colSpan="6" className="no-data">
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
