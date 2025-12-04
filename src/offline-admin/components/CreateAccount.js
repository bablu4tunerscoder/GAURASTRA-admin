import React, { useState, useEffect } from "react";
import "./createWorker.scss";
import OfflineSidebar from "./OfflineSidebar";
import { useDispatch, useSelector } from "react-redux";
import { createOfflineWorker, resetStatus } from "../../Redux/Slices/offlineUserSlice";

const CreateWorkerAccount = () => {
  const [workerName, setWorkerName] = useState("");
  const [workerId, setWorkerId] = useState("");
  const [password, setPassword] = useState("");
  const [role] = useState("worker");

  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.offlineUser);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!workerName || !workerId || !password) {
      alert("⚠️ Please fill all fields!");
      return;
    }

    const newWorker = {
      name: workerName,   
      email: workerId,
     password,
      role,
    };

    dispatch(createOfflineWorker(newWorker));
  };

  useEffect(() => {
    if (success) {
      alert("🎉 Worker Created Successfully!");
      setWorkerName("");
      setWorkerId("");
      setPassword("");

      setTimeout(() => {
        dispatch(resetStatus());
      }, 2000);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      alert("❌ " + error);
      dispatch(resetStatus());
    }
  }, [error]);

  return (
    <div className="create-worker-layout">
      <OfflineSidebar />
      <div className="create-worker-container">
        <h2>Create Worker Login</h2>

        <form onSubmit={handleSubmit} className="worker-form">
          <div className="form-group">
            <label>Worker Name</label>
            <input
              type="text"
              placeholder="Enter worker full name"
              value={workerName}
              onChange={(e) => setWorkerName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>User ID</label>
            <input
              type="text"
              placeholder="Create user ID (example: worker123)"
              value={workerId}
              onChange={(e) => setWorkerId(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Creating..." : "Create Worker"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateWorkerAccount;
