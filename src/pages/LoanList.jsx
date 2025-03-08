import React, { useEffect, useState } from "react";
import apiRequest from "../components/common/authApi";
import styles from "../Styles/LoanList.module.css";
import { Loader } from "../components/common/Loader";
import { showToast } from "../utils/toastUtils";

const LoanList = () => {
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

        // Ensure that response.data exists and is an array
        if (response.data && Array.isArray(response.data)) {
          setLoans(response.data);
        } else {
          setLoans([]); // In case the response data is not an array
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
        <div className={styles.tableContainer}>
          <table>
            <thead>
              <tr>
                <th className="py-2 px-4 text-left">Loan ID</th>
                <th className="py-2 px-4 text-left">Status</th>
                <th className="py-2 px-4 text-left">Total Repayment</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => (
                <tr key={loan.loan_id} className={styles.row}>
                  <td className="py-2 px-4">{loan.loan_id}</td>
                  <td className="py-2 px-4">{loan.status}</td>
                  <td className="py-2 px-4">{loan.total_repayment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center">
          <img
            src="/images/notavi.webp"
            alt="Loan details not available"
            className="w-48 h-48 mb-4"
          />
          <p className="text-black">
            No loans found for this user. Please apply for a loan.
          </p>
        </div>
      )}
    </div>
  );
};

export default LoanList;
