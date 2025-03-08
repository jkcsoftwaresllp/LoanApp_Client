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
    const fetchNotificationDetails = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/auth/repayment-notification",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok && data.repayments && Array.isArray(data.repayments)) {
          const formattedNotifications = data.repayments.map(repayment => ({
            type: repayment.status,
            message: `Loan ID: ${repayment.loan_id} - Payment of ₹${repayment.amount} due on ${repayment.due_date}`,
            dueDate: repayment.due_date,
            amount: repayment.amount,
            loanId: repayment.loan_id
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
    };

    fetchNotificationDetails();
  }, []);

  return (
    <>
      <h2 className={styles.title}>Repayment Notifications</h2>
      <div className={styles.container}>
        <h2 className={styles.h2}>Upcoming & Overdue Payments</h2>
        {notifications.length > 0 ? (
          <ul className={styles.ul}>
            {notifications.map((notification, index) => (
              <li 
                key={index} 
                className={`${styles.li} ${notification.type === "Overdue" ? styles.overdue : styles.upcoming}`}
              >
                <div className={styles.notificationHeader}>
                  <strong>{notification.type}</strong>
                  <span className={styles.amount}>₹{notification.amount}</span>
                </div>
                <div className={styles.notificationDetails}>
                  <p>Loan ID: {notification.loanId}</p>
                  <p>Due Date: {notification.dueDate}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.p}>No pending repayments.</p>
        )}
      </div>
    </>
  );
};

export default NotificationSettings;
