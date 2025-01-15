import { generateOtp, validateOtp } from "../../services/authService"; 
import { saveTokens } from "../../utils/tokenUtils";
export const handleGenerateOtp = async (formData, apiBaseUrl, isLogin, setOtpGenerated, setMessage, showToast) => {
  try {
    const response = await generateOtp(
      formData.mobileNumber,
      formData.email,
      apiBaseUrl,
      isLogin
    );
    setMessage(response.message || "OTP sent successfully");
    showToast("success", response.message || "OTP sent successfully");
    setOtpGenerated(true);
  } catch (error) {
    handleApiError(error, setMessage, showToast);
  }
};

export const handleValidateOtp = async (formData, apiBaseUrl, setIsAuthenticated, navigate, onSuccessRedirect, setMessage, showToast) => {
  try {
  
    const response = await validateOtp(
      formData.mobileNumber,
      formData.otp,
      apiBaseUrl
    );
    if (response.status === "success") {
      showToast("success", "OTP validated successfully");
      if (response.accessToken) {
        saveTokens(response.accessToken, response.refreshToken);
        setIsAuthenticated(true);
      }
      navigate(onSuccessRedirect);
    } else {
      showToast("error", response.message || "OTP verification failed");
    }
  } catch (error) {
    handleApiError(error, setMessage, showToast);
  }
};

const handleApiError = (error, setMessage, showToast) => {
  const errorMessage = error.response?.data?.message || "Something went wrong";
  console.error("API Error:", error);
  setMessage(errorMessage);
  showToast("error", errorMessage);
};
