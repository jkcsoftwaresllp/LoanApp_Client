import React, { useState, useEffect } from "react";
import styles from "./style/InvestmentAllocation.module.css";
import { Button } from "../../common/Button";
import { IconBtn } from "../../common/IconBtn";
import { Loader } from "../../common/Loader";
import { Infoicon, CancelIcon } from "../../common/assets";
import { showToast } from "../../../utils/toastUtils";

const InvestmentAllocation = () => {
  const [loans, setLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [availableFunds, setAvailableFunds] = useState(1000000);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  const fetchLoans = async () => {
    try {
      const fakeData = [
        {
          loan_id: 201,
          borrower_name: "John Doe",
          amount: 50000,
          required_investment: 50000,
        },
        {
          loan_id: 202,
          borrower_name: "Jane Smith",
          amount: 75000,
          required_investment: 75000,
        },
        {
          loan_id: 1201,
          borrower_name: "John Doe",
          amount: 50000,
          required_investment: 50000,
        },
        {
          loan_id: 2102,
          borrower_name: "Jane Smith",
          amount: 75000,
          required_investment: 75000,
        },
        {
          loan_id: 2011,
          borrower_name: "John Doe",
          amount: 50000,
          required_investment: 50000,
        },
        {
          loan_id: 2022,
          borrower_name: "Jane Smith",
          amount: 75000,
          required_investment: 75000,
        },
      ];
      setLoans(fakeData);
    } catch (error) {
      showToast("error", "Failed to fetch loans");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleAllocateFunds = async (loanId, amount) => {
    if (availableFunds < amount) {
      showToast("warning", "Amount is insufficient");
      return;
    }

    console.log(`POST /api/admin/allocate-funds - ${loanId} amount: ${amount}`);
    setAvailableFunds((prev) => Math.max(0, prev - amount)); // Prevent negative values
    fetchLoans();
  };

  const handleViewDetails = (loan) => {
    setSelectedLoan(loan);
    setIsModalVisible(true);
  };

  if (isLoading) {
    return (
      <div className={styles.center}>
        <Loader />
      </div>
    );
  }
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Investment Allocation</h2>
      <div className={styles.fundsInfo}>
        Available Funds: ₹{availableFunds.toLocaleString()}
      </div>

      <div className={styles.tableWrapper}>
        <div className={styles.tableContainer}>
          <table className={styles.allocationTable}>
            <thead>
              <tr>
                <th className="py-2 px-4 text-left">Loan ID</th>
                <th className="py-2 px-4 text-left">Borrower Name</th>
                <th className="py-2 px-4 text-left">Amount</th>
                <th className="py-2 px-4 text-center">Required Investment</th>
                <th className="py-2 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => (
                <TableRow
                  key={loan.loan_id}
                  loan={loan}
                  handleAllocateFunds={handleAllocateFunds}
                  handleViewDetails={handleViewDetails}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalVisible && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <h3>Loan #{selectedLoan.loan_id} Details</h3>
            <p>Borrower: {selectedLoan.borrower_name}</p>
            <p>Total Amount: ₹{selectedLoan.amount.toLocaleString()}</p>
            <p>
              Required Investment: ₹
              {selectedLoan.required_investment.toLocaleString()}
            </p>
            <div className={styles.fundMatching}>
              <h4 className={styles.fundH}>Fund Matching:</h4>
              <p>Available Funds:₹ {availableFunds.toLocaleString()}</p>
            </div>
            <div className={styles.buttonContainer}>
              <Button
                text="Allocate"
                onClick={() =>
                  handleAllocateFunds(
                    selectedLoan.loan_id,
                    selectedLoan.required_investment
                  )
                }
              />
              <IconBtn
                icon={CancelIcon}
                onClick={() => setIsModalVisible(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestmentAllocation;

const TableRow = React.memo(
  ({ loan, handleAllocateFunds, handleViewDetails }) => (
    <tr key={loan.loan_id} className={styles.row}>
      <td className="py-2 px-4 text-left">{loan.loan_id}</td>
      <td className="py-2 px-4 text-left">{loan.borrower_name}</td>
      <td className="py-2 px-4 text-left">₹{loan.amount.toLocaleString()}</td>
      <td className="py-2 px-4 text-center">
        ₹{loan.required_investment.toLocaleString()}
      </td>
      <td className={styles.action}>
        <div className={styles.buttonContainer}>
          <Button
            text="Allocate"
            onClick={() =>
              handleAllocateFunds(loan.loan_id, loan.required_investment)
            }
          />
          <IconBtn icon={Infoicon} onClick={() => handleViewDetails(loan)} />
        </div>
      </td>
    </tr>
  )
);
