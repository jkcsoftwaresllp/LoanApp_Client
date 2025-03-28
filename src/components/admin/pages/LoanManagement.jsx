import React, { useState, useEffect } from "react";
import styles from "./style/LoanManagement.module.css";
import { Button } from "../../common/Button";
import { IconBtn } from "../../common/IconBtn";
import { EyeIcon } from "../../common/assets";
import { API_BASE_URL } from "../../../config";

const LoanManagement = () => {
  const [loans, setLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [actionStatus, setActionStatus] = useState("");

  const fetchLoans = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("No access token found");
        return;
      }

      const response = await fetch(`${API_BASE_URL}auth/oppr`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          console.error("Unauthorized: Please login again");
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("API Response:", result);
      // Access the data array from the response
      setLoans(Array.isArray(result.data) ? result.data : []);
    } catch (error) {
      console.error("Error fetching loans:", error.message);
      setLoans([]); // Set loans to empty array in case of error
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleViewDetails = (loan) => {
    setSelectedLoan(loan);
    setIsModalVisible(true);
  };

  const handleApproveReject = async (loanId, status) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("No access token found");
        return;
      }

      const response = await fetch(`${API_BASE_URL}auth/admin-update-status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          loan_id: loanId.toString(), // Ensure loan_id is string
          status: status.toLowerCase() // Ensure consistent case
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();
      console.log("Status update response:", result);
      fetchLoans(); // Refresh the loan list
    } catch (error) {
      console.error("Error updating loan status:", error.message);
      // Add user-friendly error notification here if needed
    }
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
              {loans.length > 0 ? (
                loans.map((loan) => (
                  <TableRow
                    key={loan.loan_id}
                    loan={loan}
                    handleViewDetails={handleViewDetails}
                    handleApproveReject={handleApproveReject}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No new loan is applied
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalVisible && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <h3>Loan Application #{selectedLoan.loan_id}</h3>
            <p>Borrower: {selectedLoan.borrower_name}</p>
            <p>Amount: ₹{selectedLoan.amount.toLocaleString()}</p>
            <p>Status: {selectedLoan.status}</p>
            <div className={styles.documents}>
              <p>
                <b>Attached Documents:</b>
              </p>
              {Array.isArray(selectedLoan.documents) ? (
                selectedLoan.documents.map((doc, index) => (
                  <div key={index} className={styles.documentItem}>
                    {doc}
                    <IconBtn icon={<EyeIcon />} />
                  </div>
                ))
              ) : (
                <p>No documents available</p>
              )}
            </div>
            <Button text="Close" onClick={() => setIsModalVisible(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanManagement;

const TableRow = React.memo(
  ({ loan, handleViewDetails, handleApproveReject }) => (
    <tr key={loan.loan_id} className={styles.row}>
      <td className="py-2 px-4 text-center">{loan.loan_id}</td>
      <td className="py-2 px-4 text-left">{loan.borrower_name}</td>
      <td className="py-2 px-4 text-left">₹{loan.amount.toLocaleString()}</td>
      <td className="py-2 px-4 text-left">{loan.status}</td>
      <td className={styles.action}>
        <Button text="View" onClick={() => handleViewDetails(loan)} />
        {loan.status === "Pending" && (
          <>
            <Button
              text="Approve"
              onClick={() => handleApproveReject(loan.loan_id, "approved")}
            />
            <Button
              text="Reject"
              onClick={() => handleApproveReject(loan.loan_id, "rejected")}
            />
          </>
        )}
      </td>
    </tr>
  )
);
