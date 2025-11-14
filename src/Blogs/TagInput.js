import React from "react";
import { WithContext as ReactTags } from "react-tag-input";

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

const TagInput = ({ tags, setTags }) => {
  // Handle tag additions
  const handleAddition = (tag) => {
    setTags([...tags, tag.text]); // Maintain array format
  };

  // Handle tag deletions
  const handleDelete = (i) => {
    setTags(tags.filter((_, index) => index !== i));
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-600 mb-2">
        Meta Keywords
      </label>
      <div className="border border-gray-200 p-2 rounded-md shadow-sm bg-white">
        <ReactTags
          tags={tags.map((tag) => ({ id: tag, text: tag }))}
          delimiters={delimiters}
          handleDelete={handleDelete}
          handleAddition={handleAddition}
          placeholder="Add keywords"
          inputFieldPosition="bottom"
          classNames={{
            tags: "flex flex-wrap gap-2",
            tag: "bg-blue-500 text-white px-2 py-1 rounded-md text-sm m-1 mb-1",
            remove: "ml-2 cursor-pointer text-red-500 hover:text-red-700",
            tagInputField: "border-none outline-none w-full text-gray-700 p-1",
          }}
        />
      </div>
    </div>
  );
};

export default TagInput;
