import apiRequest from '../common/authApi';

export const fetchProfile = async (accessToken, apiUrl, navigate, setLoading, setProfile, setUpdatedProfile) => {
  try {
    const data = await apiRequest('get', apiUrl, null, accessToken, setLoading);
    setProfile(data.userProfile);
    setUpdatedProfile(data.userProfile);  
  } catch (error) {
    alert(error.message);
    if (error.message === "Session expired. Please log in again.") {
      localStorage.removeItem("accessToken");
      navigate("/login");
    }
  }
};

export const sendOtp = async (email, accessToken, apiUrl, navigate, setOtpSent) => {
  try {
    const data = await apiRequest('post', apiUrl, { email }, accessToken, null);
    alert("OTP sent to the new email address.");
    setOtpSent(true);
  } catch (error) {
    alert(error.message);
  }
};

export const updateProfile = async (payload, accessToken, apiUrl, navigate, setProfile, setIsEditing, setOtp, setOtpSent) => {
  try {
    const data = await apiRequest('patch', apiUrl, payload, accessToken, null);
    alert("Profile updated successfully.");
    setProfile(payload.profile);
    setIsEditing(false);
    setOtp("");
    setOtpSent(false);
  } catch (error) {
    alert(error.message);
  }
};
