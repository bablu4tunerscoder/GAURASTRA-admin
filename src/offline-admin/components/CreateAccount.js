import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import 'react-toastify/dist/ReactToastify.css';
import {
  useCreateOfflineWorkerMutation,
  useUpdatePasswordByIdMutation,
  useGetAllWorkersQuery
} from "../../Redux/Slices/offlineUserSlice";
import toast from "react-hot-toast";

const CreateWorkerAccount = () => {
  const location = useLocation();
  const editData = location.state || null;

  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [showPass, setShowPass] = useState(false);
  const [latestWorker, setLatestWorker] = useState(null);

  const [createWorker, { isLoading: creating, isSuccess: created, error: createError }] = useCreateOfflineWorkerMutation();
  const [updatePassword, { isLoading: updating, isSuccess: updated, error: updateError }] = useUpdatePasswordByIdMutation();
  const { data: allWorkers } = useGetAllWorkersQuery();

  useEffect(() => {
    if (created && !editData) {
      toast.success("🎉 Worker Created Successfully!");
      const lastCreated = allWorkers?.users?.[allWorkers.users.length - 1];
      if (lastCreated) setLatestWorker(lastCreated);
      reset();
    }
  }, [created, allWorkers, editData, reset]);

  useEffect(() => {
    if (updated && editData) {
      toast.success("✅ Password Updated Successfully!");
      reset();
    }
  }, [updated, editData, reset]);

  useEffect(() => {
    if (createError) toast.error(createError);
    if (updateError) toast.error(updateError);
  }, [createError, updateError]);

  const validatePassword = (pwd) => {
    if (pwd.length < 6) return "Password must be 6 or more characters long";
    if (/^[0-9]+$/.test(pwd)) return "Password cannot be only numbers";
    if (/^[a-zA-Z]+$/.test(pwd)) return "Password cannot be only letters";
    return true;
  };

  const onSubmit = (data) => {
    const { workerName, workerId, password } = data;

    if (!editData) {
      createWorker({
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

    dispatch(updatePasswordById({ id: editData._id, password }));
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
    <div className="create-worker-layout">
      <OfflineSidebar />

      <div className="create-worker-container">
        <h2>{editData ? "Change Worker Password" : "Create Worker Login"}</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {!editData && (
            <>
              <div>
                <label className="block font-medium mb-1">Worker Name</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  {...register("workerName", { required: "Worker Name is required" })}
                />
                {errors.workerName && <p className="text-red-500 text-sm mt-1">{errors.workerName.message}</p>}
              </div>

              <div>
                <label className="block font-medium mb-1">Email ID</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  {...register("workerId", { required: "Email is required" })}
                />
                {errors.workerId && <p className="text-red-500 text-sm mt-1">{errors.workerId.message}</p>}
              </div>
            </>
          )}

          <div>
            <label className="block font-medium mb-1">Password {editData && "(Enter new password)"}</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                className="w-full border border-gray-300 rounded px-3 py-2 pr-10"
                placeholder={editData ? "New password" : "Create password"}
                {...register("password", { required: "Password is required", validate: validatePassword })}
              />
              <span
                className="absolute right-3 top-2 cursor-pointer select-none"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? "👁️" : "🙈"}
              </span>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            disabled={creating || updating}
          >
            {creating || updating ? (editData ? "Updating..." : "Creating...") : (editData ? "Update Password" : "Create Worker")}
          </button>
        </form>
      </div>
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
