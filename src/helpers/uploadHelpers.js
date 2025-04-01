import { showToast } from "../utils/toastUtils";
import { API_BASE_URL } from "../config";

export const fetchUserProfile = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      showToast("error", "No authentication token found.");
      return;
    }

    const response = await fetch(`${API_BASE_URL}auth/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    showToast("error", "Error fetching user profile");
    return null;
  }
};

export const validateFile = (file) => {
  const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
  const maxSize = 5 * 1024 * 1024; // 5MB

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

export const uploadFile = ({
  formDataToSend,
  apiRoute,
  onProgress,
  onSuccess,
  onError,
}) => {
  const token = localStorage.getItem("accessToken");
  const xhr = new XMLHttpRequest();

  xhr.upload.addEventListener("progress", (event) => {
    if (event.lengthComputable) {
      const progress = Math.round((event.loaded / event.total) * 100);
      onProgress(progress);
    }
  });

  xhr.open("POST", `${API_BASE_URL}auth/${apiRoute}`);
  xhr.setRequestHeader("Authorization", `Bearer ${token}`);

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      const data = JSON.parse(xhr.responseText);
      onSuccess(data);
    } else {
      const data = JSON.parse(xhr.responseText);
      onError(data.message || "Upload failed. Please try again.");
    }
  };

  xhr.onerror = function () {
    onError("Error during file upload. Please try again.");
  };

  xhr.send(formDataToSend);
};
