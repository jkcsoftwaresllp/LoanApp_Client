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
      formData.email, // Changed from formData.mobileNumber
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
  setUser,
  navigate,
  onSuccessRedirect,
  setMessage,
  showToast
) => {
  try {
    console.log("Validating OTP with data:", formData);

    const response = await validateOtp(
      formData.email, // Changed from formData.mobileNumber
      formData.otp,
      formData.password,
      apiBaseUrl
    );

    console.log("OTP Validation Response:", response); // Debugging

    if (response?.status === "success") {
      showToast("success", "OTP validated successfully");

      const { accessToken, refreshToken, uniqueCode, role } = response;

      if (accessToken && uniqueCode && role) {
        // ✅ Fix: Correct LocalStorage Key Name & Store Refresh Token
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("role", role);
        localStorage.setItem("user", JSON.stringify({ uniqueCode, role })); 

        setIsAuthenticated(true);
        setUser({ uniqueCode, role });
        
        console.log("User set in context:", { uniqueCode, role });

        // ✅ Debugging: Check Storage Values
        console.log("Saved in Local Storage:", {
          accessToken: localStorage.getItem("accessToken"),
          refreshToken: localStorage.getItem("refreshToken"),
          role: localStorage.getItem("role"),
          user: localStorage.getItem("user"),
        });
      } else {
        console.error("Access token, uniqueCode, or role missing in response");
      }

      console.log("Navigating to:", onSuccessRedirect);
      navigate(onSuccessRedirect);
    } else {
      const errorMessage = response?.message || "OTP verification failed";
      showToast("error", errorMessage);
      setMessage(errorMessage);
    }
  } catch (error) {
    handleApiError(error, setMessage, showToast);
  }
};

// 🔥 Improved Error Handling
const handleApiError = (error, setMessage, showToast) => {
  const errorMessage = error?.response?.data?.message || "Something went wrong";
  console.error("API Error:", error?.response?.data || error);
  setMessage(errorMessage);
  showToast("error", errorMessage);
};
