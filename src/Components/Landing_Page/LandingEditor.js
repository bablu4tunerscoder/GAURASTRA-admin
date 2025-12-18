import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  useCreateLandingContentMutation,
} from "../../Redux/Slices/landingSlice";

const LandingEditor = () => {
  const navigate = useNavigate();
  const [createLandingContent, { isLoading, isSuccess, error }] =
    useCreateLandingContentMutation();

  const [preview, setPreview] = useState("");
  const [imageError, setImageError] = useState("");

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
      const file = imageFile[0];
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        if (img.width >= 1500 && img.height >= 900) {
          setPreview(img.src);
          setImageError("");
        } else {
          setImageError("Image must be at least 1500×900 pixels");
          setPreview("");
          setValue("image", null);
        }
      };
    }
  }, [imageFile, setValue]);

  const onSubmit = async (data) => {
    if (!data.image?.[0]) {
      setImageError("Please upload a valid image");
      return;
    }

    const formData = new FormData();
    formData.append("heading1", data.heading1);
    formData.append("heading2", data.heading2);
    formData.append("description", data.description);
    formData.append("images", data.image[0]);

    await createLandingContent(formData);
  };

  useEffect(() => {
    if (isSuccess) {
      reset();
      setPreview("");
      navigate("/lp-uploads-history");
    }
  }, [isSuccess, navigate, reset]);

  return (
    <div className="flex justify-center px-4">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl p-6 mt-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Landing Page Content Editor
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="flex flex-col gap-1">
            <label className="font-medium text-gray-700">Heading 1</label>
            <input
              {...register("heading1", { required: true })}
              className="border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-300 outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-medium text-gray-700">Heading 2</label>
            <input
              {...register("heading2", { required: true })}
              className="border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-300 outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-medium text-gray-700">Description</label>
            <textarea
              rows={3}
              {...register("description", { required: true })}
              className="border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-300 outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-medium text-gray-700">
              Background Image{" "}
              <span className="text-sm text-gray-500">(≥1500×900)</span>
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("image")}
              className="border border-gray-300 rounded-lg p-2 bg-white"
            />
          </div>

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-full rounded-lg shadow border"
            />
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-lg transition disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Save Content"}
          </button>
        </form>

        {imageError && (
          <p className="text-red-500 mt-3">{imageError}</p>
        )}

        {error && (
          <p className="text-red-500 mt-3">Something went wrong</p>
        )}
      </div>
    </div>
  );
};

export default LandingEditor;
