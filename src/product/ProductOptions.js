import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateFormData, selectFormData } from "../Redux/Slices/productSlice";
import { FaPen, FaTrash, FaCheck, FaTimes } from "react-icons/fa";

const selectableOptions = {
  size: ["S", "M", "L", "XL", "XXL"],
  gender: ["Men", "Women", "Unisex"],
  sleeve_length: ["Full Sleeve", "Half Sleeve", "Sleeveless"],
};

const ProductOptions = () => {
  const dispatch = useDispatch();
  const formData = useSelector(selectFormData);
  const { attributes = {} } = formData;

  const [editing, setEditing] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [quantityValue, setQuantityValue] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newOptionKey, setNewOptionKey] = useState("");
  const [newOptionTags, setNewOptionTags] = useState([]);

  // Convert attributes to display format
  const getDisplayAttributes = () => {
    const displayAttrs = {};
    Object.keys(attributes).forEach((key) => {
      if (key === "size" && Array.isArray(attributes[key])) {
        displayAttrs[key] = attributes[key]
          .map((item) => `${item.name} (Qty: ${item.quantity})`)
          .join(", ");
      } else if (Array.isArray(attributes[key])) {
        displayAttrs[key] = attributes[key].join(", ");
      } else {
        displayAttrs[key] = attributes[key];
      }
    });
    return displayAttrs;
  };

  const displayAttributes = getDisplayAttributes();

  // Start Editing
  const handleEdit = (key) => {
    setEditing(key);
    if (key === "size" && attributes[key]) {
      setNewOptionTags([...attributes[key]]);
    } else if (attributes[key]) {
      setNewOptionTags(
        Array.isArray(attributes[key]) ? [...attributes[key]] : [attributes[key]]
      );
    } else {
      setNewOptionTags([]);
    }
  };

  // Remove Tag
  const removeTag = (index) => {
    setNewOptionTags(newOptionTags.filter((_, i) => i !== index));
  };

  // Add tag for size (with quantity)
  const handleAddSize = () => {
    if (inputValue && quantityValue && !isNaN(quantityValue)) {
      setNewOptionTags([
        ...newOptionTags,
        {
          name: inputValue.trim(),
          quantity: parseInt(quantityValue),
        },
      ]);
      setInputValue("");
      setQuantityValue("");
    }
  };

  // Add tag for other options
  const handleAddOption = () => {
    if (inputValue.trim()) {
      setNewOptionTags([...newOptionTags, inputValue.trim()]);
      setInputValue("");
    }
  };

  // Save Changes
  const handleSave = (key) => {
    let valueToSave;
    if (key === "size") {
      valueToSave = newOptionTags;
    } else {
      valueToSave = newOptionTags.length === 1 ? newOptionTags[0] : newOptionTags;
    }

    dispatch(
      updateFormData({
        attributes: { ...attributes, [key]: valueToSave },
      })
    );
    setEditing(null);
  };

  // Delete Custom Attribute
  const handleDelete = (key) => {
    if (selectableOptions[key]) return;
    const updatedAttributes = { ...attributes };
    delete updatedAttributes[key];
    dispatch(updateFormData({ attributes: updatedAttributes }));
  };

  // Add New Custom Option from Modal
  const handleAddNewOption = () => {
    if (newOptionKey.trim() && newOptionTags.length > 0) {
      let valueToSave;
      if (newOptionKey === "size") {
        valueToSave = newOptionTags;
      } else {
        valueToSave = newOptionTags.length === 1 ? newOptionTags[0] : newOptionTags;
      }

      dispatch(
        updateFormData({
          attributes: { ...attributes, [newOptionKey]: valueToSave },
        })
      );
      setShowModal(false);
      setNewOptionKey("");
      setNewOptionTags([]);
      setInputValue("");
      setQuantityValue("");
    }
  };

  // Handle Enter key for adding tags in modal
  const handleModalKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      if (newOptionKey === "size") {
        if (quantityValue && !isNaN(quantityValue)) {
          setNewOptionTags([
            ...newOptionTags,
            {
              name: inputValue.trim(),
              quantity: parseInt(quantityValue),
            },
          ]);
          setInputValue("");
          setQuantityValue("");
        }
      } else {
        setNewOptionTags([...newOptionTags, inputValue.trim()]);
        setInputValue("");
      }
    }
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
            className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition"
          >
            <div className="flex-1">
              <span className="font-medium text-gray-700 uppercase text-sm block mb-2">
                {key.replace("_", " ")}
              </span>

              {editing === key ? (
                <div className="space-y-3">
                  {/* Tags Display */}
                  <div className="flex flex-wrap gap-2">
                    {newOptionTags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                      >
                        {key === "size" ? `${tag.name} (Qty: ${tag.quantity})` : tag}
                        <button
                          type="button"
                          onClick={() => removeTag(index)}
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
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
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
                        value={quantityValue}
                        onChange={(e) => setQuantityValue(e.target.value)}
                        placeholder="Quantity"
                        min="0"
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    )}

                    <button
                      type="button"
                      onClick={key === "size" ? handleAddSize : handleAddOption}
                      disabled={!inputValue || (key === "size" && !quantityValue)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Add
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-600">
                  {displayAttributes[key] || "Not set"}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 ml-4">
              {editing === key ? (
                <>
                  <button
                    onClick={() => handleSave(key)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                    title="Save"
                  >
                    <FaCheck />
                  </button>
                  <button
                    onClick={() => setEditing(null)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Cancel"
                  >
                    <FaTimes />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleEdit(key)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  title="Edit"
                >
                  <FaPen />
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Custom Attributes */}
        {Object.keys(attributes)
          .filter((key) => !selectableOptions[key])
          .map((key) => (
            <div
              key={key}
              className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition"
            >
              <div className="flex-1">
                <span className="font-medium text-gray-700 uppercase text-sm block mb-2">
                  {key.replace("_", " ")}
                </span>

                {editing === key ? (
                  <div className="space-y-3">
                    {/* Tags Display */}
                    <div className="flex flex-wrap gap-2">
                      {newOptionTags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                        >
                          {key === "size" ? `${tag.name} (Qty: ${tag.quantity})` : tag}
                          <button
                            type="button"
                            onClick={() => removeTag(index)}
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
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={
                          key === "size" ? "Size (e.g., S, M)" : "Type value"
                        }
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {key === "size" && (
                        <input
                          type="number"
                          value={quantityValue}
                          onChange={(e) => setQuantityValue(e.target.value)}
                          placeholder="Quantity"
                          min="0"
                          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      )}
                      <button
                        type="button"
                        onClick={key === "size" ? handleAddSize : handleAddOption}
                        disabled={!inputValue || (key === "size" && !quantityValue)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition disabled:bg-gray-300"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">
                    {displayAttributes[key] || "Not set"}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 ml-4">
                {editing === key ? (
                  <>
                    <button
                      onClick={() => handleSave(key)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                      title="Save"
                    >
                      <FaCheck />
                    </button>
                    <button
                      onClick={() => setEditing(null)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Cancel"
                    >
                      <FaTimes />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(key)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Edit"
                    >
                      <FaPen />
                    </button>
                    <button
                      onClick={() => handleDelete(key)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}

        {/* Add New Option Button */}
        <button
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
                      onClick={() => removeTag(index)}
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
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
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
                    value={quantityValue}
                    onChange={(e) => setQuantityValue(e.target.value)}
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
                onClick={handleAddNewOption}
                disabled={!newOptionKey.trim() || newOptionTags.length === 0}
                className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
              >
                Add Option
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setNewOptionKey("");
                  setNewOptionTags([]);
                  setInputValue("");
                  setQuantityValue("");
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