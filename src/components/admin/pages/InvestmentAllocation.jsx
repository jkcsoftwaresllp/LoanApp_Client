import React, { useState, useEffect } from "react";
import styles from "./style/InvestmentAllocation.module.css";

const InvestmentAllocation = () => {
  const [loans, setLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [availableFunds, setAvailableFunds] = useState(1000000);

  const fetchLoans = async () => {
    const fakeData = [
      {
        loan_id: 201,
        borrower_name: "John Doe",
        amount: 50000,
        required_investment: 50000
      },
      {
        loan_id: 202,
        borrower_name: "Jane Smith",
        amount: 75000,
        required_investment: 75000
      }
    ];
    setLoans(fakeData);
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleAllocateFunds = async (loanId, amount) => {
    console.log(`POST /api/admin/allocate-funds - ${loanId} amount: ${amount}`);
    setAvailableFunds(prev => prev - amount);
    fetchLoans();
  };

  const handleViewDetails = (loan) => {
    setSelectedLoan(loan);
    setIsModalVisible(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.fundsInfo}>
        Available Funds: ${availableFunds.toLocaleString()}
      </div>

      <table className={styles.allocationTable}>
        <thead>
          <tr>
            <th>Loan ID</th>
            <th>Borrower Name</th>
            <th>Amount</th>
            <th>Required Investment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loans.map((loan) => (
            <tr key={loan.loan_id}>
              <td>{loan.loan_id}</td>
              <td>{loan.borrower_name}</td>
              <td>${loan.amount.toLocaleString()}</td>
              <td>${loan.required_investment.toLocaleString()}</td>
              <td>
                <button
                  className={styles.allocateButton}
                  onClick={() => handleAllocateFunds(loan.loan_id, loan.required_investment)}
                >
                  Allocate Funds
                </button>
                <button
                  className={styles.detailsButton}
                  onClick={() => handleViewDetails(loan)}
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalVisible && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <h3>Loan #{selectedLoan.loan_id} Details</h3>
            <p>Borrower: {selectedLoan.borrower_name}</p>
            <p>Total Amount: ${selectedLoan.amount.toLocaleString()}</p>
            <p>Required Investment: ${selectedLoan.required_investment.toLocaleString()}</p>
            <div className={styles.fundMatching}>
              <h4>Fund Matching:</h4>
              <p>Available Funds: ${availableFunds.toLocaleString()}</p>
              <button
                className={styles.allocateButton}
                onClick={() => handleAllocateFunds(selectedLoan.loan_id, selectedLoan.required_investment)}
              >
                Allocate Funds
              </button>
            </div>
            <button
              className={styles.closeButton}
              onClick={() => setIsModalVisible(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestmentAllocation;