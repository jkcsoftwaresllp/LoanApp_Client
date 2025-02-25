import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./style/Home.module.css";

const Home = () => {
  const [userRole, setUserRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    setUserRole(role);
  }, []);

  const userOptions = [
    { name: "Apply for Loan", path: "/apply-loan" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Profile", path: "/profile" },
  ];

  const investorOptions = [
    { name: "Portfolio", path: "/portfolio" },
    { name: "Earnings", path: "/earnings" },
    { name: "Repayments", path: "/repayments" },
    { name: "View Report", path: "/view-report" },
    { name: "Investment Opportunity", path: "/investment-opportunity" },
    { name: "Profile", path: "/profile" },
  ];

  const options = userRole === "investor" ? investorOptions : userOptions;

  return (
    <div className={styles.home}>
      <h1>Welcome to Home Page</h1>
      <div className={styles.optionsContainer}>
        {options.map((option, index) => (
          <button
            key={index}
            className={styles.optionButton}
            onClick={() => navigate(option.path)}
          >
            {option.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Home;
