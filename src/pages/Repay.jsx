import React, { useEffect, useState } from "react";
import styles from "./style/Repay.module.css";
import { Button } from "../components/common/Button";
import { IconBtn } from "../components/common/IconBtn";
import { Infoicon } from "../components/common/assets";
import { Loader } from "../components/common/Loader";
import { showToast } from "../utils/toastUtils";

const RepaymentSchedule = () => {
  const [loans, setLoans] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [selectedRepayment, setSelectedRepayment] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          showToast("error", "Please log in.");
          throw new Error("Access token is missing. Please log in.");
        }

        const response = await fetch(
          "http://localhost:5000/api/auth/getAllLoansForUser",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        // Check if data exists and handle the response structure
        if (response.ok) {
          // If data is directly an array
          if (Array.isArray(data)) {
            setLoans(data);
          }
          // If data is nested in a property
          else if (data.data && Array.isArray(data.data)) {
            setLoans(data.data);
          }
          // If no loans found, set empty array
          else {
            setLoans([]);
          }
        } else {
          setLoans([]);
          showToast("error", data.message || "Failed to fetch loans");
        }
      } catch (err) {
        setError(err.message || "Failed to fetch loans. Please try again.");
        showToast("error", "Failed to fetch loans. Please try again.");
        setLoans([]); // Ensure loans is always an array even on error
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, []);

  const fetchRepaymentSchedule = (loanId) => {
    setLoading(true);
    setTimeout(() => {
      const fakeSchedule = [
        {
          due_date: "2024-02-15",
          amount: 4442.44,
          status: "Paid",
          loan_id: loanId,
        },
        {
          due_date: "2024-03-15",
          amount: 4442.44,
          status: "Pending",
          loan_id: loanId,
        },
        {
          due_date: "2024-04-15",
          amount: 4442.44,
          status: "Pending",
          loan_id: loanId,
        },
        {
          due_date: "2024-05-15",
          amount: 4442.44,
          status: "Pending",
          loan_id: loanId,
        },
        {
          due_date: "2024-06-15",
          amount: 4442.44,
          status: "Pending",
          loan_id: loanId,
        },
        {
          due_date: "2024-07-15",
          amount: 4442.44,
          status: "Pending",
          loan_id: loanId,
        },
      ];
      setSchedule(fakeSchedule);
      setSelectedLoan(loanId);
      setLoading(false);
    }, 800);
  };

  // Show repayment details in modal
  const showRepaymentDetails = (repayment) => {
    setSelectedRepayment(repayment);
    setModalOpen(true);
  };

  // Handle payment
  const handlePayment = async (repaymentId) => {
    alert(`Processing payment for repayment ID: ${repaymentId}`);
  };

  // Close modal
  const closeModal = () => {
    setSelectedRepayment(null);
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
      <h1 className={styles.title}>Loan Repayments</h1>

      {!selectedLoan ? (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Loan ID</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Tenure (months)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loans
                .filter(loan => loan.status === "Approved")
                .map((loan) => (
                  <tr key={loan.loan_id}>
                    <td>{loan.loan_id}</td>
                    <td>₹{loan.amount}</td>
                    <td>{loan.status}</td>
                    <td>{loan.tenure}</td>
                    <td>
                      <Button
                        onClick={() => fetchRepaymentSchedule(loan.loan_id)}
                        text="View"
                      />
                    </td>
                  </tr>
              ))}
            </tbody>
          </table>
          {loans.filter(loan => loan.status === "Approved").length === 0 && (
            <div className={styles.noLoans}>No approved loans found for repayment</div>
          )}
        </div>
      ) : (
        <>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Due Date</th>
                  <th>EMI Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((repayment) => (
                  <tr key={repayment.due_date}>
                    <td>{repayment.due_date}</td>
                    <td>{repayment.amount}</td>
                    <td>{repayment.status}</td>
                    <td className={styles.btnContainer}>
                      {repayment.status === "Pending" && (
                        <>
                          <Button
                            onClick={() => handlePayment(repayment.due_date)}
                            text="Pay"
                          />
                          <IconBtn
                            icon={<Infoicon />}
                            onClick={() => showRepaymentDetails(repayment)}
                          />
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Button
            onClick={() => setSelectedLoan(null)}
            text="Back to Loans"
            className={styles.backButton}
          />
        </>
      )}

      {/* Modal remains unchanged */}
      {modalOpen && selectedRepayment && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Repayment Details</h2>
            <p>
              <strong>Due Date:</strong> {selectedRepayment.due_date}
            </p>
            <p>
              <strong>Amount:</strong> {selectedRepayment.amount}
            </p>
            <p>
              <strong>Status:</strong> {selectedRepayment.status}
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

export default RepaymentSchedule;
