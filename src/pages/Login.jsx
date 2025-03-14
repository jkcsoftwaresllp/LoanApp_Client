import React, { useState, useEffect } from "react";
import useOtpHandler from "../hooks/useOtpHandler";
import { TextInput } from "../components/common/TextInput";
import { Button } from "../components/common/Button";
import { useNavigate } from "react-router-dom";
import style from "./style/LoginForm.module.css";
import { Loader } from "../components/common/Loader";
import backgroundImage from "./assets/loginWallpaper.jpg";
import OtpInput from "./OtpInput";

const Login = () => {
  const navigate = useNavigate();
  const [headerHeight, setHeaderHeight] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isInvestor, setIsInvestor] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const apiBaseUrl = isInvestor
    ? "http://localhost:5000/api/investor/login"
    : "http://localhost:5000/api/login";

  const onSuccessRedirect = isInvestor ? "/portfolio" : "/home";

  const { otpGenerated, handleChange, message, inputFields, buttonFields } =
    useOtpHandler({
      apiBaseUrl,
      onSuccessRedirect,
      isLogin: true,
    });

  useEffect(() => {
    const header = document.querySelector("header");
    if (header) {
      setHeaderHeight(header.offsetHeight);
    }
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const goToRegister = () => {
    navigate("/register");
  };

  return (
    <>
      <div className={style.container}>
        {loading ? (
          <div className={style.loaderContainer}>
            <Loader />
          </div>
        ) : (
          <div className={style.form}>
            <h1 className={style.h1}>
              {isInvestor ? "Investor Login" : "Login"}
            </h1>
            <div className={style.flexColumn}>
              <form className="space-y-4">
                {/* Step 1: Email and Password */}
                {currentStep === 1 &&
                  inputFields
                    .filter(
                      (field) =>
                        !field.hidden &&
                        (field.id === "mobile_number" ||
                          field.id === "email" ||
                          field.id === "password")
                    )
                    .map((field) => (
                      <TextInput
                        key={field.id}
                        config={field}
                        onChange={handleChange}
                      />
                    ))}

                {/* Step 2: OTP */}
                {currentStep === 2 && (
                  <>
                    <p className={style.p}>
                      Code sent to{" "}
                      {inputFields.find((field) => field.id === "email")?.value}
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
                            (button) =>
                              !button.hidden && button.id === "generateOtp"
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
                      .filter(
                        (button) => !button.hidden && button.id === "generateOtp"
                      )
                      .map((button) => (
                        <Button
                          key={button.id}
                          type={button.type}
                          text={button.text}
                          onClick={(e) => {
                            button.onClick(e);
                            setCurrentStep(2);
                          }}
                          style={button.style}
                        />
                      ))}
                  {currentStep === 2 &&
                    buttonFields
                      .filter(
                        (button) => !button.hidden && button.id === "verifyOtp"
                      )
                      .map((button) => (
                        <Button
                          key={button.id}
                          type={button.type}
                          text={button.text}
                          onClick={button.onClick}
                          style={button.style}
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
                    {isInvestor ? "Switch to User Login" : "Login as Investor"}
                  </div>
                  <p className={style.p}>
                    Don't have an account?{" "}
                    <span onClick={goToRegister} className={style.span}>
                      Sign Up
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

export default Login;
