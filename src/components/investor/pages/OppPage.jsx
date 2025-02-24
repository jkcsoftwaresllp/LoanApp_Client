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

  const confirmInvestment = async (loanId, amount) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ loan_id: loanId, amount }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to confirm investment");
      }
      showToast("success", "Investment confirmed successfully");
    } catch (err) {
      console.error("Error confirming investment:", err);
      showToast("error", err.message);
    }
  };

  const applyFilters = () => {
    showToast("info", "Filters applied successfully");
    let filtered = loans.filter(
      (loan) =>
        (filters.amount ? loan.amount <= Number(filters.amount) : true) &&
        (filters.roi ? loan.roi >= Number(filters.roi) : true) &&
        (filters.tenure ? loan.tenure >= Number(filters.tenure) : true)
    );
    setFilteredLoans(filtered);
  };

  const clearFilters = () => {
    setFilters({ amount: "", roi: "", tenure: "" });
    setFilteredLoans(loans);
  };

  const openLoanDetails = (loan) => {
    setSelectedLoan(loan);
  };

  const closeLoanDetails = () => {
    setSelectedLoan(null);
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
        <div className={styles.filtersContainer}>
          <input
            type="number"
            placeholder="Max Requested Amount"
            value={filters.amount}
            onChange={(e) => setFilters({ ...filters, amount: e.target.value })}
            className={styles.filterInput}
          />
          <input
            type="number"
            placeholder="Min ROI"
            value={filters.roi}
            onChange={(e) => setFilters({ ...filters, roi: e.target.value })}
            className={styles.filterInput}
          />
          <input
            type="number"
            placeholder="Min Tenure"
            value={filters.tenure}
            onChange={(e) => setFilters({ ...filters, tenure: e.target.value })}
            className={styles.filterInput}
          />
          <div className={styles.btnsContainer}>
            <IconBtn onClick={applyFilters} icon={<CheckIcon />} />
            <IconBtn onClick={clearFilters} icon={<CloseIcon />} />
          </div>
        </div>
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
                          onClick={() =>
                            confirmInvestment(loan.loan_id, loan.amount)
                          }
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

      {selectedLoan && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Loan Details #{selectedLoan.loan_id}</h2>
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
            <Button onClick={closeLoanDetails} text="Close" />
          </div>
        </div>
      )}
    </>
  );
};

export default InvestmentOpportunities;
