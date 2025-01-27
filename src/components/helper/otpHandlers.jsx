import { generateOtp, validateOtp } from "../../services/authService";
import { saveTokens } from "../../utils/tokenUtils";


export const handleGenerateOtp = async (
  formData,
  apiBaseUrl,
  isLogin,
  setOtpGenerated,
  setMessage,
  showToast
) => {
  try {
    const response = await generateOtp(
      formData.mobileNumber,
      formData.email,
      formData.password,
      apiBaseUrl,
      isLogin
    );

    const successMessage = response.message || "OTP sent successfully";
    setMessage(successMessage);
    showToast("success", successMessage);
    setOtpGenerated(true);
  } catch (error) {
    handleApiError(error, setMessage, showToast);
  }
};

export const handleValidateOtp = async (
  formData,
  apiBaseUrl,
  setIsAuthenticated,
  navigate,
  onSuccessRedirect,
  setMessage,
  showToast
) => {
  try {
    const response = await validateOtp(
      formData.mobileNumber,
      formData.otp,
      formData.password,
      apiBaseUrl
    );

    if (response.status === "success") {
      showToast("success", "OTP validated successfully");

      const { accessToken, refreshToken, loanData } = response;

      if (accessToken) {
        saveTokens(accessToken, refreshToken, loanData || null); 
        setIsAuthenticated(true);
      }

      navigate(onSuccessRedirect);
    } else {
      const errorMessage = response.message || "OTP verification failed";
      showToast("error", errorMessage);
      setMessage(errorMessage);
    }
  } catch (error) {
    handleApiError(error, setMessage, showToast);
  }
};

const handleApiError = (error, setMessage, showToast) => {
  const errorMessage = error.response?.data?.message || "Something went wrong";
  console.error("API Error:", error.response?.data || error); // Improved logging
  setMessage(errorMessage);
  showToast("error", errorMessage);
};
