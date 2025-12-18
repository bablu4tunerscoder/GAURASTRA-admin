import React, { useState } from "react";
import { useWatch } from "react-hook-form";
import { FaTrash } from "react-icons/fa";

const selectableOptions = {
  size: ["S", "M", "L", "XL", "XXL"],
  gender: ["Men", "Women", "Unisex"],
  sleeve_length: ["Full Sleeve", "Half Sleeve", "Sleeveless"],
};
const singleSelectOptions = ["gender", "sleeve_length"];


const ProductOptions = ({ control, setValue }) => {
  const [inputValues, setInputValues] = useState({});
  const [quantityValues, setQuantityValues] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [newOptionKey, setNewOptionKey] = useState("");
  const [newOptionTags, setNewOptionTags] = useState([]);
  const [modalInputValue, setModalInputValue] = useState("");
  const [modalQuantityValue, setModalQuantityValue] = useState("");

  // Watch attributes from form
  const attributes = useWatch({
    control,
    name: "attributes",
    defaultValue: {}
  });

  // Convert attributes to display format
  const getDisplayAttributes = () => {
    const displayAttrs = {};

    Object.keys(attributes || {}).forEach((key) => {
      const value = attributes[key];

      if (key === "size") {
        displayAttrs[key] = Array.isArray(value) ? value : [];
      }
      else if (singleSelectOptions.includes(key)) {
        displayAttrs[key] = value ? [value] : [];
      }
      else {
        displayAttrs[key] = Array.isArray(value) ? value : value ? [value] : [];
      }
    });

    return displayAttrs;
  };

  const displayAttributes = getDisplayAttributes();

  // Remove Tag
  const removeTag = (key) => {
    const updatedAttributes = { ...attributes };
    delete updatedAttributes[key];
    setValue("attributes", updatedAttributes, { shouldValidate: true });
  };


  // Add tag for size (with quantity)
  const handleAddSize = (key) => {
    const inputValue = inputValues[key] || "";
    const quantityValue = quantityValues[key] || "";

    if (inputValue && quantityValue && !isNaN(quantityValue)) {
      const currentValues = attributes[key] || [];
      const newValue = {
        name: inputValue.trim(),
        quantity: parseInt(quantityValue),
      };

      const updatedValues = [...(Array.isArray(currentValues) ? currentValues : [currentValues]), newValue];
      setValue(`attributes.${key}`, updatedValues, { shouldValidate: true });

      // Clear inputs
      setInputValues({ ...inputValues, [key]: "" });
      setQuantityValues({ ...quantityValues, [key]: "" });
    }
  };

  // Add tag for other options
  const handleAddOption = (key) => {
    const inputValue = inputValues[key]?.trim();
    if (!inputValue) return;

    // SINGLE select → replace value
    if (singleSelectOptions.includes(key)) {
      setValue(`attributes.${key}`, inputValue, { shouldValidate: true });
    }
    // MULTI select → array
    else {
      const currentValues = attributes[key];
      const updatedValues = Array.isArray(currentValues)
        ? [...currentValues, inputValue]
        : currentValues
          ? [currentValues, inputValue]
          : [inputValue];

      setValue(`attributes.${key}`, updatedValues, { shouldValidate: true });
    }

    setInputValues({ ...inputValues, [key]: "" });
  };


  // Delete Custom Attribute
  const handleDelete = (key) => {
    if (selectableOptions[key]) return;
    const updatedAttributes = { ...attributes };
    delete updatedAttributes[key];
    setValue("attributes", updatedAttributes, { shouldValidate: true });
  };

  // Add New Custom Option from Modal
  const handleAddNewOption = () => {
    if (newOptionKey.trim() && newOptionTags.length > 0) {
      setValue(`attributes.${newOptionKey}`, newOptionTags, { shouldValidate: true });
      setShowModal(false);
      setNewOptionKey("");
      setNewOptionTags([]);
      setModalInputValue("");
      setModalQuantityValue("");
    }
  };

  // Handle Enter key for adding tags in modal
  const handleModalKeyDown = (e) => {
    if (e.key === "Enter" && modalInputValue.trim()) {
      e.preventDefault();
      if (newOptionKey === "size") {
        if (modalQuantityValue && !isNaN(modalQuantityValue)) {
          setNewOptionTags([
            ...newOptionTags,
            {
              name: modalInputValue.trim(),
              quantity: parseInt(modalQuantityValue),
            },
          ]);
          setModalInputValue("");
          setModalQuantityValue("");
        }
      } else {
        setNewOptionTags([...newOptionTags, modalInputValue.trim()]);
        setModalInputValue("");
      }
    }
  };

  // Remove tag from modal
  const removeModalTag = (index) => {
    setNewOptionTags(newOptionTags.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-2 text-gray-800">Product Options</h2>
      <p className="text-sm text-gray-600 mb-6">
        Manage the options this product comes in.
      </p>

      <div className="space-y-4">
        {/* Predefined Options */}
        {Object.keys(selectableOptions).map((key) => (
          <div
            key={key}
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium text-gray-700 uppercase text-sm">
                {key.replace("_", " ")}
              </span>
            </div>

            {/* Tags Display */}
            <div className="flex flex-wrap gap-2 mb-3">
              {displayAttributes[key]?.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                >
                  {key === "size" ? `${tag.name} (Qty: ${tag.quantity})` : tag}
                  <button
                    type="button"
                    onClick={() => removeTag(key, index)}
                    className="hover:text-blue-900 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {/* Input Controls */}
            <div className="flex flex-wrap gap-2">
              <select
                value={inputValues[key] || ""}
                onChange={(e) => setInputValues({ ...inputValues, [key]: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 min-w-[150px]"
              >
                <option value="">Select {key}</option>
                {selectableOptions[key].map((val) => (
                  <option key={val} value={val}>
                    {val}
                  </option>
                ))}
              </select>

              {key === "size" && (
                <input
                  type="number"
                  value={quantityValues[key] || ""}
                  onChange={(e) => setQuantityValues({ ...quantityValues, [key]: e.target.value })}
                  placeholder="Quantity"
                  min="0"
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}

              <button
                type="button"
                onClick={() => key === "size" ? handleAddSize(key) : handleAddOption(key)}
                disabled={!inputValues[key] || (key === "size" && !quantityValues[key])}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
          </div>
        ))}

        {/* Custom Attributes */}
        {Object.keys(attributes)
          .filter((key) => !selectableOptions[key])
          .map((key) => (
            <div
              key={key}
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-gray-700 uppercase text-sm">
                  {key.replace("_", " ")}
                </span>
                <button
                  type="button"
                  onClick={() => handleDelete(key)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Delete"
                >
                  <FaTrash />
                </button>
              </div>

              {/* Tags Display */}
              <div className="flex flex-wrap gap-2 mb-3">
                {displayAttributes[key]?.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                  >
                    {key === "size" ? `${tag.name} (Qty: ${tag.quantity})` : tag}
                    <button
                      type="button"
                      onClick={() => removeTag(key, index)}
                      className="hover:text-blue-900 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              {/* Input Controls */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValues[key] || ""}
                  onChange={(e) => setInputValues({ ...inputValues, [key]: e.target.value })}
                  placeholder={key === "size" ? "Size (e.g., S, M)" : "Type value"}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {key === "size" && (
                  <input
                    type="number"
                    value={quantityValues[key] || ""}
                    onChange={(e) => setQuantityValues({ ...quantityValues, [key]: e.target.value })}
                    placeholder="Quantity"
                    min="0"
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
                <button
                  type="button"
                  onClick={() => key === "size" ? handleAddSize(key) : handleAddOption(key)}
                  disabled={!inputValues[key] || (key === "size" && !quantityValues[key])}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition disabled:bg-gray-300"
                >
                  Add
                </button>
              </div>
            </div>
          ))}

        {/* Add New Option Button */}
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition font-medium"
        >
          + Add Another Option
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Add New Option
            </h3>

            <input
              type="text"
              placeholder="Option Name (e.g., color, material)"
              value={newOptionKey}
              onChange={(e) => setNewOptionKey(e.target.value.toLowerCase())}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="border border-gray-300 rounded-lg p-3 mb-4 min-h-[100px]">
              {/* Tags Display */}
              <div className="flex flex-wrap gap-2 mb-3">
                {newOptionTags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                  >
                    {newOptionKey === "size"
                      ? `${tag.name} (Qty: ${tag.quantity})`
                      : tag}
                    <button
                      type="button"
                      onClick={() => removeModalTag(index)}
                      className="hover:text-blue-900 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              {/* Input Controls */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={modalInputValue}
                  onChange={(e) => setModalInputValue(e.target.value)}
                  onKeyDown={handleModalKeyDown}
                  placeholder={
                    newOptionKey === "size"
                      ? "Size (e.g., S, M)"
                      : "Type and press Enter"
                  }
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {newOptionKey === "size" && (
                  <input
                    type="number"
                    value={modalQuantityValue}
                    onChange={(e) => setModalQuantityValue(e.target.value)}
                    onKeyDown={handleModalKeyDown}
                    placeholder="Qty"
                    min="0"
                    className="w-20 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleAddNewOption}
                disabled={!newOptionKey.trim() || newOptionTags.length === 0}
                className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
              >
                Add Option
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setNewOptionKey("");
                  setNewOptionTags([]);
                  setModalInputValue("");
                  setModalQuantityValue("");
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductOptions;