import React, { useRef } from "react";

const FileInput = ({ file, onFileChange }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    console.log("File selected:", selectedFile);
    if (selectedFile) {
      onFileChange(selectedFile);
    }
  };

  const handleClearFile = (e) => {
    
    e.stopPropagation();
    console.log("Clear button clicked!");
    onFileChange(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = ""; 
      console.log("Input field reset!");
    }
  };

  return (
    <div
      className="relative p-8 rounded-md flex justify-center items-center hover:bg-[#f4f4f4] transition duration-300 cursor-pointer mx-auto"
      style={{ width: "550px", height: "200px" }}
      onClick={() => fileInputRef.current.click()}
      role="button"
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="absolute inset-0 opacity-0 cursor-pointer"
      />
      {file ? (
        <div className="flex justify-center items-center w-full text-center">
          <p className="text-gray-700 truncate">{file.name}</p>
          <button
            type="button"
            onClick={handleClearFile}
            className="absolute top-2 right-2 text-red-500"
          >
            ❌
          </button>
        </div>
      ) : (
        <p className="text-gray-500">Drag & Drop or Click to Upload</p>
      )}
    </div>
  );
};

export default FileInput;
