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
        if (response.ok) {
          setProfile(data.profile);
          setRole(data.profile.role); // Assuming role is part of the profile
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        showToast("error", "Failed to fetch profile details");
      }
    };

    const fetchNotificationDetails = async () => {
      if (role === "user") {
        // Only fetch notifications for user role
        try {
          const response = await fetch(
            `${API_BASE_URL}auth/repayment-notification`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            }
          );

          const data = await response.json();

          if (
            response.ok &&
            data.repayments &&
            Array.isArray(data.repayments)
          ) {
            const formattedNotifications = data.repayments.map((repayment) => ({
              type: repayment.status,
              message: `Loan ID: ${repayment.loan_id} - Payment of ₹${repayment.amount} due on ${repayment.due_date}`,
              dueDate: repayment.due_date,
              amount: repayment.amount,
              loanId: repayment.loan_id,
            }));
            setNotifications(formattedNotifications);
          } else {
            setNotifications([]);
            if (data.message) {
              showToast("info", data.message);
            }
          }
        } catch (err) {
          console.error("Error fetching notifications:", err);
          setError(err.message);
          showToast("error", "Failed to fetch notification details");
        } finally {
          setLoading(false);
        }
      } else if (role === "admin") {
        // Fetch notifications for admin role
        try {
          const response = await fetch(
            `${API_BASE_URL}auth/admin-notification`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            }
          );

          const data = await response.json();
          console.log("Admin Notifications Response:", data);

          if (
            response.ok &&
            data.notifications &&
            Array.isArray(data.notifications)
          ) {
            setNotifications(data.notifications); // Set the notifications directly from API
          } else {
            setNotifications([]);
            if (data.message) {
              showToast("info", data.message);
            }
          }
        } catch (err) {
          console.error("Error fetching admin notifications:", err);
          showToast("error", "Failed to fetch admin notification details");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false); // Ensure loading is set to false if not fetching
      }
    };

    fetchUserProfile();
    fetchNotificationDetails();
  }, [role]);

  const handleEmailNotificationChange = async (e) => {
    const isChecked = e.target.checked;
    setEmailNotification(isChecked);

    if (role === "admin") {
      try {
        const response = await fetch(`${API_BASE_URL}api/auth/preferences`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({
            investor_id: profile.investor_id, // Assuming investor_id is part of the profile
            enable_notifications: isChecked,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          showToast("success", data.message);
        } else {
          showToast("error", data.message || "Failed to update preferences");
        }
      } catch (err) {
        console.error("Error updating notification preferences:", err);
        showToast("error", "Failed to update notification preferences");
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
