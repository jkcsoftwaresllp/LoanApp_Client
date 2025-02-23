import React, { useState, useEffect } from "react";
import style from "./style/Header.module.css";
import { useNavigate } from "react-router-dom";
import { UserIcon } from "./assets";
import Notification from "./Notification";
import { useAuthContext } from "../../context/AuthContext";
import LogoutButton from "../../pages/LogoutButton";

export const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthContext(); // Get isAuthenticated from context
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsChecked(true);
      document.body.classList.add("dark-mode");
    } else {
      setIsChecked(false);
      document.body.classList.remove("dark-mode");
    }
  }, []);

  const goToHome = () => {
    navigate("/"); // Redirects to the home page
  };
  const goToProfile = () => {
    navigate("/profile"); // Redirects to the profile page
  };

  // Handle checkbox change to toggle theme
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);

    // Toggle dark mode class on the body
    if (!isChecked) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark"); // Save the theme to localStorage
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light"); // Save the theme to localStorage
    }
  };

  return (
    <header className={style.header}>
      <div className={style.textLoan} onClick={goToHome}>
        Loan
      </div>
      {isAuthenticated && <LogoutButton />}
      <div className={style.rightSection}>
        <div className={style.checkboxWrapper}>
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
          />
        </div>
        <div className={style.actionBtn}>
          {/* Conditionally render UserIcon and Notification based on authentication */}
          {isAuthenticated && (
            <>
              <div className={style.Icon} onClick={goToProfile}>
                <UserIcon />
              </div>
              <div className={style.Icon}>
                <Notification />
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
