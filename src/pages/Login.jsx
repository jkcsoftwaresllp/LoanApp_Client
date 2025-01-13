import React from "react";
import useOtpHandler from "../hooks/useOtpHandler";
import TextInput from "../components/TextInput";
import Button from "../components/Button";

const Login = () => {
  const {
    formData,
    otpGenerated,
    handleChange,
    handleGenerateOtp,
    handleValidateOtp,
    message,
    inputFields,
  } = useOtpHandler({
    apiBaseUrl: "http://localhost:5000/api/otp/login", 
    onSuccessRedirect: "/profile",
    isLogin: true, 
  });

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-8 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Login</h2>

       
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

       
        {message && <p className="mt-4 text-red-500">{message}</p>}
      </div>
    </div>
  );
};

export default Login;
