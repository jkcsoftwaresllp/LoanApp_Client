import React, { useState, useEffect } from "react";
import useOtpHandler from "../hooks/useOtpHandler";
import { TextInput } from "../components/common/TextInput";
import { Button } from "../components/common/Button";
import { useNavigate } from "react-router-dom";
import style from "./style/LoginForm.module.css";
import { Loader } from "../components/common/Loader";
import backgroundImage from "./assets/loginWallpaper.jpg";
import { showToast } from "../utils/toastUtils";

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isInvestor, setIsInvestor] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);

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

  const onSuccessRedirect = isInvestor ? "/investor-dashboard" : "/profile";

  const {
    otpGenerated,
    handleChange,
    message,
    inputFields,
    buttonFields,
    formData,
  } = useOtpHandler({
    apiBaseUrl,
    onSuccessRedirect,
    isLogin: false,
  });

  const handleGenerateOtp = (e) => {
    if (!validateEmail(formData.email)) {
      showToast("error", "The email format is incorrect");
      return;
    }
    buttonFields.find((button) => button.id === "generateOtp")?.onClick(e);
    setCurrentStep(2);
  };

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <>
      <div
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          height: `calc(100vh - ${headerHeight}px)`,
          width: "100vw",
        }}
      >
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
                {/* Step 1: Basic Details */}
                {currentStep === 1 &&
                  inputFields
                    .filter(
                      (field) =>
                        !field.hidden &&
                        ["name", "email", "mobileNumber", "password"].includes(
                          field.id
                        )
                    )
                    .map((field) => (
                      <TextInput
                        key={field.id}
                        config={field}
                        onChange={handleChange}
                      />
                    ))}

                {/* Step 2: OTP Verification */}
                {currentStep === 2 && (
                  <p className={style.p}>
                    OTP has been sent to{" "}
                    {
                      inputFields.find((field) => field.id === "mobileNumber")
                        ?.value
                    }
                  </p>
                )}
                {currentStep === 2 &&
                  inputFields
                    .filter((field) => !field.hidden && field.id === "otp")
                    .map((field) => (
                      <TextInput
                        key={field.id}
                        config={field}
                        onChange={handleChange}
                      />
                    ))}
                <div style={{ display: "flex", gap: "10px" }}>
                  {currentStep === 1 &&
                    buttonFields
                      .filter((button) => ["generateOtp"].includes(button.id))
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
    </>
  );
};

export default Register;
