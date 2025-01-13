// src/context/LoanContext.js
import React, { createContext, useState } from "react";

export const LoanContext = createContext();

export const LoanProvider = ({ children }) => {
  const [loanData, setLoanData] = useState({
    amount: 0,
    repayment_schedule: "",
    interest_rate: 0,
    loan_id: null,
  });

  return (
    <LoanContext.Provider value={{ loanData, setLoanData }}>
      {children}
    </LoanContext.Provider>
  );
};
