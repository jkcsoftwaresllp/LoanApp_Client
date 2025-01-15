import React from "react";
import { inputFieldConfig } from "../../config/inputFieldConfig";

const FileInput = ({ file, onFileChange }) => {
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      onFileChange(selectedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      onFileChange(droppedFile);
    }
  };

 
  const fileInputConfig = inputFieldConfig("file");
  const { id, required, className, ariaLabel } = fileInputConfig;

  return (
    <div
      className="relative border-2 border-dashed border-blue-500 p-6 rounded-md flex justify-center items-center hover:bg-gray-50 transition duration-300 cursor-pointer"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => document.getElementById(id).click()}
      role="button"
      aria-label="Click or drag to upload file"
    >
      <input
        type="file"
        id={id}
        name={id}
        onChange={handleFileChange}
        required={required}
        className={className}
        aria-label={ariaLabel}
      />
      {file ? (
        <div className="flex justify-between w-full">
          <p className="text-gray-600">{file.name}</p>
          <button
            type="button"
            onClick={() => onFileChange(null)}
            className="text-red-500 hover:text-red-700"
            aria-label="Clear file"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      ) : (
        <p className="text-gray-400">Drag & Drop or Click to Upload</p>
      )}
    </div>
  );
};

export default FileInput;
