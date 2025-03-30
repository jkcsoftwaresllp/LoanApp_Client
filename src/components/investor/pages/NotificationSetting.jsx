import React, { useEffect, useState } from "react";
import styles from "./style/Notification.module.css";
import { showToast } from "../../../utils/toastUtils";
import { API_BASE_URL } from "../../../config";

const NotificationSettings = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [emailNotification, setEmailNotification] = useState(true);
  const [role, setRole] = useState(""); // New state for role

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}auth/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        const data = await response.json();
        console.log("Profile Data:", data); // Log profile data
        if (response.ok) {
          setProfile(data.profile);
          setRole(data.profile.role);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        showToast("error", "Failed to fetch profile details");
      }
    };

    fetchUserProfile();
  }, []);

  const handleEmailNotificationChange = async (e) => {
    const isChecked = e.target.checked;
    setEmailNotification(isChecked);

    if (role === "admin") {
      const requestData = {
        investor_id: "IVXJ55770", // Hardcoded investor ID for testing
        enable_notifications: isChecked,
      };
      console.log("Sending data to API:", requestData);

      try {
        const response = await fetch(`${API_BASE_URL}api/auth/preferences`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify(requestData),
        });

        const data = await response.json();
        console.log("Notification Preferences Response:", data);

        if (data.status === "success") {
          showToast("success", data.message);
          setEmailNotification(data.preferences.enable_notifications);
        } else {
          showToast("error", data.message || "Failed to update preferences");
          setEmailNotification(!isChecked);
        }
      } catch (err) {
        console.error("Error updating notification preferences:", err);
        showToast("error", "Failed to update notification preferences");
        setEmailNotification(!isChecked);
      }
    }
  };

  return (
    <>
      <h2 className={styles.title}>Notifications</h2>
      <div className={styles.container}>
        <div className={styles.profileSection}>
          <div className={styles.contactInfo}>
            <p>
              <strong>Email:</strong> {profile.email}
            </p>
            <p>
              <strong>Mobile:</strong> {profile.phone || "Not provided"}
            </p>
          </div>
          <div className={styles.notificationPreference}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={emailNotification}
                onChange={handleEmailNotificationChange}
              />
              <p> Send notifications to email</p>
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationSettings;
