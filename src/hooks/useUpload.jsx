import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FileInput } from "../components/document/FileInput";
import { Button } from "../components/common/Button";
import styles from "../Styles/PageSlider.module.css";
import { showToast } from "../utils/toastUtils";
import { Loader } from "../components/common/Loader";

const useUpload = ({ apiRoute, buttonText }) => {
  const [file, setFile] = useState(null);
  const [documentType, setDocumentType] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

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
    setErrorMessage("");
    setUploadProgress(0);
    const token = localStorage.getItem("accessToken");

    if (!token) {
      showToast("error", "No authentication token found.");
      return;
    }

    if (!file) {
      return;
    }

    if (!documentType) {
      showToast("error", "Please specify the document type.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", documentType);

    try {
      setLoading(true);

      // Use XMLHttpRequest to track upload progress
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      });

      xhr.open("POST", `http://localhost:5000/api/auth/${apiRoute}`);
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);

      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
          const data = JSON.parse(xhr.responseText);
          showToast("success", "File uploaded successfully.");
          setFile(null);
          setDocumentType("");
        } else {
          const data = JSON.parse(xhr.responseText);
          setErrorMessage(data.message || "Upload failed. Please try again.");
        }
        setLoading(false);
      };

      xhr.onerror = function () {
        showToast("error", "Error during file upload. Please try again.");
        setLoading(false);
      };

      xhr.send(formData);
    } catch (error) {
      showToast("error", "Error during file upload. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div>
        <h1 className={styles.header}>{buttonText || "Upload Document"}</h1>

        <form onSubmit={handleSubmit} className="space-y-3">
          {errorMessage && (
            <div className={styles.errorMsg}>{errorMessage}</div>
          )}

          <FileInput file={file} onFileChange={handleFileChange} />

          <div>
            <p>Select Document Type:</p>
            <select
              value={documentType}
              onChange={handleTypeChange}
              className={styles.input}
            >
              <option value="">Select Type</option>
              <option value="ID Proof">ID Proof</option>
              <option value="Aadhar">Aadhar</option>
              <option value="PAN">PAN</option>
              <option value="Others">Others</option>
            </select>
          </div>

          {loading && (
            <div className="upload-progress-container">
              <div className="progress" style={{ height: "20px" }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{
                    width: `${uploadProgress}%`,
                    backgroundColor: "#4CAF50",
                    height: "100%",
                    borderRadius: "4px",
                    transition: "width 0.3s ease",
                  }}
                  aria-valuenow={uploadProgress}
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  {uploadProgress}%
                </div>
              </div>
            </div>
          )}

          <div className={styles.buttonWrapper}>
            <Button
              text={loading ? "Uploading..." : buttonText || "Upload"}
              type="submit"
              disabled={loading}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default useUpload;
