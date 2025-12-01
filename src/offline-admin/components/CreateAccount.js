import React, { useState } from "react";
import "./createWorker.scss";
import OfflineSidebar from "./OfflineSidebar";

const CreateWorkerAccount = () => {
  const [workerName, setWorkerName] = useState("");
  const [workerId, setWorkerId] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("worker");

  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!workerName || !workerId || !password) {
      setMessage("⚠️ Please fill all fields!");
      return;
    }

    const newWorker = {
      workerName,
      workerId,
      password,
      role,
    };

    console.log("Create Worker -> ", newWorker);

    // Yaha API call / Redux dispatch karoge
    // dispatch(createWorker(newWorker));

    setMessage("🎉 Worker Created Successfully!");
    setWorkerName("");
    setWorkerId("");
    setPassword("");
  };

  return (
    <div className="create-worker=layout">
      <OfflineSidebar/>
    <div className="create-worker-container">
      <h2>Create Worker Login</h2>

      {message && <p className="form-message">{message}</p>}

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

        <button type="submit" className="submit-btn">
          Create Worker
        </button>
      </form>
    </div>
        </div>
  );
};

export default CreateWorkerAccount;
