import React, { useState, useEffect } from "react";
import styles from "./style/InterestFeeManagement.module.css";
import { Button } from "../../common/Button";
import { API_BASE_URL } from "../../../config";
import { Loader } from "../../common/Loader";

const frequencyOptions = ["weekly", "monthly", "quarterly", "yearly"];

const InterestFeeManagement = () => {
  const [selectedFrequency, setSelectedFrequency] = useState(frequencyOptions[0]);
  const [interestRates, setInterestRates] = useState({
    weekly: 0,
    monthly: 0,
    quarterly: 0,
    yearly: 0
  });
  const [lateFee, setLateFee] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [loanParametersHistory, setLoanParametersHistory] = useState([]);

  const fetchInitialData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}auth/interest-rates`);
      const data = await response.json();
      
      const rates = {};
      frequencyOptions.forEach(freq => {
        const rateData = data.data.find(item => item.frequency.toLowerCase() === freq);
        rates[freq] = rateData ? rateData.interest_rate : 0;
      });
      setInterestRates(rates);
    } catch (error) {
      console.error("Error fetching interest rates:", error);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleSaveChanges = async () => {
    if (interestRates[selectedFrequency] < 0 || lateFee < 0) {
      alert("Please enter valid values");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}auth/upd-interest-rate/${selectedFrequency}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interest_rate: interestRates[selectedFrequency]
        })
      });

      if (!response.ok) throw new Error('Failed to update rate');
      
      const updatedData = {
        frequency: selectedFrequency,
        interest_rate: interestRates[selectedFrequency],
        timestamp: new Date().toISOString(),
      };

      setLoanParametersHistory(prev => [...prev, {
        ...updatedData,
        updated_by: "Admin",
        effective_date: new Date().toISOString(),
      }]);

      alert(`${selectedFrequency} interest rate updated successfully!`);
    } catch (error) {
      console.error("Error updating parameters:", error);
      alert("Failed to update loan parameters");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Interest and Fee Management</h2>
      <div className={styles.form}>
        <div className={styles.formGroup}>
          <label>Select Frequency:</label>
          <select
            value={selectedFrequency}
            onChange={(e) => setSelectedFrequency(e.target.value)}
            className={styles.select}
          >
            {frequencyOptions.map(freq => (
              <option key={freq} value={freq}>
                {freq.charAt(0).toUpperCase() + freq.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Interest Rate (%):</label>
          <input
            type="number"
            step="0.1"
            min="0.1"
            value={isNaN(interestRates[selectedFrequency]) ? "" : interestRates[selectedFrequency]}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              setInterestRates(prev => ({
                ...prev,
                [selectedFrequency]: isNaN(value) ? 0 : value
              }));
            }}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Late Fee ($):</label>
          <input
            type="number"
            min="0.1"
            value={isNaN(lateFee) ? "" : lateFee}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              setLateFee(isNaN(value) ? 0 : value);
            }}
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
