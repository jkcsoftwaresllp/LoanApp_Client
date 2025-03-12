import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { saveTokens } from "../utils/tokenUtils";
import {
  handleGenerateOtp,
  handleValidateOtp,
} from "../components/helper/otpHandlers";
import { showToast } from "../utils/toastUtils";
import { inputFieldConfig } from "../config/inputFieldConfig";
import { buttonConfig } from "../config/buttonConfig";
import { EyeCloseIcon, EyeIcon } from "../components/common/assets";

const useOtpHandler = ({ apiBaseUrl, onSuccessRedirect, isLogin }) => {
  const { setIsAuthenticated, setUser } = useAuthContext();


  const [formData, setFormData] = useState({
    email: "", // Changed from mobileNumber
    password: "",
    otp: "",
  });
  const [otpGenerated, setOtpGenerated] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleGenerateOtpWrapper = (e) => {
    e.preventDefault();
    handleGenerateOtp(
      formData,
      apiBaseUrl,
      isLogin,
      setOtpGenerated,
      setMessage,
      showToast
    );
  };

  const handleValidateOtpWrapper = (e) => {
    e.preventDefault();
    console.log("onSuccessRedirect:", onSuccessRedirect); 
    handleValidateOtp(
      formData,
      apiBaseUrl,
      setIsAuthenticated,
      setUser,
      navigate,
      onSuccessRedirect, 
      setMessage,
      showToast
    );
  };
  

  return {
    formData,
    otpGenerated,
    message,
    handleChange,
    inputFields: inputFieldConfig(isLogin).map((field) => ({
      ...field,
      value: formData[field.id],
      disabled: field.id === "email" ? otpGenerated : field.disabled, // Changed from mobileNumber
      hidden: field.id === "otp" ? !otpGenerated : field.hidden,
    })),
    buttonFields: buttonConfig(isLogin).map((button) => ({
      ...button,
      onClick:
        button.id === "generateOtp"
          ? handleGenerateOtpWrapper
          : button.id === "verifyOtp"
          ? handleValidateOtpWrapper
          : button.onClick,
      hidden: button.id === "verifyOtp" ? !otpGenerated : button.hidden,
    })),
  };
};

export default useOtpHandler;
