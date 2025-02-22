import React, { useEffect, useState } from "react";
import styles from "./style/OppPage.module.css";
import { Loader } from "../../common/Loader";
import { showToast } from "../../../utils/toastUtils";
import { Button } from "../../common/Button";

const InvestmentOpportunities = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

        const text = await response.text();

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Invalid JSON response from server");
        }

        const result = JSON.parse(text);
        console.log("Parsed JSON:", result);
        setLoans(result.data || []);
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

  const confirmInvestment = async (loan_id, amount) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ loan_id, amount }),
      });

      const result = await response.json();

      if (response.ok) {
        showToast("success", result.message);
      } else {
        throw new Error(result.message || "Failed to confirm investment");
      }
    } catch (err) {
      console.error("Error confirming investment:", err);
      showToast("error", err.message);
    }
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
      <h1 className={styles.title}>Investment Opportunities</h1>
      {loans.length > 0 ? (
        <div className={styles.tableContainer}>
          <table>
            <thead>
              <tr>
                <th>SNO</th>
                <th>Borrower Name</th>
                <th>Requested Amount</th>
                <th>ROI</th>
                <th>Tenure</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{loan.borrower_name}</td>
                  <td>{loan.amount}</td>
                  <td>{loan.roi}</td>
                  <td>{loan.tenure}</td>
                  <td>{loan.status}</td>
                  <td>
                    <div className={styles.actions}>
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
  );
};

export default InvestmentOpportunities;
