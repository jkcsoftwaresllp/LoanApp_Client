import React, { useState, useContext } from "react";
import { LoanContext } from "../context/LoanContext";
import apiRequest from "../components/common/authApi";
import styles from "../Styles/LoanForm.module.css";
import { Loader } from "../components/common/Loader";
import { showToast } from "../utils/toastUtils";
import { Button } from "../components/common/Button";
import { CalendarIcon } from "../components/common/assets";
import Btn from "../components/common/Btn";
import { UpdateIcon } from "../components/common/assets";

const UpdateLoanDetails = () => {
  const { loanData, updateLoanData } = useContext(LoanContext);
  const [amount, setAmount] = useState(loanData.amount || "");
  const [interestRate, setInterestRate] = useState(
    loanData.interest_rate || ""
  );
  const [startDate, setStartDate] = useState(loanData.start_date || "");
  const [frequency, setFrequency] = useState(loanData.repayment_schedule || "");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async () => {
    if (!amount || !interestRate || !startDate || !frequency) {
      showToast("error", "All fields are required.");
      return;
    }

    if (!loanData.loan_id) {
      showToast("error", "Loan ID is missing. Cannot update loan details.");
      return;
    }

    const accessToken = localStorage.getItem("accessToken");

    try {
      const payload = {
        loan_id: loanData.loan_id,
        amount,
        interest_rate: interestRate,
        start_date: startDate,
        frequency,
      };

      await apiRequest(
        "POST",
        "http://localhost:5000/api/auth/update-loan-details",
        payload,
        accessToken,
        setIsLoading
      );

      showToast("success", "Loan details updated successfully.");
      updateLoanData({
        ...loanData,
        amount,
        interest_rate: interestRate,
        start_date: startDate,
        repayment_schedule: frequency,
      });
    } catch (err) {
      showToast("error", "Failed to update loan details. Try again.");
    }
  };

  return (
    <div className={styles.detailContainer}>
      <h2 className={styles.detailTitle}>Update Loan Details</h2>

      {error && <div className={styles.error}>{error}</div>}

      {isLoading ? (
        <div className={styles.center}>
          <Loader />
        </div>
      ) : (
        <div className={styles.body}>
          <div className={styles.inputField}>
            <label className={styles.label}>Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.inputField}>
            <label className={styles.label}>Interest Rate</label>
            <input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.inputField}>
            <label className={styles.label}>Start Date</label>
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
            <label className={styles.label}>Repayment Schedule</label>
            <input
              type="text"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className={styles.input}
            />
          </div>
          <div className={styles.update}>
            <Btn
              label="Update Loan"
              onClick={handleUpdate}
              icon={<UpdateIcon />}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateLoanDetails;
