import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FileInput } from "../components/document/FileInput";
import { DocumentTypeSelect } from "../components/document/DocumentTypeSelect";
import { Button } from "../components/common/Button";
import styles from "../Styles/PageSlider.module.css";

export const useUpload = ({ apiRoute, documentTypeOptions, buttonText }) => {
  const [file, setFile] = useState(null);
  const [documentType, setDocumentType] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const validateFile = (file) => {
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    const maxSize = 5 * 1024 * 1024; // 5MB
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
    setErrorMessage(""); // Clear previous error messages
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
      const response = await fetch(
        `http://localhost:5000/api/auth/${apiRoute}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("File uploaded successfully!");
        setFile(null); // Reset file input after success
        setDocumentType(""); // Reset document type
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

  return (
    <div className="flex items-center justify-center">
      <div>
        <h1
          style={{
            fontSize: "1.25rem",
            fontWeight: "600",
            marginBottom: "1rem",
            textAlign: "center",
          }}
        >
          {buttonText || "Upload Document"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMessage && (
            <div
              style={{
                color: "#e53e3e",
                borderColor: "#e53e3e",
                padding: "10px",
                marginBottom: "1rem",
                borderRadius: "5px",
                backgroundColor: "#fef2f2",
              }}
            >
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
            <div
              className="spinner"
              style={{ textAlign: "center", paddingBottom: "1rem" }}
            >
              <div className="spinner-border" role="status"></div> Uploading...
            </div>
          )}

          <Button
            text={loading ? "Uploading..." : buttonText || "Upload"}
            type="submit"
            className={`${styles.uploadButton}`}
            disabled={loading}
          />
        </form>
      </div>
    </div>
  );
};
