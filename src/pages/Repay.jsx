import React, { useEffect, useState } from "react";
import styles from "./style/Repay.module.css";
import { Button } from "../components/common/Button";
import { IconBtn } from "../components/common/IconBtn";
import { Infoicon } from "../components/common/assets";
import { Loader } from "../components/common/Loader";
import { showToast } from "../utils/toastUtils";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

const RepaymentSchedule = () => {
  const [loans, setLoans] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [selectedRepayment, setSelectedRepayment] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          showToast("error", "Please log in.");
          throw new Error("Access token is missing. Please log in.");
        }

        const response = await fetch(`${API_BASE_URL}auth/repayment-schedule`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

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

  const fetchRepaymentSchedule = async (loanId) => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE_URL}auth/repayment-schedule`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        // Find the specific loan's repayment schedule
        const loanSchedule = data.data.find((loan) => loan.loan_id === loanId);

        if (loanSchedule) {
          setSchedule(loanSchedule.repayment_schedule);
          setSelectedLoan(loanId);
        } else {
          showToast("error", "No repayment schedule found for this loan");
        }
      } else {
        showToast(
          "error",
          data.message || "Failed to fetch repayment schedule"
        );
      }
    } catch (err) {
      console.error("Error fetching repayment schedule:", err);
      showToast("error", "Failed to fetch repayment schedule");
    } finally {
      setLoading(false);
    }
  };
  const showRepaymentDetails = (repayment) => {
    setSelectedRepayment(repayment);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedRepayment(null);
  };

  // Update the table rendering to match the API data structure
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Loan Repayments</h1>

      {!selectedLoan ? (
        <>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className="py-2 px-4 text-center">S.No</th>
                  <th className="py-2 px-4 text-center">Loan ID</th>

                  <th className="py-2 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {loans.map((loan, index) => (
                  <tr key={loan.loan_id}>
                    <td className="py-2 px-4 text-center">{index + 1}</td>
                    <td className="py-2 px-4 text-center">{loan.loan_id}</td>

                    <td className="py-2 px-4 text-left">
                      <Button
                        onClick={() => fetchRepaymentSchedule(loan.loan_id)}
                        text="View"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Button
            onClick={() => navigate("/loan-list")}
            text="View All Loans"
            className={styles.viewAllButton}
          />
        </>
      ) : (
        <>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className="py-2 px-4 text-center">S.No</th>
                  <th className="py-2 px-4 text-center">Due Date</th>
                  <th className="py-2 px-4 text-center">EMI Amount</th>
                  <th className="py-2 px-4 text-center">Status</th>
                  <th className="py-2 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((repayment, index) => (
                  <tr key={`${selectedLoan}-${index}`}>
                    <td className="py-2 px-4 text-center">{index + 1}</td>
                    <td className="py-2 px-4 text-center">{repayment.date}</td>
                    <td className="py-2 px-4 text-center">
                      ₹{repayment.amount}
                    </td>
                    <td className="py-2 px-4 text-center">
                      {repayment.status}
                    </td>
                    <td className={styles.btnContainer}>
                      {repayment.status === "Pending" && (
                        <>
                          <Button text="Pay" />
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
              <strong>Due Date:</strong> {selectedRepayment.date}
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
