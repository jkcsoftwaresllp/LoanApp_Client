import React, { useState, useEffect } from "react";
import style from "./style/Header.module.css";
import { useNavigate } from "react-router-dom";
import { UserIcon } from "./assets";
import Notification from "./Notification";
import { useAuthContext } from "../../context/AuthContext";
import LogoutButton from "../../pages/LogoutButton";
import "./style/RippleEffect.css"; // Add this import

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
    navigate("/home"); // Redirects to the home page
  };
  const goToProfile = () => {
    navigate("/profile"); // Redirects to the profile page
  };

  // Handle checkbox change to toggle theme
  const handleCheckboxChange = () => {
    // Create ripple element
    const ripple = document.createElement("div");
    ripple.className = "ripple-effect";
    ripple.style.backgroundColor = isChecked ? "#f9f9f9" : "#100f1f";
    document.body.appendChild(ripple);

    // Position ripple at center
    const rect = document.body.getBoundingClientRect();
    ripple.style.left = `${rect.width / 2}px`;
    ripple.style.top = `${rect.height / 2}px`;

    // Start animation
    setTimeout(() => {
      ripple.style.transform = "scale(100)";
    }, 10);

    // Remove ripple after animation
    setTimeout(() => {
      ripple.remove();
    }, 1000);

    // Toggle theme after slight delay
    setTimeout(() => {
      setIsChecked(!isChecked);
      if (!isChecked) {
        document.body.classList.add("dark-mode");
        localStorage.setItem("theme", "dark");
      } else {
        document.body.classList.remove("dark-mode");
        localStorage.setItem("theme", "light");
      }
    }, 200);
  };
  return (
    <header className={style.header}>
      <div className={style.textLoan} onClick={goToHome}>
        Loan
      </div>

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
