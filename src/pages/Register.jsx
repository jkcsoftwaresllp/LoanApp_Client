import React from "react";
import useOtpHandler from "../hooks/useOtpHandler";
import TextInput from "../components/common/TextInput";
import Button from "../components/common/Button";
import { apireg } from "../utils/Api"; 
const Register = () => {
  const { otpGenerated, handleChange, message, inputFields, buttonFields } =
    useOtpHandler({
      apiBaseUrl: apireg, 
      onSuccessRedirect: "/profile",
      isLogin: false, 
    });

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-8 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Register</h2>

        <form className="space-y-4">
          {inputFields
            .filter((field) => !field.hidden) 
            .map((field) => (
              <TextInput
                key={field.id}
                config={field}
                onChange={handleChange}
              />
            ))}

        
          {buttonFields
            .filter((button) => !button.hidden) 
            .map((button) => (
              <Button
                key={button.id}
                type={button.type}
                text={button.text}
                onClick={button.onClick}
                className={button.className}
              />
            ))}
        </form>

        
        {message && <p className="mt-4 text-red-500">{message}</p>}
      </div>
    </div>
  );
};

export default Register;
