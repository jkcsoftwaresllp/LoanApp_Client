import React, { useEffect, useState } from "react";
import styles from "./style/Notification.module.css";
import { Loader } from "../../common/Loader";
import { showToast } from "../../../utils/toastUtils";
import { Button } from "../../common/Button";

const NotificationSettings = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [contactInfo, setContactInfo] = useState({ email: "", mobile: "" });

  useEffect(() => {
    const fetchNotificationPreferences = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/auth/preferences",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        const result = await response.json();
        if (!response.ok) {
          throw new Error(
            result.message || "Failed to fetch notification preferences"
          );
        }
        setNotifications(result.notifications || []);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError(err.message);
        showToast("error", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotificationPreferences();
  }, []);

  if (loading) {
    return (
      <div className={styles.center}>
        <Loader />
      </div>
    );
  }

  return (
    <>
      <div className={styles.header}>
        <h1>Notification Settings</h1>
      </div>
      <div className={styles.container}>
        <h2 className={styles.h2}>Contact Information</h2>
        <p className={styles.p}>
          <strong>Email:</strong> {contactInfo.email || "Not Available"}
        </p>
        <p className={styles.p}>
          <strong>Mobile:</strong> {contactInfo.mobile || "Not Available"}
        </p>

        <h2>Mandatory Notifications</h2>
        {notifications.length > 0 ? (
          <ul className={styles.ul}>
            {notifications.map((notification, index) => (
              <li key={index} className={styles.li}>
                <strong>{notification.type}:</strong> {notification.message}
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.p}>No notifications available.</p>
        )}
      </div>
    </>
  );
};

export default NotificationSettings;
