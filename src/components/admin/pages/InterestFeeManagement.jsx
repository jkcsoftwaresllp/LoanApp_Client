import React, { useState, useEffect } from "react";
import styles from "./style/InterestFeeManagement.module.css";
import { Button } from "../../common/Button";
import { API_BASE_URL } from "../../../config";
import { Loader } from "../../common/Loader";
import { showToast } from "../../../utils/toastUtils";

const frequencyOptions = ["Monthly", "Yearly", "Weekly", "Quarterly"];

const InterestFeeManagement = () => {
  // Update initial state to match enum case
  const [selectedFrequency, setSelectedFrequency] = useState(
    frequencyOptions[0]
  );

  // Update interestRates state keys to match enum case
  const [interestRates, setInterestRates] = useState({
    Monthly: { data: { interest_rate: 0 } },
    Yearly: { data: { interest_rate: 0 } },
    Weekly: { data: { interest_rate: 0 } },
    Quarterly: { data: { interest_rate: 0 } },
  });
  const [isSaving, setIsSaving] = useState(false);
  const [loanParametersHistory, setLoanParametersHistory] = useState([]);

  const handleSaveChanges = async () => {
    if (interestRates[selectedFrequency]?.data?.interest_rate < 0) {
      showToast("error", "Please enter valid values");
      return;
    }

    setIsSaving(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("No access token found");
        showToast("error", "Authentication required");
        return;
      }

      // Update interest rate only
      const interestResponse = await fetch(
        `${API_BASE_URL}auth/upd-interest-rate/${selectedFrequency}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            interest_rate:
              interestRates[selectedFrequency]?.data?.interest_rate,
          }),
        }
      );

      if (!interestResponse.ok) {
        throw new Error(`HTTP error! status: ${interestResponse.status}`);
      }

      const updatedData = {
        frequency: selectedFrequency,
        interest_rate: interestRates[selectedFrequency]?.data?.interest_rate,
        timestamp: new Date().toISOString(),
      };

      setLoanParametersHistory((prev) => [
        ...prev,
        {
          ...updatedData,
          updated_by: "Admin",
          effective_date: new Date().toISOString(),
        },
      ]);

      showToast("success", "Interest rate updated successfully!");
    } catch (error) {
      console.error("Error updating interest rate:", error);
      showToast(
        "error",
        "Failed to update interest rate. Please check console for details."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const fetchInterestRateByFrequency = async (frequency) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("No access token found");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}auth/interest-rate/${frequency}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          console.error("Unauthorized: Please login again");
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("Interest rate response:", responseData);

      if (responseData && responseData.data) {
        setInterestRates((prev) => ({
          ...prev,
          [frequency]: {
            data: {
              ...responseData.data,
              interest_rate: responseData.data.interest_rate || 0,
            },
          },
        }));
      }
    } catch (error) {
      console.error("Error fetching interest rate:", error);
    }
  };

  useEffect(() => {
    const fetchInitialRates = async () => {
      await Promise.all(
        frequencyOptions.map((freq) => fetchInterestRateByFrequency(freq))
      );
    };
    fetchInitialRates();
  }, []);

  const handleFrequencyChange = async (e) => {
    const newFrequency = e.target.value;
    setSelectedFrequency(newFrequency);
    await fetchInterestRateByFrequency(newFrequency);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Interest and Fee Management</h2>
      <div className={styles.form}>
        <div className={styles.rowContainer}>
          <div className={styles.formGroup}>
            <p className={styles.label}>Select Frequency:</p>
            <select
              value={selectedFrequency}
              onChange={handleFrequencyChange}
              className={styles.input}
            >
              {frequencyOptions.map((freq) => (
                <option key={freq} value={freq}>
                  {freq}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <p className={styles.label}>Interest Rate (%):</p>
            <input
              type="number"
              step="0.1"
              min="0.1"
              className={styles.input}
              value={
                isNaN(interestRates[selectedFrequency]?.data?.interest_rate)
                  ? ""
                  : interestRates[selectedFrequency]?.data?.interest_rate
              }
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                setInterestRates((prev) => ({
                  ...prev,
                  [selectedFrequency]: {
                    data: {
                      ...prev[selectedFrequency]?.data,
                      interest_rate: isNaN(value) ? 0 : value,
                    },
                  },
                }));
              }}
            />
          </div>
        </div>

        <Button
          text={isSaving ? "Saving..." : "Save Changes"}
          onClick={handleSaveChanges}
          disabled={isSaving}
        />
      </div>
    </div>
  );
};

export default InterestFeeManagement;
