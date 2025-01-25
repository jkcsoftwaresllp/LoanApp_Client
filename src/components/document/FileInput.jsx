import React, { useRef } from "react";
import { inputFieldConfig } from "../../config/inputFieldConfig";

const FileInput = ({ file, onFileChange }) => {
  const fileInputRef = useRef(null); 

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
      className="relative border-2 border-dashed border-[#4CAF50] p-8 rounded-md flex justify-center items-center hover:bg-[#f4f4f4] transition duration-300 cursor-pointer w-full"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current.click()} 
      role="button"
      aria-label="Click or drag to upload file"
    >
      <input
        type="file"
        id={id}
        name={id}
        ref={fileInputRef} 
        onChange={handleFileChange}
        required={required}
        className="absolute inset-0 opacity-0 cursor-pointer" 
        aria-label={ariaLabel}
      />
      {file ? (
        <div className="flex justify-between items-center w-full">
          <p className="text-gray-700 truncate">{file.name}</p>
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
        <p className="text-gray-500 text-center">Drag & Drop or Click to Upload</p>
      )}
    </div>
  );
};

export default FileInput;
