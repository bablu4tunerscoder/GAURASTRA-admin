import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { BASE_URL } from "./Helper/axiosinstance";
import {
  useUploadOfferBannerMutation,
  useUpdateOfferBannerMutation,
} from "../Redux/Slices/offerBannerSlice";

const OfferBannerForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editingBanner = location.state?.banner || null;

  const [imagePreview, setImagePreview] = useState(null);
  const [uploadOfferBanner] = useUploadOfferBannerMutation();
  const [updateOfferBanner] = useUpdateOfferBannerMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      buttonText: "Shop Now",
      redirectURL: "",
      banner: null,
    },
  });

  const buttonText = watch("buttonText");
  const imageFile = watch("banner");

  // Pre-fill form if editing
  useEffect(() => {
    if (editingBanner) {
      setValue("buttonText", editingBanner.buttonText || "Shop Now");
      setValue("redirectURL", editingBanner.redirectURL || "");

      if (editingBanner.image?.startsWith("http")) {
        setImagePreview(editingBanner.image);
      } else {
        setImagePreview(`${BASE_URL}/uploads/banner/${editingBanner.image}`);
      }
    }
  }, [editingBanner, setValue]);

  // Preview image
  useEffect(() => {
    if (imageFile && imageFile[0]) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(imageFile[0]);
    }
  }, [imageFile]);

  const onSubmit = async (data) => {
    if (!editingBanner && !data.banner?.length) {
      toast.error("Please upload a banner image");
      return;
    }

    const formData = new FormData();
    if (data.banner?.length) formData.append("banner", data.banner[0]);
    formData.append("buttonText", data.buttonText);
    formData.append("redirectURL", data.redirectURL);

    try {
      if (editingBanner) {
        await updateOfferBanner({ id: editingBanner._id, formData }).unwrap();
        toast.success("Banner updated successfully!");
      } else {
        await uploadOfferBanner(formData).unwrap();
        toast.success("Banner created successfully!");
      }

      navigate("/OfferBannerHistory");
    } catch (err) {
      toast.error(err || "Failed to submit banner");
    }
  };

  return (
    <div className="pt-10">
      <div className="bg-white p-6 rounded-xl shadow-md max-w-xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">
          {editingBanner ? "Edit Offer Banner" : "Upload Offer Banner"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Banner Image */}
          <div className="flex flex-col gap-1">
            <label className="font-medium">
              Banner Image {!editingBanner && <span className="text-red-500">*</span>}
            </label>

            <input
              type="file"
              accept="image/*"
              {...register("banner")}
              className="border border-gray-300 rounded-lg p-2 bg-white"
            />

            {!editingBanner && (
              <small className="text-sm text-gray-500">
                * Image is required while creating a new banner
              </small>
            )}
          </div>

          {/* Button Text */}
          <div className="flex flex-col gap-1">
            <label className="font-medium">
              Button Text <span className="font-normal text-gray-400">(optional)</span>
            </label>

            <input
              type="text"
              {...register("buttonText", { maxLength: 30 })}
              placeholder="e.g., Shop Now"
              className="border border-gray-300 rounded-lg p-2 outline-none focus:ring focus:ring-blue-300"
            />
            {errors.buttonText && (
              <p className="text-red-500 text-sm">Button text cannot exceed 30 characters</p>
            )}
          </div>

          {/* Redirect URL */}
          {buttonText?.trim() !== "" && (
            <div className="flex flex-col gap-1">
              <label className="font-medium">
                Redirect URL <span className="font-normal text-gray-400">(optional)</span>
              </label>

              <input
                type="text"
                {...register("redirectURL", {
                  pattern: {
                    value: /^\/.*|^(https?:\/\/)/,
                    message: "Must be a valid relative path or full URL",
                  },
                })}
                placeholder="e.g., /product/12345 or https://example.com/deals"
                className="border border-gray-300 rounded-lg p-2 outline-none focus:ring focus:ring-blue-300"
              />
              {errors.redirectURL && (
                <p className="text-red-500 text-sm">{errors.redirectURL.message}</p>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-lg transition disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : editingBanner ? "Update Banner" : "Submit Banner"}
          </button>
        </form>

        {/* Live Preview */}
        {imagePreview && (
          <div className="mt-8">
            <h4 className="text-lg font-semibold mb-3">Live Banner Preview</h4>
            <div className="relative border rounded-lg overflow-hidden shadow">
              <img src={imagePreview} alt="Banner Preview" className="w-full" />
              {buttonText && (
                <a
                  href={watch("redirectURL") || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  {buttonText}
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfferBannerForm;
