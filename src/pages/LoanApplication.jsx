// src/pages/LoanApplication.js
import React, { useState, useContext } from "react";
import { LoanContext } from "../context/LoanContext";
import ProgressBar from "../components/ProgressBar";
import loanService from "../services/loanService";
import { useNavigate } from "react-router-dom";

const LoanApplication = () => {
  const { loanData, setLoanData } = useContext(LoanContext);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleNext = async () => {
    if (step === 3) {
      // Save draft loan details
      await loanService.saveDraft(loanData);
    }
    setStep(step + 1);
  };

  const handlePrevious = () => setStep(step - 1);

  return (
    <div className="p-6 max-w-lg mx-auto">
      <ProgressBar step={step} />

      {step === 1 && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Step 1: Loan Amount</h2>
          <input
            type="number"
            value={loanData.amount}
            onChange={(e) => setLoanData({ ...loanData, amount: e.target.value })}
            className="w-full p-2 mt-2 border rounded"
          />
        </div>
      )}

      {step === 2 && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Step 2: Repayment Schedule</h2>
          <input
            type="text"
            value={loanData.repayment_schedule}
            onChange={(e) => setLoanData({ ...loanData, repayment_schedule: e.target.value })}
            className="w-full p-2 mt-2 border rounded"
          />
        </div>
      )}

      {step === 3 && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Step 3: Interest Rate</h2>
          <input
            type="number"
            value={loanData.interest_rate}
            onChange={(e) => setLoanData({ ...loanData, interest_rate: e.target.value })}
            className="w-full p-2 mt-2 border rounded"
          />
        </div>
      )}

      <div className="flex justify-between mt-6">
        <button
          disabled={step === 1}
          onClick={handlePrevious}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {step === 3 ? "Go to Confirmation" : "Next"}
        </button>
      </div>
    </div>
  );
};

export default LoanApplication;
