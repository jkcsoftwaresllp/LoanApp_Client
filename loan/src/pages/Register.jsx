import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext"; // Use AuthContext

const Register = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(""); // State for OTP input
  const [otpGenerated, setOtpGenerated] = useState(false); // State to track OTP generation
  const { setIsAuthenticated } = useAuthContext(); // Set authentication state
  const navigate = useNavigate(); // Hook to navigate to another page

  // Handle Generate OTP
  const handleGenerateOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/otp/register/generate-otp", {
        mobile_number: mobileNumber,
        email,
      });

      if (response && response.data) {
        alert(response.data.message || "OTP sent successfully");
        setOtpGenerated(true); // Allow OTP input field to show
      } else {
        alert("Unexpected response from server");
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      const errorMessage =
        error.response?.data?.message || "Something went wrong. Please try again.";
      alert(errorMessage);

      // If the number is already registered, redirect to login
      if (errorMessage.includes("already registered")) {
        navigate("/login");
      }
    }
  };

  // Handle Validate OTP
  const handleValidateOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/otp/register/validate-otp", {
        mobile_number: mobileNumber,
        otp,
      });

      if (response && response.data.status === "success") {
        alert("OTP validated successfully. Redirecting to profile page...");
        setIsAuthenticated(true); // Set user as authenticated
        localStorage.setItem("accessToken", response.data.accessToken); // Save token
        localStorage.setItem("refreshToken", response.data.refreshToken);
        navigate("/profile");
      } else {
        alert(response.data.message || "Failed to validate OTP");
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      alert(error.response?.data?.error || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={otpGenerated ? handleValidateOtp : handleGenerateOtp}
        className="p-6 bg-white rounded shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

        {/* Mobile Number Input */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="mobileNumber">
            Mobile Number
          </label>
          <input
            type="text"
            id="mobileNumber"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            placeholder="Enter your mobile number"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            disabled={otpGenerated}
          />
        </div>

        {/* Email Input */}
        {!otpGenerated && (
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
        )}

        {/* OTP Input */}
        {otpGenerated && (
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="otp">
              Enter OTP
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter the OTP sent to your mobile"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none"
        >
          {otpGenerated ? "Validate OTP" : "Generate OTP"}
        </button>
      </form>
    </div>
  );
};

export default Register;
