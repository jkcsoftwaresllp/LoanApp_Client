import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FileInput from "../components/document/FileInput";
import DocumentTypeSelect from "../components/document/DocumentTypeSelect";
import Button from "../components/common/Button";

const useUpload = ({ apiRoute, documentTypeOptions, buttonText }) => {
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

  const handleFileChange = (newFile) => {
    if (newFile && validateFile(newFile)) {
      setFile(newFile);
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
      const response = await fetch(`http://localhost:5000/api/${apiRoute}`, {
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

  const buttons = [
    {
      text: loading ? "Uploading..." : buttonText || "Upload",
      type: "submit",
      onClick: handleSubmit,
      className: `w-full p-3 rounded-md ${
        loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 text-white"
      }`,
      disabled: loading,
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg border border-gray-200 space-y-6">
        <h1 className="text-3xl font-semibold text-center text-blue-600">
          {buttonText || "Upload Document"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMessage && (
            <div className="text-red-500 border border-red-500 p-4 rounded-md">
              {errorMessage}
            </div>
          )}

          <FileInput file={file} onFileChange={handleFileChange} />

          <DocumentTypeSelect
            value={documentType}
            onChange={handleTypeChange}
            options={documentTypeOptions}
          />

          {loading && (
            <div className="relative">
              <div className="absolute inset-0 flex justify-center items-center">
                <div className="spinner-border animate-spin border-t-transparent border-solid border-4 rounded-full w-16 h-16 border-blue-500"></div>
              </div>
              <progress value={0} max="100" className="w-full mt-4"></progress>
            </div>
          )}

          {buttons.map((button) => (
            <Button
              key={button.text}
              type={button.type}
              text={button.text}
              onClick={button.onClick}
              className={button.className}
              disabled={button.disabled}
            />
          ))}
        </form>
      </div>
    </div>
  );
};

export default useUpload;
