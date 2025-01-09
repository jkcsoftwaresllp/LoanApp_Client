import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

const Login = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // Step 1: Generate OTP, Step 2: Validate OTP
  const [message, setMessage] = useState("");
  const { setIsAuthenticated } = useAuthContext(); // Use AuthContext
  const navigate = useNavigate();

  // Handle Generate OTP
  const handleGenerateOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/otp/login/generate-otp", {
        mobile_number: mobileNumber,
      });
      setMessage(response.data.message || "OTP sent successfully");
      setStep(2);
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  // Handle Validate OTP
  const handleValidateOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/otp/login/validate-otp", {
        mobile_number: mobileNumber,
        otp,
      });

      if (response && response.data.status === "success") {
        setMessage("Login successful!");
        setIsAuthenticated(true); // Set user as authenticated
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        navigate("/profile");
      } else {
        setMessage(response.data.message || "OTP verification failed");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-8 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Login</h2>

        {step === 1 && (
          <form onSubmit={handleGenerateOtp} className="space-y-4">
            <input
              type="text"
              placeholder="Mobile Number"
              className="w-full p-2 border rounded"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              required
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Generate OTP
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleValidateOtp} className="space-y-4">
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full p-2 border rounded"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              Verify OTP
            </button>
          </form>
        )}

        {message && <p className="mt-4 text-red-500">{message}</p>}
      </div>
    </div>
  );
};

export default Login;
