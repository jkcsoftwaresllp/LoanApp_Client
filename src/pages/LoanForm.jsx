import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LoanContext } from "../context/LoanContext";
import apiRequest from "../components/common/authApi";
import styles from "../Styles/LoanForm.module.css";
import { showToast } from "../utils/toastUtils";
import { Loader } from "../components/common/Loader";
import { CalendarIcon, Drafticon } from "../components/common/assets";
import Btn from "../components/common/Btn";
import { API_BASE_URL } from "../config";

const LoanForm = () => {
  const navigate = useNavigate();
  const { updateLoanData } = useContext(LoanContext);
  const [amount, setAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [frequency, setFrequency] = useState("Yearly");
  const frequencyOptions = ["weekly", "monthly", "yearly"];

  const handleSaveDraft = async () => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      showToast("error", "Access token not found. Please log in.");
      navigate("/login");
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      showToast("error", "Please enter a valid loan amount.");
      return;
    }

    const parsedInterestRate = parseFloat(interestRate);
    if (isNaN(parsedInterestRate) || parsedInterestRate <= 0) {
      showToast("error", "Please enter a valid interest rate.");
      return;
    }

    try {
      const response = await apiRequest(
        "POST",
        `${API_BASE_URL}auth/save-draft`,
        {
          amount: parsedAmount,
          start_date: startDate,
          frequency,
          interest_rate: parsedInterestRate,
        },
        accessToken,
        setLoading
      );

      console.log("API Response:", response); // Debug the API response

      if (response && response.data && response.data.loan_id) {
        updateLoanData({
          loan_id: response.data.loan_id,
          amount: parsedAmount,
          repayment_schedule: frequency,
          interest_rate: parsedInterestRate,
        });
        showToast("success", "Loan draft saved successfully!");
      } else {
        setError("Failed to save draft. Loan ID is missing in the response.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Loan Form</h2>

      {error && <div className={styles.error}>{error}</div>}

      {loading ? (
        <div className={styles.center}>
          <Loader />
        </div>
      ) : (
        <>
          <div className={styles.inputField}>
            <label className={styles.llabel}>Amount</label>
            <div className={styles.inputWrapper}>
              <span className={styles.icon}>₹</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={styles.input}
              />
            </div>
          </div>
          <div className={styles.inputField}>
            <label className={styles.llabel}>Frequency</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className={styles.input}
            >
              {frequencyOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.inputRow}>
            <div className={styles.inputField}>
              <label className={styles.llabel}>Start Date</label>
              <div className={styles.inputWrapper}>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={styles.input}
                />
                <span className={styles.icon}>
                  <CalendarIcon />
                </span>
              </div>
            </div>

            <div className={styles.inputField}>
              <label className={styles.llabel}>Interest</label>
              <div className={styles.inputWrapper}>
                <input
                  type="number"
                  value={interestRate}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (value >= 1 && value <= 30) {
                      setInterestRate(value);
                    }
                  }}
                  className={styles.input}
                  min="1"
                  max="30"
                />
                <span className={styles.icon}>%</span>
              </div>
            </div>
          </div>

          <div className={styles.buttonContainer}>
            <Btn
              label="Save Draft"
              onClick={handleSaveDraft}
              icon={<Drafticon />}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default LoanForm;
