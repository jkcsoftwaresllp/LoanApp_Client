import axios from 'axios';

export const generateOtp = async (email, password, apiBaseUrl, isLogin) => {
  try {
    const response = await axios.post(`${apiBaseUrl}/generate-otp`, {
      email,
      password,
      isLogin,
    });
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
