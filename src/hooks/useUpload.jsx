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

  const allowedTypes = ["JPG", "PNG", "PDF"];

  const validateFile = (file) => {
    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      showToast(
        "error",
        "Invalid file type. Only JPG, PNG, and PDF are allowed."
      );
      return false;
    }
    if (file.size > maxSize) {
      showToast("error", "File size exceeds the 5MB limit.");
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

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      showToast("error", "No authentication token found.");
      return;
    }

    // if (!file) {
    //   showToast("error", "Please choose a file.");
    //   return;
    // }

    if (!documentType) {
      showToast("error", "Please specify the document type.");
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
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        showToast("success", "File uploaded successfully.");
        setFile(null);
        setDocumentType("");
      } else {
        setErrorMessage(data.message || "Upload failed. Please try again.");
      }
    } catch (error) {
      showToast("error", "Error during file upload. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>{buttonText || "Upload Document"}</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        {errorMessage && <div className={styles.errorMsg}>{errorMessage}</div>}

        <FileInput file={file} onFileChange={handleFileChange} />

        <div className={styles.inputField}>
          <label className={styles.llabel}>Choose file type</label>
          <select
            value={documentType}
            onChange={handleTypeChange}
            className={styles.input}
          >
            {allowedTypes.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {loading && (
          <div className={styles.loaderWrapper}>
            <Loader />
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
  );
};

export default useUpload;
