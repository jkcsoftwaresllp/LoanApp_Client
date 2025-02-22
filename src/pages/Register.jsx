import React, { useState, useEffect } from "react";
import useOtpHandler from "../hooks/useOtpHandler";
import { TextInput } from "../components/common/TextInput";
import { Button } from "../components/common/Button";
import { useNavigate } from "react-router-dom";
import style from "./style/LoginForm.module.css";
import { Loader } from "../components/common/Loader";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isInvestor, setIsInvestor] = useState(false);


  const apiBaseUrl = isInvestor
    ? "http://localhost:5000/api/investor/register"
    : "http://localhost:5000/api/register";

  const onSuccessRedirect = isInvestor ? "/investor-dashboard" : "/profile";

  const { otpGenerated, handleChange, message, inputFields, buttonFields } =
    useOtpHandler({
      apiBaseUrl,
      onSuccessRedirect,
      isLogin: false,
    });

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <>
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
                  />
                ))}
            </form>

            <Button
              type="button"
              text={
                isInvestor ? "Switch to User Register" : "Register as Investor"
              }
              onClick={() => setIsInvestor(!isInvestor)}
              className={style.investorButton}
            />

            <p className={style.p}>
              Already have an account?{" "}
              <span onClick={goToLogin} className={style.span}>
                Sign In
              </span>
            </p>

            {message && <p className={style.error}>{message}</p>}
          </div>
        </div>
      )}
    </>
  );
};

export default Register;
