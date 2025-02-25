import React, { useEffect, useState } from "react";
import styles from "./style/OppPage.module.css";
import { Loader } from "../../common/Loader";
import { showToast } from "../../../utils/toastUtils";
import { Button } from "../../common/Button";
import { IconBtn } from "../../common/IconBtn";
import { CloseIcon, CheckIcon, Infoicon } from "../../common/assets";

const InvestmentOpportunities = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [confirmModal, setConfirmModal] = useState(false);
  const [filters, setFilters] = useState({ amount: "", roi: "", tenure: "" });
  const [filteredLoans, setFilteredLoans] = useState([]);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/oppr", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch loans");
        }
        setLoans(result.data || []);
        setFilteredLoans(result.data || []);
      } catch (err) {
        console.error("Error fetching loans:", err);
        setError(err.message);
        showToast("error", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, []);

  const confirmInvestment = async () => {
    if (!selectedLoan) return;
    try {
      const response = await fetch("http://localhost:5000/api/auth/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          investor_id: "1", // Replace with actual investor ID
          loan_id: selectedLoan.loan_id,
          amount: selectedLoan.amount,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to confirm investment");
      }
      showToast("success", "Investment confirmed successfully");
      closeModals();
    } catch (err) {
      console.error("Error confirming investment:", err);
      showToast("error", err.message);
    }
  };

  const openLoanDetails = (loan) => {
    setSelectedLoan(loan);
  };

  const openConfirmModal = (loan) => {
    setSelectedLoan(loan);
    setConfirmModal(true);
  };

  const closeModals = () => {
    setSelectedLoan(null);
    setConfirmModal(false);
  };

  if (loading) {
    return (
      <div className={styles.center}>
        <Loader />
      </div>
    );
  }

  return (
    <>
      <div className={styles.header}>
        <h1>Investment Opportunities</h1>
      </div>
      <div className={styles.container}>
        {filteredLoans.length > 0 ? (
          <div className={styles.tableContainer}>
            <table>
              <thead>
                <tr>
                  <th className="py-2 px-4 text-center">SNO</th>
                  <th className="py-2 px-4 text-center">Borrower Name</th>
                  <th className="py-2 px-4 text-center">Requested Amount</th>
                  <th className="py-2 px-4 text-center">ROI</th>
                  <th className="py-2 px-4 text-center">Tenure</th>
                  <th className="py-2 px-4 text-center">Status</th>
                  <th className="py-2 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLoans.map((loan, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 text-center">{index + 1}</td>
                    <td className="py-2 px-4 text-center">
                      {loan.borrower_name}
                    </td>
                    <td className="py-2 px-4 text-center">{loan.amount}</td>
                    <td className="py-2 px-4 text-center">{loan.roi}</td>
                    <td className="py-2 px-4 text-center">{loan.tenure}</td>
                    <td className="py-2 px-4 text-center">{loan.status}</td>
                    <td className="py-2 px-4 text-center">
                      <div className={styles.actions}>
                        <IconBtn
                          onClick={() => openLoanDetails(loan)}
                          icon={<Infoicon />}
                        />
                        <Button
                          onClick={() => openConfirmModal(loan)}
                          text="Invest"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No investment opportunities available.</p>
        )}
      </div>

      {selectedLoan && !confirmModal && (
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
              <Button
                onClick={() => openConfirmModal(selectedLoan)}
                text="Invest"
              />
              <Button onClick={closeModals} text="Close" />
            </div>
          </div>
        </div>
      )}

      {confirmModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Confirm Investment</h2>
            <p>
              <strong>Loan ID:</strong> {selectedLoan.loan_id}
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
            <div className={styles.modalActions}>
              <Button onClick={confirmInvestment} text="Confirm" />
              <Button onClick={closeModals} text="Cancel" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InvestmentOpportunities;
