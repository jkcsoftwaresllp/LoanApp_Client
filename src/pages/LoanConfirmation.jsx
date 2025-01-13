// src/pages/LoanConfirmation.js
import React, { useContext, useEffect, useState } from "react";
import { LoanContext } from "../context/LoanContext";
import loanService from "../services/loanService";
import { useNavigate } from "react-router-dom";

const LoanConfirmation = () => {
  const { loanData } = useContext(LoanContext); // Assuming you have loan data in context
  const [loanDetails, setLoanDetails] = useState(null);
  const [totalRepayment, setTotalRepayment] = useState(0);
  const navigate = useNavigate();

  // Fetch loan details using loan ID
  useEffect(() => {
    const fetchLoanDetails = async () => {
      try {
        if (loanData.loan_id) {
          const response = await loanService.getLoanDetails(loanData.loan_id);
          setLoanDetails(response.loanDetails);
          setTotalRepayment(response.loanDetails.total_repayment);
        }
      } catch (error) {
        console.error("Error fetching loan details", error);
      }
    };

    fetchLoanDetails();
  }, [loanData.loan_id]);

  const handleSubmit = async () => {
    try {
      const response = await loanService.submitLoan(loanData.loan_id);
      if (response.status === "success") {
        navigate("/profile"); // Redirect to the profile/dashboard page
      }
    } catch (error) {
      console.error("Error submitting loan", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Loan Confirmation</h1>

      {loanDetails ? (
        <div className="mb-4">
          <p><strong>Loan Amount:</strong> ${loanDetails.amount}</p>
          <p><strong>Repayment Schedule:</strong> {loanDetails.repayment_schedule}</p>
          <p><strong>Interest Rate:</strong> {loanDetails.interest_rate}%</p>
          <p><strong>Total Repayment:</strong> ${totalRepayment.toFixed(2)}</p>
        </div>
      ) : (
        <p>Loading loan details...</p>
      )}

      <div className="flex justify-between">
        <button
          onClick={() => navigate("/loan")}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Go Back
        </button>
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Submit Loan
        </button>
      </div>
    </div>
  );
};

export default LoanConfirmation;
