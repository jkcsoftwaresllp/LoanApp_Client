import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./style/Home.module.css";
import { useAuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const HomePage = () => {
  const [userRole, setUserRole] = useState("");
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthContext();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    const role = localStorage.getItem("role");
    setUserRole(role);
  }, []);

  const goToemi = () => {
    navigate("/emi");
  };

  const userOptions = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Apply for Loan", path: "/loan" },
    { name: "Calculate EMI", path: "/emi" },
    { name: "Profile", path: "/profile" },
  ];

  const investorOptions = [
    { name: "Portfolio", path: "/portfolio" },
    { name: "Investment Opportunity", path: "/make-investment" },
    { name: "Earnings & Repayments", path: "/earnings-repayment" },
    { name: "View Report", path: "/report" },
    { name: "Profile", path: "/profile" },
  ];

  const options = userRole === "investor" ? investorOptions : userOptions;

  const userRules = [
    "Ensure all personal details are updated.",
    "Apply for loans responsibly and review terms.",
    "Make timely repayments to maintain credit score.",
  ];

  const investorRules = [
    "Review investment opportunities carefully.",
    "Diversify investments to manage risk.",
    "Monitor earnings and repayment schedules.",
    "Review reports to track performance.",
    "Ensure all personal details are updated.",
  ];

  const rules = userRole === "investor" ? investorRules : userRules;

  return (
    <div className={styles.container}>
      <div className={styles.right}>
        <div className={styles.optionsContainer}>
          {options.map((option, index) => (
            <div
              key={index}
              className={styles.optionButton}
              onClick={() => navigate(option.path)}
            >
              {option.name}
            </div>
          ))}
        </div>
      </div>
      {/* Left Side */}
      {/* <div className={styles.left}>
        <div className={styles.box}>
          <h2 className={styles.h2}>Instructions</h2>
          <ul className={styles.instructionsList}>
            {rules.map((rule, index) => (
              <li key={index}>{rule}</li>
            ))}
          </ul>
        </div>
      </div> */}
    </div>
  );
};

export default HomePage;
