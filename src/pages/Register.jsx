import React, { useState, useEffect } from "react";
import useOtpHandler from "../hooks/useOtpHandler";
import { TextInput } from "../components/common/TextInput";
import { Button } from "../components/common/Button";
import { useNavigate } from "react-router-dom";
import style from "./style/LoginForm.module.css";
import { Loader } from "../components/common/Loader";
import { showToast } from "../utils/toastUtils";
import OtpInput from "./OtpInput";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isInvestor, setIsInvestor] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({}); // Ensure formData state exists

  useEffect(() => {
    const header = document.querySelector("header");
    if (header) {
      setHeaderHeight(header.offsetHeight);
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const apiBaseUrl = isInvestor
    ? "http://localhost:5000/api/investor/register"
    : "http://localhost:5000/api/register";

  const onSuccessRedirect = "/home";
  const { otpGenerated, handleChange, message, inputFields, buttonFields } =
    useOtpHandler({
      apiBaseUrl,
      onSuccessRedirect,
      isLogin: false,
      setFormData, // Pass setFormData to update state
    });

  // Handle OTP Generation
  const handleGenerateOtp = (e) => {
    buttonFields.find((button) => button.id === "generateOtp")?.onClick(e);
    setCurrentStep(2);
  };

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <div className={style.container}>
      {loading ? (
        <div className={style.loaderContainer}>
          <Loader />
        </div>
      ) : (
        <div className={style.form}>
          <h1 className={style.h1}>
            {isInvestor ? "Investor Register" : "Register"}
          </h1>
          <div className={style.flexColumn}>
            <form className="space-y-4">
              {currentStep === 1 &&
                inputFields
                  .filter(
                    (field) =>
                      !field.hidden &&
                      ["name", "email", "mobile_number", "password"].includes(
                        field.id
                      )
                  )
                  .map((field) => (
                    <TextInput
                      key={field.id}
                      config={field}
                      value={formData[field.id] || ""} // Ensure it's pulling from useOtpHandler
                      onChange={handleChange}
                    />
                  ))}

              {/* Step 2: OTP Input */}
              {currentStep === 2 && (
                <>
                  <p className={style.p}>
                    Code has been sent to{" "}
                    <span style={{ color: "#007bff" }}>
                      {inputFields.find((field) => field.id === "email")?.value}
                    </span>
                  </p>
                  <OtpInput
                    length={4}
                    onChange={(otp) =>
                      handleChange({ target: { name: "otp", value: otp } })
                    }
                  />

                  <div className={style.p}>
                    Didn't receive code?{" "}
                    <span
                      className={style.span}
                      onClick={(e) => {
                        const generateOtpButton = buttonFields.find(
                          (button) => button.id === "generateOtp"
                        );
                        if (generateOtpButton) {
                          generateOtpButton.onClick(e);
                        }
                      }}
                    >
                      Request Again
                    </span>
                  </div>
                </>
              )}

              <div style={{ display: "flex", gap: "10px" }}>
                {currentStep === 1 &&
                  buttonFields
                    .filter((button) => button.id === "generateOtp")
                    .map((button) => (
                      <Button
                        key={button.id}
                        type={button.type}
                        text={button.text}
                        onClick={handleGenerateOtp}
                      />
                    ))}

                {currentStep === 2 &&
                  buttonFields
                    .filter((button) => button.id === "verifyOtp")
                    .map((button) => (
                      <Button
                        key={button.id}
                        type={button.type}
                        text={button.text}
                        onClick={button.onClick}
                      />
                    ))}
              </div>
            </form>

            {currentStep === 1 && (
              <>
                <div
                  onClick={() => setIsInvestor(!isInvestor)}
                  className={style.p}
                >
                  {isInvestor
                    ? "Switch to User Register"
                    : "Register as Investor"}
                </div>
                <p className={style.p}>
                  Already have an account?{" "}
                  <span onClick={goToLogin} className={style.span}>
                    Sign In
                  </span>
                </p>
              </>
            )}

            {message && <p className={style.error}>{message}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
