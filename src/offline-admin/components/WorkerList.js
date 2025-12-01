import React, { useEffect, useState } from "react";
import "./workerList.scss";
import OfflineSidebar from "./OfflineSidebar";

const WorkerList = () => {
  const [workers, setWorkers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const dummyData = [
      {
        _id: "1",
        workerName: "Sandeep Sharma",
        workerId: "worker101",
        role: "Worker",
        createdAt: "2025-01-05",
      },
      {
        _id: "2",
        workerName: "Aman Gupta",
        workerId: "worker102",
        role: "Worker",
        createdAt: "2025-02-20",
      },
      {
        _id: "3",
        workerName: "Rohan Singh",
        workerId: "worker103",
        role: "Worker",
        createdAt: "2025-03-10",
      },
    ];

    setWorkers(dummyData);
  }, []);

  const filteredWorkers = workers.filter((w) =>
    w.workerName.toLowerCase().includes(search.toLowerCase()) ||
    w.workerId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="worker-layout">
      <OfflineSidebar/>
    <div className="worker-list-container">
      <h2>All Workers</h2>

      <div className="top-bar">
        <input
          type="text"
          placeholder="Search by name or user ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-box"
        />
      </div>
<div className="table-wrapper">

      <table className="worker-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Worker Name</th>
            <th>User ID</th>
            <th>Role</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredWorkers.length > 0 ? (
            filteredWorkers.map((worker, index) => (
              <tr key={worker._id}>
                <td>{index + 1}</td>
                <td>{worker.workerName}</td>
                <td>{worker.workerId}</td>
                <td>{worker.role}</td>
                <td>{worker.createdAt}</td>
                <td className="action-btns">
                  <button className="edit-btn">
                    <i className="fa-solid fa-pen"></i>
                  </button>
                  <button className="delete-btn">
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
    </div>
        </div>

        </div>
  );
};

export default WorkerList;
