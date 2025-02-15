import React, { useState, useEffect } from "react"; // Import useState and useEffect
import useOtpHandler from "../hooks/useOtpHandler";
import { TextInput } from "../components/common/TextInput";
import { Button } from "../components/common/Button";
import { apireg } from "../utils/Api";
import { useNavigate } from "react-router-dom";
import style from "./style/LoginForm.module.css";
import { Loader } from "../components/common/Loader";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // Define state for loading
  const { otpGenerated, handleChange, message, inputFields, buttonFields } =
    useOtpHandler({
      apiBaseUrl: apireg,
      onSuccessRedirect: "/profile",
      isLogin: false,
    });

  useEffect(() => {
    // Simulate loading completion after 1 second
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const goToLogin = () => {
    navigate("/login"); // Navigate to the /login page
  };

  return (
    <>
      {loading ? (
        <div className={style.loaderContainer}>
          <Loader /> {/* Show loader when loading is true */}
        </div>
      ) : (
        <div className={style.form}>
          <h1 className={style.h1}>Register</h1>
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
                    className={button.className}
                  />
                ))}
            </form>
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
