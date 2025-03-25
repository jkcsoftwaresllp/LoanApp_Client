import React, { useState, useEffect } from "react";
import styles from "./style/Settings.module.css";

const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: "email",
    interest_rate: 5.0
  });
  const [isSaving, setIsSaving] = useState(false);

  const fetchSettings = async () => {
    // Simulate fetching initial settings
    const fakeData = {
      notifications: "email",
      interest_rate: 5.0,
      last_updated: "2023-10-01T12:00:00Z"
    };
    setSettings(fakeData);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSaveSettings = async () => {
    if (settings.interest_rate < 0) {
      alert("Please enter valid values");
      return;
    }

    setIsSaving(true);
    try {
      console.log("PATCH /api/admin/update-settings", settings);
      
      // Simulate API response
      const response = { 
        status: "success", 
        message: "Settings updated",
        updated_values: settings
      };
      console.log(response);
      alert("Settings updated successfully!");
    } catch (error) {
      console.error("Error updating settings:", error);
      alert("Failed to update settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>System Settings</h2>
      
      <div className={styles.form}>
        <div className={styles.formGroup}>
          <label>Notification Preferences:</label>
          <select
            value={settings.notifications}
            onChange={(e) => setSettings(prev => ({ ...prev, notifications: e.target.value }))}
          >
            <option value="email">Email</option>
            <option value="sms">SMS</option>
            <option value="both">Email and SMS</option>
            <option value="none">None</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Default Interest Rate (%):</label>
          <input
            type="number"
            step="0.1"
            min="0"
            value={settings.interest_rate}
            onChange={(e) => setSettings(prev => ({ ...prev, interest_rate: parseFloat(e.target.value) }))}
          />
        </div>

        <button
          className={styles.saveButton}
          onClick={handleSaveSettings}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
};

export default Settings;