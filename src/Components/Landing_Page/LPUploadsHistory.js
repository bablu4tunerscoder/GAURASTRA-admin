import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  useFetchLandingContentQuery,
  useDeleteLandingContentMutation,
  useUpdateLandingContentMutation,
} from "../../Redux/Slices/landingSlice";
import { BASE_URL } from "../Helper/axiosinstance";
import { getImageUrl } from "../../utils/getImageUrl";

const LPUploadsHistory = () => {
  const { data: content = [], isLoading, error } = useFetchLandingContentQuery();
  const [deleteLandingContent] = useDeleteLandingContentMutation();
  const [updateLandingContent] = useUpdateLandingContentMutation();

  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      heading1: "",
      heading2: "",
      description: "",
      image: null,
    },
  });

  const imageFile = watch("image");

  useEffect(() => {
    if (imageFile && imageFile[0]) {
      setImagePreview(URL.createObjectURL(imageFile[0]));
    }
  }, [imageFile]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this content?")) {
      await deleteLandingContent(id);
    }
  };

  const handleOpenModal = (item) => {
    setEditItem(item);
    reset({
      heading1: item.heading1,
      heading2: item.heading2,
      description: item.description,
      image: null,
    });
    setImagePreview(
      item.images?.[0] ? `${BASE_URL}${item.images[0]}` : ""
    );
    setShowModal(true);
  };

  const handleImageDelete = () => {
    setValue("image", null);
    setImagePreview("");
  };

  const onSubmit = async (data) => {
    if (!editItem) return;

    const formData = new FormData();
    formData.append("heading1", data.heading1);
    formData.append("heading2", data.heading2);
    formData.append("description", data.description);
    if (data.image?.[0]) {
      formData.append("images", data.image[0]);
    }

    await updateLandingContent({
      id: editItem._id,
      updatedData: formData,
    });

    setShowModal(false);
  };

  return (
    <div>
      <Sidebar/>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4" style={{textAlign : "center"}}>Landing Page Upload History</h2>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" style={{maxWidth:"70%", marginLeft:"18rem"}}>
          {content?.length > 0 ? (
            content.map((item, index) => (
              <div key={index} className="border rounded-lg shadow-md p-4">
                <h3 className="font-semibold mb-1">Heading 1: {item.heading1}</h3>
                <h4 className="text-gray-600 mb-1">Heading 2: {item.heading2}</h4>
                <p className="text-sm text-gray-700 mb-2">
                  Description: {item.description}
                </p>

              {item.images?.[0] && (
                <img
                  src={getImageUrl(item.images[0])}
                  alt="landing"
                  className="w-full rounded mb-3"
                />
              )}

              <div className="flex justify-between gap-2">
                <button
                  onClick={() => handleDelete(item._id)}
                  className="bg-red-500 flex-1 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleOpenModal(item)}
                  className="bg-blue-500 flex-1 hover:bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Update
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full">No uploads found.</p>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">
              Update Landing Content
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <input
                {...register("heading1")}
                placeholder="Heading 1"
                className="w-full border rounded px-3 py-2"
              />

              <input
                {...register("heading2")}
                placeholder="Heading 2"
                className="w-full border rounded px-3 py-2"
              />

              <textarea
                {...register("description")}
                placeholder="Description"
                rows={3}
                className="w-full border rounded px-3 py-2"
              />

              {imagePreview && (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="w-full rounded"
                  />
                  <button
                    type="button"
                    onClick={handleImageDelete}
                    className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full"
                  >
                    ×
                  </button>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                {...register("image")}
                className="w-full"
              />

              <div className="flex justify-between pt-2">
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LPUploadsHistory;
