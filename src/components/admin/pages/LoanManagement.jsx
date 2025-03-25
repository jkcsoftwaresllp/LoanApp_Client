import React, { useState, useEffect } from "react";
import styles from "./style/LoanManagement.module.css";
import { Button } from "../../common/Button";
import { IconBtn } from "../../common/IconBtn";
import { EyeIcon } from "../../common/assets";

const LoanManagement = () => {
  const [loans, setLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [actionStatus, setActionStatus] = useState("");

  const fetchLoans = async () => {
    const fakeData = [
      {
        loan_id: 101,
        borrower_name: "John Doe",
        amount: 5000,
        status: "pending",
        documents: ["doc1.pdf", "doc2.pdf"],
      },
      {
        loan_id: 102,
        borrower_name: "Jane Smith",
        amount: 10000,
        status: "approved",
        documents: ["doc3.pdf"],
      },
      {
        loan_id: 1101,
        borrower_name: "John Doe",
        amount: 5000,
        status: "pending",
        documents: ["doc1.pdf", "doc2.pdf"],
      },
      {
        loan_id: 1012,
        borrower_name: "Jane Smith",
        amount: 10000,
        status: "pending",
        documents: ["doc3.pdf"],
      },
    ];
    setLoans(fakeData);
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleViewDetails = (loan) => {
    setSelectedLoan(loan);
    setIsModalVisible(true);
  };

  const handleApproveReject = async (loanId, status) => {
    console.log(`POST /api/admin/approve-loan - ${loanId} status: ${status}`);
    fetchLoans(); // Refresh data
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Loan Management</h2>

      <div className={styles.tableWrapper}>
        <div className={styles.tableContainer}>
          <table>
            <thead>
              <tr>
                <th className="py-2 px-4 text-left">Loan ID</th>
                <th className="py-2 px-4 text-left">Borrower Name</th>
                <th className="py-2 px-4 text-left">Amount</th>
                <th className="py-2 px-4 text-left">Status</th>
                <th className="py-2 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => (
                <tr key={loan.loan_id} className={styles.row}>
                  <td className="py-2 px-4 text-center">{loan.loan_id}</td>
                  <td className="py-2 px-4 text-left">{loan.borrower_name}</td>
                  <td className="py-2 px-4 text-left">
                    ${loan.amount.toLocaleString()}
                  </td>
                  <td className="py-2 px-4 text-left">{loan.status}</td>
                  <td className={styles.action}>
                    <Button
                      text="View"
                      onClick={() => handleViewDetails(loan)}
                    />

                    {loan.status === "pending" && (
                      <>
                        <Button
                          text="Approve"
                          onClick={() =>
                            handleApproveReject(loan.loan_id, "approved")
                          }
                        />

                        <Button
                          text="Reject"
                          onClick={() =>
                            handleApproveReject(loan.loan_id, "rejected")
                          }
                        />
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalVisible && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <h3>Loan Application #{selectedLoan.loan_id}</h3>
            <p>Borrower: {selectedLoan.borrower_name}</p>
            <p>Amount: ${selectedLoan.amount.toLocaleString()}</p>
            <p>Status: {selectedLoan.status}</p>
            <div className={styles.documents}>
              <p>
                <b>Attached Documents:</b>
              </p>
              {selectedLoan.documents.map((doc, index) => (
                <div key={index} className={styles.documentItem}>
                  {doc}
                  <IconBtn icon={<EyeIcon />} />
                </div>
              ))}
            </div>
            <Button text="Close" onClick={() => setIsModalVisible(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanManagement;
