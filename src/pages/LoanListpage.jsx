import React, { useEffect, useState } from "react";
import apiRequest from "../components/common/authApi";
import { Loader } from "../components/common/Loader";
import { showToast } from "../utils/toastUtils";
import styles from "../Styles/LoanListPage.module.css";
import { Infoicon } from "../components/common/assets";
import { IconBtn } from "../components/common/IconBtn";
import { Button } from "../components/common/Button"; // Assuming Button exists

const LoanListPage = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedLoan, setSelectedLoan] = useState(null); // Selected loan details
  const [modalOpen, setModalOpen] = useState(false); // Modal state

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          showToast("error", "Please log in.");
          throw new Error("Access token is missing. Please log in.");
        }

        const response = await apiRequest(
          "GET",
          "http://localhost:5000/api/auth/getAllLoansForUser",
          null,
          accessToken,
          setLoading
        );

        if (response.data && Array.isArray(response.data)) {
          setLoans(response.data);
        } else {
          setLoans([]);
        }
      } catch (err) {
        setError(err.message || "Failed to fetch loans. Please try again.");
        showToast("error", "Failed to fetch loans. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchLoans();
  }, []);

  // Function to fetch loan details dynamically
  const fetchLoanDetails = async (loanId) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await apiRequest(
        "GET",
        `http://localhost:5000/api/auth/loan/${loanId}`,
        null,
        accessToken
      );

      if (response.data) {
        setSelectedLoan(response.data);
        setModalOpen(true); // Open modal when data is ready
      } else {
        showToast("error", "Failed to fetch loan details.");
      }
    } catch (err) {
      console.error("Error fetching loan details:", err);
      showToast("error", "Failed to fetch loan details.");
    }
  };

  // Close modal function
  const closeModal = () => {
    setSelectedLoan(null);
    setModalOpen(false);
  };

  if (loading) {
    return (
      <div className={styles.center}>
        <Loader />
      </div>
    );
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Loan List</h1>
      {loans.length > 0 ? (
        <div className={styles.tableWrapper}>
          <div className={styles.tableContainer}>
            <table>
              <thead>
                <tr>
                  <th className="py-2 px-4 text-left">Loan ID</th>
                  <th className="py-2 px-4 text-left">Status</th>
                  <th className="py-2 px-4 text-left">Total Repayment</th>
                  <th className="py-2 px-4 text-left">Details</th>
                </tr>
              </thead>
              <tbody>
                {loans.map((loan) => (
                  <tr key={loan.loan_id} className={styles.row}>
                    <td className="py-2 px-4 text-left">{loan.loan_id}</td>
                    <td className="py-2 px-4 text-left">{loan.status}</td>
                    <td className="py-2 px-4 text-left">
                      {loan.total_repayment}
                    </td>
                    <td className="py-2 px-4">
                      <IconBtn
                        icon={<Infoicon />}
                        onClick={() => fetchLoanDetails(loan.loan_id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className={styles.noLoansContainer}>
          <img
            src="/images/notavi.webp"
            alt="No loans available"
            className={styles.noLoansImage}
          />
          <p className={styles.noLoansText}>
            No loans found. Please apply for a loan.
          </p>
        </div>
      )}

      {/* Loan Details Modal */}
      {modalOpen && selectedLoan && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Loan Details</h2>
            <p>
              <strong>Loan ID:</strong> {selectedLoan.loan_id}
            </p>
            <p>
              <strong>Borrower Name:</strong> {selectedLoan.borrower_name}
            </p>
            <p>
              <strong>Amount:</strong> {selectedLoan.amount}
            </p>
            <p>
              <strong>ROI:</strong> {selectedLoan.roi}
            </p>
            <p>
              <strong>Tenure:</strong> {selectedLoan.tenure}
            </p>
            <p>
              <strong>Status:</strong> {selectedLoan.status}
            </p>
            <div className={styles.modalActions}>
              <Button onClick={closeModal} text="Close" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanListPage;
