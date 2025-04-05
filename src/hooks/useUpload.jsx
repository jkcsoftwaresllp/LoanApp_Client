import { useState, useEffect } from "react";
import { FileInput } from "../components/document/FileInput";
import { Button } from "../components/common/Button";
import styles from "../Styles/PageSlider.module.css";
import { showToast } from "../utils/toastUtils";
import UserGuaranteeForm from "../components/forms/UserGuaranteeForm";
import { fetchUserProfile, uploadFile } from "../helpers/uploadHelpers";

const useUpload = ({ apiRoute, text }) => {
  const [file, setFile] = useState(null);
  const [documentType, setDocumentType] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    parent_name: "",
    address: "",
    mobile_number: "",
    bank_account_number: "",
  });
  useEffect(() => {
    const loadProfile = async () => {
      if (apiRoute !== "upload-documents") return;

      const data = await fetchUserProfile();
      if (data?.status === "success") {
        setFormData({
          name: data.personalDetails?.full_name || "",
          parent_name: data.personalDetails?.father_or_mother_name || "",
          address: data.personalDetails?.current_address || "",
          mobile_number: data.personalDetails?.mobile_number || "",
          bank_account_number: data.bankingInfo?.account_number || "",
        });
      }
    };

    loadProfile();
  }, [apiRoute]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

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

    // Add validation for all required fields
    const requiredFields = [
      "name",
      "parent_name",
      "address",
      "mobile_number",
      "bank_account_number",
    ];
    const emptyFields = requiredFields.filter((field) => !formData[field]);

    if (emptyFields.length > 0) {
      showToast(
        "error",
        `Please fill in all required fields: ${emptyFields.join(", ")}`
      );
      return;
    }

    if (!token) {
      showToast("error", "No authentication token found.");
      return;
    }

    if (!file) {
      showToast("error", "Please select a file to upload.");
      return;
    }

    if (!documentType) {
      showToast("error", "Please specify the document type.");
      return;
    }

    // Create FormData and add all required fields
    const formDataToSend = new FormData();
    formDataToSend.append("file", file);
    formDataToSend.append("type", documentType);
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    try {
      setLoading(true);
      uploadFile({
        formDataToSend,
        apiRoute,
        onProgress: (progress) => setUploadProgress(progress),
        onSuccess: () => {
          showToast("success", "File uploaded successfully.");
          setFile(null);
          setDocumentType("");
          setLoading(false);
        },
        onError: (message) => {
          setErrorMessage(message);
          setLoading(false);
        },
      });
    } catch (error) {
      showToast("error", "Error during file upload. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-left justify-left">
      <div>
        <h1 className={styles.header}>{`Fill ${text} Document`}</h1>

        <form onSubmit={handleSubmit}>
          {errorMessage && (
            <div className={styles.errorMsg}>{errorMessage}</div>
          )}

          <UserGuaranteeForm
            formData={formData}
            handleInputChange={handleInputChange}
            text={text}
          />

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
                    borderRadius: "10px",
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
            <FileInput file={file} onFileChange={handleFileChange} />
            <Button
              text={loading ? "Uploading..." : "Upload"}
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
