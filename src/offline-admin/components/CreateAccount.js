import React, { useState, useEffect } from "react";
import "./createWorker.scss";
import OfflineSidebar from "./OfflineSidebar";
import { useDispatch, useSelector } from "react-redux";
import {
  createOfflineWorker,
  updatePasswordById,
  resetStatus,
  getAllWorkers
} from "../../Redux/Slices/offlineUserSlice";
import { useLocation } from "react-router-dom";

const CreateWorkerAccount = () => {
  const location = useLocation();
  const editData = location.state || null;
const [latestWorker, setLatestWorker] = useState(null);

  const [workerName, setWorkerName] = useState("");
  const [workerId, setWorkerId] = useState("");
  const [password, setPassword] = useState("");
  const [role] = useState("worker");

  const [showPass, setShowPass] = useState(false);

  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.offlineUser);

  useEffect(() => {
  if (success && !editData) {
    
    // Worker create hua → ab latest worker fetch karo
    dispatch(getAllWorkers()).then((res) => {
      const users = res.payload?.users || [];
      if (users.length > 0) {
        const lastCreated = users[users.length - 1]; // latest worker
        setLatestWorker(lastCreated);
      }
    });

    alert("🎉 Worker Created Successfully!");

    setWorkerName("");
    setWorkerId("");
    setPassword("");

    setTimeout(() => dispatch(resetStatus()), 1500);
  }
}, [success]);

  useEffect(() => {
    if (editData) {
      setWorkerName(editData.name);
      setWorkerId(editData.email);
      setPassword("");
    }
  }, [editData]);

  // 🛑 PASSWORD VALIDATION FUNCTION
  const validatePassword = (pwd) => {
    if (pwd.length < 6 || pwd.length > 8) {
      alert("⚠️ Password must be 6 to 8 characters long!");
      return false;
    }

    const onlyNumbers = /^[0-9]+$/;
    if (onlyNumbers.test(pwd)) {
      alert("⚠️ Password cannot be only numbers!");
      return false;
    }

    const onlyLetters = /^[a-zA-Z]+$/;
    if (onlyLetters.test(pwd)) {
      alert("⚠️ Password cannot be only letters!");
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ⭐ CREATE MODE ⭐
    if (!editData) {
      if (!workerName || !workerId || !password) {
        alert("⚠️ Please fill all fields!");
        return;
      }

      // 🚫 Validate password rules
      if (!validatePassword(password)) return;

      const newWorker = {
        name: workerName,
        email: workerId,
        password,
        role,
      };

      // 🔥 Show POST data in console
      console.log("📌 Posting Worker Data: ", newWorker);

      dispatch(createOfflineWorker(newWorker));
      return;
    }

    // ⭐ EDIT MODE ⭐ (only password update allowed)
    if (password.trim() === "") {
      alert("⚠️ Please enter new password to update!");
      return;
    }

    // 🚫 Validate password rules
    if (!validatePassword(password)) return;

dispatch(updatePasswordById({ id: editData._id, newPassword: password }));
  };

  useEffect(() => {
    if (success) {
      alert(editData ? "✅ Password Updated Successfully!" : "🎉 Worker Created Successfully!");
      if (!editData) {
        setWorkerName("");
        setWorkerId("");
        setPassword("");
      }
      setTimeout(() => dispatch(resetStatus()), 1500);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      alert("❌ " + error);
      dispatch(resetStatus());
    }
  }, [error]);

  return (
      <div className="create-worker-container">
        <h2>{editData ? "Change Worker Password" : "Create Worker Login"}</h2>

        <form onSubmit={handleSubmit} className="worker-form">

          <div className="form-group">
            <label>Worker Name</label>
            <input
              type="text"
              placeholder="Enter worker full name"
              value={workerName}
              onChange={(e) => setWorkerName(e.target.value)}
              disabled={editData}
            />
          </div>

          <div className="form-group">
            <label>Email ID</label>
            <input
              type="text"
              placeholder="Enter worker email"
              value={workerId}
              onChange={(e) => setWorkerId(e.target.value)}
              disabled={editData}
            />
          </div>

          {/* Password Field */}
          <div className="form-group password-box">
            <label>Password {editData && "(Enter new password)"}</label>

            <div className="pass-wrapper">
              <input
                type={showPass ? "text" : "password"}
                placeholder={editData ? "New password" : "Create password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <span
                className="pass-eye"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? "👁️" : "🙈"}
              </span>
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading
              ? editData
                ? "Updating..."
                : "Creating..."
              : editData
              ? "Update Password"
              : "Create Worker"}
          </button>
        </form>
      {latestWorker && (
  <div className="worker-created-preview">
    <h3>🎉 Worker Created Preview</h3>

    <p><strong>Name:</strong> {latestWorker.name}</p>
    <p><strong>Email:</strong> {latestWorker.email}</p>
    <p><strong>Role:</strong> {latestWorker.role}</p>
    <p><strong>Created At:</strong> 
      {new Date(latestWorker.createdAt).toLocaleString()}
    </p>
  </div>
)}
    </div>
  );
};

export default CreateWorkerAccount;
