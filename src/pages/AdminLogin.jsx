import React, { useState, useEffect } from "react";
import useOtpHandler from "../hooks/useOtpHandler";
import { TextInput } from "../components/common/TextInput";
import { Button } from "../components/common/Button";
import { useNavigate } from "react-router-dom";
import style from "./style/LoginForm.module.css";
import { Loader } from "../components/common/Loader";
import OtpInput from "./OtpInput";
import { showToast } from "../utils/toastUtils";
import { API_BASE_URL } from "../config";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [headerHeight, setHeaderHeight] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);

  const apiBaseUrl = `${API_BASE_URL}admin/login`;
  const onSuccessRedirect = "/admin/dashboard";

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

  const validateInputs = (inputFields) => {
    const emailField = inputFields.find((field) => field.id === "email");
    const phoneField = inputFields.find(
      (field) => field.id === "mobile_number"
    );

    if (!emailField?.value?.trim()) {
      showToast("error", "Email is required");
      return false;
    }

    if (!phoneField?.value?.trim()) {
      showToast("error", "Phone number is required");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailField.value.trim())) {
      showToast("error", "Please enter a valid email address");
      return false;
    }

    if (!/^\d{10}$/.test(phoneField.value.trim())) {
      showToast("error", "Please enter a valid 10-digit phone number");
      return false;
    }

    return true;
  };

  const goToRegister = () => {
    navigate("/aregister");
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
            <h1 className={style.h1}>Admin Login</h1>
            <div className={style.flexColumn}>
              <form className="space-y-4">
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

                {currentStep === 2 && (
                  <>
                    <p className={style.p}>
                      Code sent to{" "}
                      <span style={{ color: "#007bff" }}>
                        {
                          inputFields.find((field) => field.id === "email")
                            ?.value
                        }
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
                          const spanElement = e.currentTarget;
                          const generateOtpButton = buttonFields.find(
                            (button) =>
                              !button.hidden && button.id === "generateOtp"
                          );

                          spanElement.style.pointerEvents = "none";
                          spanElement.style.color = "#808080";
                          let countdown = 30;

                          const interval = setInterval(() => {
                            spanElement.textContent = `Request Again (${countdown}s)`;
                            countdown--;

                            if (countdown < 0) {
                              clearInterval(interval);
                              spanElement.textContent = "Request Again";
                              spanElement.style.pointerEvents = "auto";
                              spanElement.style.color = "";
                            }
                          }, 1000);

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
                        (button) =>
                          !button.hidden && button.id === "generateOtp"
                      )
                      .map((button) => (
                        <Button
                          key={button.id}
                          type={button.type}
                          text={button.text}
                          onClick={(e) => {
                            if (validateInputs(inputFields)) {
                              button.onClick(e);
                              setCurrentStep(2);
                            }
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
              {message && <p className={style.error}>{message}</p>}
              {currentStep === 1 && (
                <p className={style.p}>
                  Register for an account?{" "}
                  <span onClick={goToRegister} className={style.span}>
                    Sign Up
                  </span>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminLogin;
