import React, { useState, useEffect } from "react";
import useOtpHandler from "../hooks/useOtpHandler";
import { TextInput } from "../components/common/TextInput";
import { Button } from "../components/common/Button";
import { apilog } from "../utils/Api";
import { useNavigate } from "react-router-dom";
import style from "./style/LoginForm.module.css";
import { Loader } from "../components/common/Loader";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { otpGenerated, handleChange, message, inputFields, buttonFields } =
    useOtpHandler({
      apiBaseUrl: apilog,
      onSuccessRedirect: "/profile",
      isLogin: true,
    });

  useEffect(() => {
    // Simulate loading completion after 1 second
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const goToRegister = () => {
    navigate("/register"); // Navigate to the /register page
  };

  return (
    <>
      {loading ? (
        <div className={style.loaderContainer}>
          <Loader /> {/* Show loader when loading is true */}
        </div>
      ) : (
        <div className={style.form}>
          <h1 className={style.h1}>Login</h1>
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
            <p className={style.p}>
              Don't have an account?{" "}
              <span onClick={goToRegister} className={style.span}>
                Sign Up
              </span>
            </p>

            {message && <p className={style.error}>{message}</p>}
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
