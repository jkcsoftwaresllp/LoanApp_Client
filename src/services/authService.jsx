import axios from "axios";

export const generateOtp = async (mobileNumber, email, apiBaseUrl, isLogin) => {
  const requestBody = isLogin
    ? { mobile_number: mobileNumber }
    : { mobile_number: mobileNumber, email };


  const response = await axios.post(`${apiBaseUrl}/generate-otp`, requestBody);
  return response.data;
};

export const validateOtp = async (mobileNumber, otp, apiBaseUrl) => {
  console.log("validateOtp called with:", { apiBaseUrl, mobileNumber, otp });

  const response = await axios.post(`${apiBaseUrl}/validate-otp`, {
    mobile_number: mobileNumber,
    otp,
  });
  return response.data;
};
