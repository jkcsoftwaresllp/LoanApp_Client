import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { generateOtp, validateOtp } from "../services/authService";
import { inputFieldConfig } from "../config/inputFieldConfig"; 
import { useAuthContext } from "../context/AuthContext";  
import { saveTokens } from "../utils/tokenUtils";  

const useOtpHandler = ({ apiBaseUrl, onSuccessRedirect, isLogin }) => {
  const { setIsAuthenticated } = useAuthContext();  
  const [formData, setFormData] = useState({
    mobileNumber: "",
    email: "",
    otp: "",
  });
  const [otpGenerated, setOtpGenerated] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleGenerateOtp = async (e) => {
    e.preventDefault();
    try {
      
      const response = await generateOtp(formData.mobileNumber, formData.email, apiBaseUrl, isLogin);
      setMessage(response.message || "OTP sent successfully");
      toast.success(response.message || "OTP sent successfully");
      setOtpGenerated(true);
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleValidateOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await validateOtp(formData.mobileNumber, formData.otp, apiBaseUrl);
      if (response.status === "success") {
        toast.success("OTP validated successfully");
        if (response.accessToken) {
         
          saveTokens(response.accessToken, response.refreshToken);
          setIsAuthenticated(true);  
        }
        navigate(onSuccessRedirect); 
      } else {
        toast.error(response.message || "OTP verification failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  
  const inputFields = inputFieldConfig(isLogin).map((field) => ({
    ...field,
    value: formData[field.id],
    disabled: field.id === "mobileNumber" ? otpGenerated : field.disabled,
    hidden: field.id === "otp" ? !otpGenerated : field.hidden,
  }));

  return {
    formData,
    otpGenerated,
    message,
    handleChange,
    handleGenerateOtp,
    handleValidateOtp,
    inputFields,
  };
};

export default useOtpHandler;
