import axios from "axios";

const API_URL = "http://localhost:5000/api/otp"; // Keep it generic

export const generateOtp = async (mobileNumber, email, apiBaseUrl, isLogin) => {
  // Only send email if it's not a login request
  const requestBody = isLogin
    ? { mobile_number: mobileNumber }  // Only send mobile number for login
    : { mobile_number: mobileNumber, email };  // Send both for registration

  const response = await axios.post(`${apiBaseUrl}/generate-otp`, requestBody);
  return response.data;
};

export const validateOtp = async (mobileNumber, otp, apiBaseUrl) => {
  const response = await axios.post(`${apiBaseUrl}/validate-otp`, {
    mobile_number: mobileNumber,
    otp,
  });
  return response.data;
};
