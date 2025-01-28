import axios from "axios";

export const generateOtp = async (mobileNumber, email, password, apiBaseUrl, isLogin) => {
  const requestBody = isLogin
    ? { mobile_number: mobileNumber }  
    : { mobile_number: mobileNumber, email, password };  

  try {
    const response = await axios.post(`${apiBaseUrl}/generate-otp`, requestBody);
    return response.data;
  } catch (error) {
    console.error("Error generating OTP:", error);
    throw error;  
  }
};

export const validateOtp = async (mobileNumber, otp, password, apiBaseUrl) => {
  console.log("validateOtp called with:", { apiBaseUrl, mobileNumber, otp, password });

  const response = await axios.post(`${apiBaseUrl}/validate-otp`, {
    mobile_number: mobileNumber,
    otp,
    password,  
  });
  
  return response.data;
};
