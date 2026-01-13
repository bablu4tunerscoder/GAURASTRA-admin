import React, { useState } from "react";
import { Controller, useWatch } from "react-hook-form";

const SeoSection = ({ register, control, errors }) => {
  const [inputValue, setInputValue] = useState("");

  // Watch keywords array
  const keywords = useWatch({
    control,
    name: "seo.keywords",
    defaultValue: []
  });

  return (
    <div className="w-full bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">SEO Settings</h2>

      <div className="space-y-4">
        {/* Meta Title */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Meta Title</label>
          <input
            type="text"
            {...register("seo.metaTitle", {
              maxLength: {
                value: 60,
                message: "Meta title should be max 60 characters"
              }
            })}
            placeholder="Enter meta title"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
          {errors?.seo?.metaTitle && (
            <p className="text-red-500 text-xs mt-1">
              {errors.seo.metaTitle.message}
            </p>
          )}
        </div>

        {/* Meta Description */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            Meta Description
          </label>
          <textarea
            {...register("seo.metaDescription", {
              maxLength: {
                value: 160,
                message: "Meta description should be max 160 characters"
              }
            })}
            rows="3"
            placeholder="Enter meta description"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
          />
          {errors?.seo?.metaDescription && (
            <p className="text-red-500 text-xs mt-1">
              {errors.seo.metaDescription.message}
            </p>
          )}
        </div>

        {/* Keywords */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            Keywords{" "}
            <span className="text-gray-500 text-xs">(Press Enter to add)</span>
          </label>
          <Controller
            name="seo.keywords"
            control={control}
            defaultValue={[]}
            render={({ field: { onChange, value } }) => {
              const handleKeyDown = (e) => {
                if (e.key === "Enter" && inputValue.trim()) {
                  e.preventDefault();
                  const updatedKeywords = [...(value || []), inputValue.trim()];
                  onChange(updatedKeywords);
                  setInputValue("");
                }
              };

              const removeTag = (index) => {
                const updatedKeywords = value.filter((_, i) => i !== index);
                onChange(updatedKeywords);
              };

              return (
                <div className="border border-gray-300 rounded-lg px-3 py-1.5 flex flex-wrap gap-2">
                  {value?.map((keyword, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                    >
                      {keyword}
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="hover:text-blue-900 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      value?.length === 0 ? "Type and press Enter" : ""
                    }
                    className="flex-1 min-w-[200px] outline-none"
                  />
                </div>
              );
            }}
          />
          {errors?.seo?.keywords && (
            <p className="text-red-500 text-xs mt-1">
              {errors.seo.keywords.message}
            </p>
          )}
        </div>

        {/* Canonical URL */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            Canonical URL
          </label>
          <input
            type="text"
            {...register("seo.canonicalURL", {
              pattern: {
                required: true,
                message: "Please enter a valid URL"
              }
            })}
            placeholder="https://example.com/product"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
          {errors?.seo?.canonicalURL && (
            <p className="text-red-500 text-xs mt-1">
              {errors.seo.canonicalURL.message}
            </p>
          )}
        </div>

        {/* Slug */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            URL Slug
          </label>
          <input
            type="text"
            {...register("seo.slug", {
              pattern: {
                value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                message: "Slug can only contain lowercase letters, numbers, and hyphens"
              }
            })}
            placeholder="product-url-slug"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
          {errors?.seo?.slug && (
            <p className="text-red-500 text-xs mt-1">
              {errors.seo.slug.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeoSection;