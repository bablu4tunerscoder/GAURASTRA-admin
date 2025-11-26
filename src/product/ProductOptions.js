import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateNewProduct,editProduct } from "../Redux/Slices/productSlice";
import { FaPen, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import "./ProductOptions.scss";

const selectableOptions = {
  size: ["S", "M", "L", "XL", "XXL"],
  gender: ["Men", "Women", "Unisex"],
  sleeve_length: ["Full Sleeve", "Half Sleeve", "Sleeveless"],
};

const ProductOptions = () => {
  const dispatch = useDispatch();
  const isEditMode = useSelector((state) => state.product.isEditMode);
  const { attributes } = useSelector((state) => isEditMode? state.product.updateProduct : state.product.currentProduct);
  const [editing, setEditing] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [quantityValue, setQuantityValue] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newOptionKey, setNewOptionKey] = useState("");
  const [newOptionTags, setNewOptionTags] = useState([]);

  // Merge predefined options with existing attributes
  const allOptions = { ...selectableOptions };

  // Convert size attributes to the format we need for display
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

  // Start Editing Existing Option
  const handleEdit = (key) => {
    setEditing(key);
    if (key === "size" && attributes[key]) {
      // For size, we'll use the existing structure
      setNewOptionTags([...attributes[key]]);
    } else if (attributes[key]) {
      // For other attributes, convert to simple array if needed
      setNewOptionTags(
        Array.isArray(attributes[key])
          ? [...attributes[key]]
          : [attributes[key]]
      );
    } else {
      setNewOptionTags([]);
    }
  };

  // Add Tag in Editing Mode
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      if (editing === "size") {
        // For size, we need both name and quantity
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
        // For other attributes, just add the value
        setNewOptionTags([...newOptionTags, inputValue.trim()]);
        setInputValue("");
      }
    }
  };

  // Remove Tag
  const removeTag = (index) => {
    setNewOptionTags(newOptionTags.filter((_, i) => i !== index));
  };

  // Save Changes to Redux
  const handleSave = (key) => {
    let valueToSave;

    if (key === "size") {
      valueToSave = newOptionTags;
    } else {
      valueToSave =
        newOptionTags.length === 1 ? newOptionTags[0] : newOptionTags;
    }

    if (isEditMode) {
      dispatch(
        editProduct({ attributes: { ...attributes, [key]: valueToSave } })
      );
    } else {
      dispatch(
        updateNewProduct({ attributes: { ...attributes, [key]: valueToSave } })
      );
    }
    setEditing(null);
  };

  // Delete Attribute Option (only if it's a custom option)
  const handleDelete = (key) => {
    if (selectableOptions[key]) return; // Prevent deletion of predefined options
    const updatedAttributes = { ...attributes };
    delete updatedAttributes[key];

    if (isEditMode) {
      dispatch(editProduct({ attributes: updatedAttributes }));
    } else {
      dispatch(updateNewProduct({ attributes: updatedAttributes }));
    }
  };

  // Add New Option from Modal
  const handleAddOption = () => {
    if (newOptionKey.trim() && newOptionTags.length > 0) {
      let valueToSave;

      if (newOptionKey === "size") {
        valueToSave = newOptionTags;
      } else {
        valueToSave =
          newOptionTags.length === 1 ? newOptionTags[0] : newOptionTags;
      }

      if (isEditMode) {
        dispatch(
          editProduct({
            attributes: { ...attributes, [newOptionKey]: valueToSave },
          })
        );
      } else {
        dispatch(
          updateNewProduct({
            attributes: { ...attributes, [newOptionKey]: valueToSave },
          })
        );
      }
      setShowModal(false);
      setNewOptionKey("");
      setNewOptionTags([]);
      setInputValue("");
      setQuantityValue("");
    }
  };

  return (
    <div className="product-options">
      <h2>Product Options</h2>
      <p>Manage the options this product comes in.</p>

      <div className="options-container">
        {/* Predefined options */}
        {Object.keys(allOptions).map((key) => (
          <div key={key} className="option">
            <span>{key.replace("_", " ").toUpperCase()}</span>

            {editing === key ? (
              <div className="tags-input">
                {newOptionTags.map((tag, index) => (
                  <span key={index} className="tag">
                    {key === "size"
                      ? `${tag.name} (Qty: ${tag.quantity})`
                      : tag}
                    <button type="button" onClick={() => removeTag(index)}>
                      ×
                    </button>
                  </span>
                ))}
                <div className="size-input-group">
                  {key === "size" ? (
                    <>
                      <select
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                      >
                        <option value="">Select Size</option>
                        {selectableOptions.size.map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        value={quantityValue.qty || ""}
                        onChange={(e) =>
                          setQuantityValue((prev) => ({
                            ...prev,
                            qty: e.target.value,
                          }))
                        }
                        placeholder="Quantity"
                        min="0"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const finalSize =
                            inputValue === "other"
                              ? quantityValue.customSize?.trim()
                              : inputValue;
                          if (
                            finalSize &&
                            quantityValue.qty &&
                            !isNaN(quantityValue.qty)
                          ) {
                            setNewOptionTags([
                              ...newOptionTags,
                              {
                                name: finalSize,
                                quantity: parseInt(quantityValue.qty),
                              },
                            ]);
                            setInputValue("");
                            setQuantityValue({});
                          }
                        }}
                      >
                        Add
                      </button>
                    </>
                  ) : selectableOptions[key] ? (
                    <>
                      <select
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                      >
                        <option value="">Select {key}</option>
                        {selectableOptions[key].map((val) => (
                          <option key={val} value={val}>
                            {val}
                          </option>
                        ))}
                        <option value="other">Other</option>
                      </select>
                      {inputValue === "other" && (
                        <input
                          type="text"
                          placeholder={`Enter custom ${key}`}
                          value={quantityValue.custom || ""}
                          onChange={(e) =>
                            setQuantityValue((prev) => ({
                              ...prev,
                              custom: e.target.value,
                            }))
                          }
                          onKeyDown={(e) => {
                            if (
                              e.key === "Enter" &&
                              quantityValue.custom?.trim()
                            ) {
                              e.preventDefault();
                              setNewOptionTags([
                                ...newOptionTags,
                                quantityValue.custom.trim(),
                              ]);
                              setInputValue("");
                              setQuantityValue({});
                            }
                          }}
                        />
                      )}
                      {inputValue !== "other" && inputValue && (
                        <button
                          type="button"
                          onClick={() => {
                            setNewOptionTags([...newOptionTags, inputValue]);
                            setInputValue("");
                          }}
                        >
                          Add
                        </button>
                      )}
                    </>
                  ) : (
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type and press Enter"
                    />
                  )}
                </div>
              </div>
            ) : (
              <span>{displayAttributes[key] || "Not set"}</span>
            )}

            <div className="actions">
              {editing === key ? (
                <>
                  <button className="save" onClick={() => handleSave(key)}>
                    <FaCheck />
                  </button>
                  <button className="cancel" onClick={() => setEditing(null)}>
                    <FaTimes />
                  </button>
                </>
              ) : (
                <>
                  <button className="edit" onClick={() => handleEdit(key)}>
                    <FaPen />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}

        {/* Custom attributes */}
        {Object.keys(attributes)
          .filter((key) => !allOptions[key])
          .map((key) => (
            <div key={key} className="option">
              <span>{key.replace("_", " ").toUpperCase()}</span>

              {editing === key ? (
                <div className="tags-input">
                  {newOptionTags.map((tag, index) => (
                    <span key={index} className="tag">
                      {key === "size"
                        ? `${tag.name} (Qty: ${tag.quantity})`
                        : tag}
                      <button type="button" onClick={() => removeTag(index)}>
                        ×
                      </button>
                    </span>
                  ))}
                  <div className="size-input-group">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={
                        key === "size"
                          ? "Size (e.g., S, M)"
                          : "Type and press Enter"
                      }
                    />
                    {key === "size" && (
                      <input
                        type="number"
                        value={quantityValue}
                        onChange={(e) => setQuantityValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Quantity"
                        min="0"
                      />
                    )}
                  </div>
                </div>
              ) : (
                <span>{displayAttributes[key] || "Not set"}</span>
              )}

              <div className="actions">
                {editing === key ? (
                  <>
                    <button className="save" onClick={() => handleSave(key)}>
                      <FaCheck />
                    </button>
                    <button className="cancel" onClick={() => setEditing(null)}>
                      <FaTimes />
                    </button>
                  </>
                ) : (
                  <>
                    <button className="edit" onClick={() => handleEdit(key)}>
                      <FaPen />
                    </button>
                    <button
                      className="delete"
                      onClick={() => handleDelete(key)}
                    >
                      <FaTrash />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}

        <button className="add-option" onClick={() => setShowModal(true)}>
          + Add Another Option
        </button>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add New Option</h3>
            <input
              type="text"
              placeholder="Option Name (e.g., size, color)"
              value={newOptionKey}
              onChange={(e) => setNewOptionKey(e.target.value)}
            />
            <div className="tags-input">
              {newOptionTags.map((tag, index) => (
                <span key={index} className="tag">
                  {newOptionKey === "size"
                    ? `${tag.name} (Qty: ${tag.quantity})`
                    : tag}
                  <button type="button" onClick={() => removeTag(index)}>
                    ×
                  </button>
                </span>
              ))}
              <div className="size-input-group">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    newOptionKey === "size"
                      ? "Size (e.g., S, M)"
                      : "Type and press Enter"
                  }
                />
                {newOptionKey === "size" && (
                  <input
                    type="number"
                    value={quantityValue}
                    onChange={(e) => setQuantityValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Quantity"
                    min="0"
                  />
                )}
              </div>
            </div>
            <div className="modal-buttons">
              <button onClick={handleAddOption}>Add</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductOptions;
