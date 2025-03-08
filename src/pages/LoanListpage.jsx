import React, { useEffect, useState } from "react";
import apiRequest from "../components/common/authApi";
import { Loader } from "../components/common/Loader";
import { showToast } from "../utils/toastUtils";
import styles from "../Styles/LoanListPage.module.css";

const LoanListPage = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          showToast("error", " Please log in.");
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
        setError(
          err.message || "Failed to fetch loans. Please try again later."
        );
        showToast("error", "Failed to fetch loans. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchLoans();
  }, []);

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
                  <th>Loan ID</th>
                  <th>Status</th>
                  <th>Total Repayment</th>
                </tr>
              </thead>
              <tbody>
                {loans.map((loan) => (
                  <tr key={loan.loan_id} className={styles.row}>
                    <td>{loan.loan_id}</td>
                    <td>{loan.status}</td>
                    <td>{loan.total_repayment}</td>
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
    </div>
  );
};

export default LoanListPage;
