import apiRequest from "../common/authApi";
import { showToast } from "../../utils/toastUtils";
export const fetchProfile = async (
  accessToken,
  apiUrl,
  navigate,
  setLoading,
  setProfile,
  setUpdatedProfile
) => {
  try {
    const data = await apiRequest("get", apiUrl, null, accessToken, setLoading);
    setProfile(data.userProfile);
    setUpdatedProfile(data.userProfile);
  } catch (error) {
    alert(error.message);
    if (error.message === "Session expired. Please log in again.") {
      localStorage.removeItem("accessToken");
      showToast("error", "Session expired. Please log in again");
      navigate("/login");
    }
  }
};

export const sendOtp = async (
  email,
  accessToken,
  apiUrl,
  navigate,
  setOtpSent
) => {
  try {
    const data = await apiRequest("post", apiUrl, { email }, accessToken, null);

    showToast("info", "OTP sent to the new email address.");
    setOtpSent(true);
  } catch (error) {
    alert(error.message);
    console.log(error);
  }
};

export const updateProfile = async (
  payload,
  accessToken,
  apiUrl,
  navigate,
  setProfile,
  setIsEditing,
  setOtp,
  setOtpSent
) => {
  try {
    const data = await apiRequest("patch", apiUrl, payload, accessToken, null);

    showToast("success", "Profile updated successfully!");
    setProfile(payload.profile);
    setIsEditing(false);
    setOtp("");
    setOtpSent(false);
  } catch (error) {
    alert(error.message);
  }
};
