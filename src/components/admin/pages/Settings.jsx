import React, { useState, useEffect } from "react";
import styles from "./style/Settings.module.css";
import { Button } from "../../common/Button";
import { showToast } from "../../../utils/toastUtils";

const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: "email",
    interest_rate: 5.0,
  });
  const [isSaving, setIsSaving] = useState(false);

  const fetchSettings = async () => {
    // Simulate fetching initial settings
    const fakeData = {
      notifications: "email",
      interest_rate: 5.0,
      last_updated: "2023-10-01T12:00:00Z",
    };
    setSettings(fakeData);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSaveSettings = async () => {
    if (settings.interest_rate < 0) {
      showToast("error", "Please enter valid values");
      return;
    }

    setIsSaving(true);
    try {
      const response = {
        status: "success",
        message: "Settings updated",
        updated_values: settings,
      };
      console.log(response);
      showToast("info", "Settings updated successfully!");
    } catch (error) {
      console.error("Error updating settings:", error);
      showToast("error", "Failed to update settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>System Settings</h2>

      <div className={styles.form}>
        <div className={styles.formGroup}>
          <p className={styles.label}>Notification Preferences:</p>
          <select
            value={settings.notifications}
            className={styles.input}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                notifications: e.target.value,
              }))
            }
          >
            <option value="email">Email</option>
            <option value="sms">SMS</option>
            <option value="both">Email and SMS</option>
            <option value="none">None</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <p className={styles.label}>Default Interest Rate (%):</p>
          <input
            type="number"
            step="0.1"
            min="0"
            className={styles.input}
            value={settings.interest_rate}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                interest_rate: parseFloat(e.target.value),
              }))
            }
          />
        </div>

        <Button
          onClick={handleSaveSettings}
          disabled={isSaving}
          text={isSaving ? "Saving..." : "Save Settings"}
        />
      </div>
    </div>
  );
};

export default Settings;
