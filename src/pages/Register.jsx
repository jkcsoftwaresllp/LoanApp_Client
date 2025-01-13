import React from "react";
import useOtpHandler from "../hooks/useOtpHandler";
import TextInput from "../components/TextInput";
import Button from "../components/Button";

const Register = () => {
  const {
    formData,
    otpGenerated,
    handleChange,
    handleGenerateOtp,
    handleValidateOtp,
    message,
    inputFields,
  } = useOtpHandler({
    apiBaseUrl: "http://localhost:5000/api/otp/register", // Registration endpoint
    onSuccessRedirect: "/profile",
    isLogin: false, // Set for registration
  });

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-8 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Register</h2>

        {/* Step 1: Generate OTP */}
        {!otpGenerated && (
          <form onSubmit={handleGenerateOtp} className="space-y-4">
            {inputFields.map((field) => (
              <TextInput
                key={field.id}
                config={field}
                onChange={handleChange}
              />
            ))}
            <Button
              type="submit"
              text="Generate OTP"
            />
          </form>
        )}

        {/* Step 2: Validate OTP */}
        {otpGenerated && (
          <form onSubmit={handleValidateOtp} className="space-y-4">
            {inputFields.map((field) => (
              <TextInput
                key={field.id}
                config={field}
                onChange={handleChange}
              />
            ))}
            <Button
              type="submit"
              text="Verify OTP"
            />
          </form>
        )}

        {/* Display any message */}
        {message && <p className="mt-4 text-red-500">{message}</p>}
      </div>
    </div>
  );
};

export default Register;
