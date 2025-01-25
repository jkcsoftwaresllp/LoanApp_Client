import React, { useEffect, useState, useContext } from "react";
import { LoanContext } from "../context/LoanContext";
import apiRequest from "../components/common/authApi";
import styles from "../Styles/LoanForm.module.css";
import SubmitLoan from "./SubmitLoan";

const LoanDetails = () => {
  const { loanData } = useContext(LoanContext);
  const [loanDetails, setLoanDetails] = useState(null);
  const [loan, setLoan] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchLoanDetails = async () => {
      const accessToken = localStorage.getItem("accessToken");

      if (!loanData.loan_id) {
        setError("Loan ID is missing. Cannot fetch loan details.");
        return;
      }

      try {
        const response = await apiRequest(
          "GET",
          `http://localhost:5000/api/auth/ld/${loanData.loan_id}`,
          null,
          accessToken,
          setIsLoading
        );

        setLoanDetails(response.loanDetails);
        setLoan(response.loan);
      } catch (err) {
        setError(err.message || "Error fetching loan details.");
      }
    };

    fetchLoanDetails();
  }, [loanData.loan_id]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Confirmation Page</h2>

      {error && <div className={styles.error}>{error}</div>}

      {isLoading ? (
        <div>Loading...</div>
      ) : loanDetails && loan ? (
        <>
          <div className={styles.inputField}>
            <h4 className="text-lg font-semibold">Loan Information</h4>
            <p><strong>Loan ID:</strong> {loan.loan_id}</p>
            <p><strong>Amount:</strong> {loan.amount}</p>
            <p><strong>Status:</strong> {loan.status}</p>
          </div>

          <div className={styles.inputField}>
            <h4 className="text-lg font-semibold">Repayment Details</h4>
            <p><strong>Interest Rate:</strong> {loanDetails.interest_rate}</p>
            <p><strong>Total Repayment:</strong> {loanDetails.total_repayment}</p>
          </div>

          {loanDetails.repayment_schedule.length > 0 && (
            <div className={styles.inputField}>
              <h4 className="text-lg font-semibold">Repayment Schedule</h4>
              <ul className="list-disc pl-6">
                <li className="mb-2">
                  <strong>Date:</strong> {new Date(loanDetails.repayment_schedule[0].date).toLocaleDateString()}
                  <br />
                  <strong>Amount:</strong> {loanDetails.repayment_schedule[0].amount}
                </li>
              </ul>
            </div>
          )}
        </>
      ) : (
        <p>No loan details available.</p>
      )}

      <div className={styles.submitLoanContainer}>
        <SubmitLoan />
      </div>
    </div>
  );
};

export default LoanDetails;
