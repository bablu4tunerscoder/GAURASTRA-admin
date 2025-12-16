import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateFormData, selectFormData } from "../Redux/Slices/productSlice";

const SeoSection = () => {
  const dispatch = useDispatch();
  const formData = useSelector(selectFormData);
  const [inputValue, setInputValue] = useState("");

  const { seo } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(
      updateFormData({
        seo: { ...seo, [name]: value },
      })
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      const updatedKeywords = [...(seo.keywords || []), inputValue.trim()];
      dispatch(
        updateFormData({
          seo: { ...seo, keywords: updatedKeywords },
        })
      );
      setInputValue("");
    }
  };

  const removeTag = (index) => {
    const updatedKeywords = seo.keywords.filter((_, i) => i !== index);
    dispatch(
      updateFormData({
        seo: { ...seo, keywords: updatedKeywords },
      })
    );
  };

  return (
    <div className="w-full bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">SEO Settings</h2>

      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Meta Title</label>
          <input
            type="text"
            name="metaTitle"
            value={seo?.metaTitle || ""}
            onChange={handleChange}
            placeholder="Enter meta title"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            Meta Description
          </label>
          <textarea
            name="metaDescription"
            value={seo?.metaDescription || ""}
            onChange={handleChange}
            rows="3"
            placeholder="Enter meta description"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            Keywords <span className="text-gray-500 text-xs">(Press Enter to add)</span>
          </label>
          <div className="border border-gray-300 rounded-lg p-3 min-h-[100px] flex flex-wrap gap-2">
            {seo?.keywords?.map((keyword, index) => (
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
              placeholder={seo?.keywords?.length === 0 ? "Type and press Enter" : ""}
              className="flex-1 min-w-[200px] outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeoSection;
