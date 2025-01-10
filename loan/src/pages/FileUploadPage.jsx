import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FileUploadPage = () => {
  const [file, setFile] = useState(null);
  const [documentType, setDocumentType] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

 
  const validateFile = (file) => {
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    const maxSize = 5 * 1024 * 1024;  // 5 MB limit
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Only JPG, PNG, and PDF are allowed.");
      return false;
    }
    if (file.size > maxSize) {
      toast.error("File size exceeds the 5MB limit.");
      return false;
    }
    return true;
  };

  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && validateFile(droppedFile)) {
      setFile(droppedFile);
    }
  };

  // Handle document type change
  const handleTypeChange = (e) => {
    setDocumentType(e.target.value);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");

    if (!token) {
      toast.error("No authentication token found.");
      return;
    }

    if (!file) {
      toast.error("Please choose a file.");
      return;
    }

    if (!documentType) {
      toast.error("Please specify the document type.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", documentType);

    try {
      setLoading(true);
      
      const progressToast = toast.loading("Uploading... 0%", { autoClose: false });

      const response = await fetch("http://localhost:5000/api/upload-documents", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
        onUploadProgress: (progressEvent) => {
          const progressPercentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(progressPercentage);
          toast.update(progressToast, { render: `Uploading... ${progressPercentage}%`, type: "info", isLoading: true });
        },
      });

      const data = await response.json();

      if (response.status === 200) {
        
        toast.update(progressToast, {
          render: "File uploaded successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,  
        });
        setFile(null); 
      } else {
        setErrorMessage(data.message);
        toast.error(data.message || "Upload failed. Please try again.");
      }
    } catch (error) {
      setErrorMessage("Error during file upload. Please try again.");
      toast.error("Error during file upload. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClearFile = () => {
    setFile(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg border border-gray-200 space-y-6">
        <h1 className="text-3xl font-semibold text-center text-blue-600">Upload Document</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMessage && (
            <div className="text-red-500 border border-red-500 p-4 rounded-md">{errorMessage}</div>
          )}

          <div
            className="relative border-2 border-dashed border-blue-500 p-6 rounded-md flex justify-center items-center hover:bg-gray-50 transition duration-300 cursor-pointer"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => document.getElementById("fileInput").click()}
            role="button"
            aria-label="Click or drag to upload file"
          >
            <input
              type="file"
              id="fileInput"
              name="file"
              onChange={handleFileChange}
              className="hidden"
              required
              aria-label="File Upload"
            />
            {file ? (
              <div className="flex justify-between w-full">
                <p className="text-gray-600">{file.name}</p>
                <button
                  type="button"
                  onClick={handleClearFile}
                  className="text-red-500 hover:text-red-700"
                  aria-label="Clear file"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <p className="text-gray-400">Drag & Drop or Click to Upload</p>
            )}
          </div>

          <div>
            <label htmlFor="type" className="block text-lg font-medium text-gray-600 mb-2">Document Type</label>
            <input
              type="text"
              id="type"
              name="type"
              value={documentType}
              onChange={handleTypeChange}
              placeholder="e.g., Passport"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {loading && (
            <div className="relative">
              <div className="absolute inset-0 flex justify-center items-center">
                <div className="spinner-border animate-spin border-t-transparent border-solid border-4 rounded-full w-16 h-16 border-blue-500"></div>
              </div>
              <progress value={progress} max="100" className="w-full mt-4"></progress>
            </div>
          )}

          <button
            type="submit"
            className={`w-full p-3 rounded-md ${loading ? 'bg-gray-400' : 'bg-blue-500 text-white'}`}
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Upload Document'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FileUploadPage;
