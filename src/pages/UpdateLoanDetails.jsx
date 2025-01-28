import React, { useState, useContext } from "react";
import { LoanContext } from "../context/LoanContext";
import apiRequest from "../components/common/authApi";
import styles from "../Styles/LoanForm.module.css";

const UpdateLoanDetails = () => {
  const { loanData, updateLoanData } = useContext(LoanContext);
  const [amount, setAmount] = useState(loanData.amount || "");
  const [interestRate, setInterestRate] = useState(loanData.interest_rate || "");
  const [startDate, setStartDate] = useState(loanData.start_date || "");
  const [frequency, setFrequency] = useState(loanData.repayment_schedule || "");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async () => {
    if (!amount || !interestRate || !startDate || !frequency) {
      setError("All fields are required.");
      return;
    }

    if (!loanData.loan_id) {
      setError("Loan ID is missing. Cannot update loan details.");
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

      alert("Loan details updated successfully!");
      updateLoanData({
        ...loanData,
        amount,
        interest_rate: interestRate,
        start_date: startDate,
        repayment_schedule: frequency,
      });
    } catch (err) {
      setError("Failed to update loan details. Try again.");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Update Loan Details</h2>

      {error && <div className={styles.error}>{error}</div>}

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
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
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={styles.input}
            />
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

          <button
            onClick={handleUpdate}
            className={styles.buttonSave}
          >
            Update Loan
          </button>
        </div>
      )}
    </div>
  );
};

export default UpdateLoanDetails;
