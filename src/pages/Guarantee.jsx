import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Guarantee = () => {
  const [file, setFile] = useState(null);
  const [documentType, setDocumentType] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const validateFile = (file) => {
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    const maxSize = 5 * 1024 * 1024; // 5 MB limit
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
      setErrorMessage("");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && validateFile(droppedFile)) {
      setFile(droppedFile);
      setErrorMessage("");
    }
  };

  const handleTypeChange = (e) => {
    setDocumentType(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");

    if (!token) {
      toast.error("No authentication token found.");
      return;
    }

    if (!file) {
      setErrorMessage("Please choose a file.");
      return;
    }

    if (!documentType) {
      setErrorMessage("Please specify the document type.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", documentType);

    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/upload-guarantee", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("File uploaded successfully!");
        setFile(null);
        setDocumentType("");
      } else {
        setErrorMessage(data.message || "Upload failed. Please try again.");
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
    setErrorMessage("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg border border-gray-200 space-y-6">
        <h1 className="text-3xl font-semibold text-center text-blue-600">Upload Guarantee Document</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMessage && (
            <div
              className="text-red-500 border border-red-500 p-4 rounded-md"
              role="alert"
              aria-live="assertive"
            >
              {errorMessage}
            </div>
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
              aria-label="File Upload"
            />
            {file ? (
              <div className="flex justify-between w-full">
                <p className="text-gray-600 truncate">{file.name}</p>
                <button
                  type="button"
                  onClick={handleClearFile}
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

          <div>
            <label htmlFor="type" className="block text-lg font-medium text-gray-600 mb-2">
              Document Type
            </label>
            <select
              id="type"
              name="type"
              value={documentType}
              onChange={handleTypeChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="" disabled>
                Select Document Type
              </option>
              <option value="id proof">ID Proof</option>
              <option value="aadhar">Aadhar</option>
              <option value="pan">PAN</option>
              <option value="others">Others</option>
            </select>
          </div>

          {loading && (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

          <button
            type="submit"
            className={`w-full p-3 rounded-md ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 text-white"}`}
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload Guarantee"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Guarantee;
