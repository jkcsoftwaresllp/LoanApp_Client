import React, { useState } from "react";
import styles from "./style/InterestFeeManagement.module.css";

const InterestFeeManagement = () => {
  const [interestRate, setInterestRate] = useState(5.0);
  const [lateFee, setLateFee] = useState(50);
  const [isSaving, setIsSaving] = useState(false);
  const [loanParametersHistory, setLoanParametersHistory] = useState([]);

  // Simulate fetching initial data
  const fetchInitialData = () => {
    const fakeData = {
      interest_rate: 5.0,
      late_fee: 50,
      last_updated: "2023-10-01T12:00:00Z",
      updated_by: "Admin"
    };
    setInterestRate(fakeData.interest_rate);
    setLateFee(fakeData.late_fee);
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleSaveChanges = async () => {
    if (interestRate < 0 || lateFee < 0) {
      alert("Please enter valid values");
      return;
    }

    setIsSaving(true);
    try {
      const updatedData = {
        interest_rate: interestRate,
        late_fee: lateFee,
        timestamp: new Date().toISOString()
      };
      
      console.log("PATCH /api/admin/update-loan-parameters", updatedData);
      
      // Simulate API response with more detailed data
      const response = { 
        status: "success", 
        message: "Loan parameters updated",
        updated_values: updatedData,
        history: [
          ...loanParametersHistory,
          {
            ...updatedData,
            updated_by: "Admin",
            effective_date: new Date().toISOString()
          }
        ]
      };
      
      console.log(response);
      setLoanParametersHistory(response.history);
      alert("Loan parameters updated successfully!");
    } catch (error) {
      console.error("Error updating parameters:", error);
      alert("Failed to update loan parameters");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Interest and Fee Management</h2>
      <div className={styles.form}>
        <div className={styles.formGroup}>
          <label>Interest Rate (%):</label>
          <input
            type="number"
            step="0.1"
            min="0"
            value={interestRate}
            onChange={(e) => setInterestRate(parseFloat(e.target.value))}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Late Fee ($):</label>
          <input
            type="number"
            min="0"
            value={lateFee}
            onChange={(e) => setLateFee(parseFloat(e.target.value))}
          />
        </div>

        <button
          className={styles.saveButton}
          onClick={handleSaveChanges}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default InterestFeeManagement;