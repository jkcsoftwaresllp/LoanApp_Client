import React, { useState, useEffect } from "react";
import NotificationBody from "./notificationBody";
import styles from "./style/Notification.module.css";
import { NotificationIcon } from "../common/assets";
import { useNavigate } from "react-router-dom";
import { CloseIcon, NotiSettingicon } from "../common/assets";
import { API_BASE_URL } from "../../config";

const Notification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isInvestor, setIsInvestor] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    setIsInvestor(userRole === "investor");
    fetchNotifications(userRole);
  }, []);

  const fetchNotifications = async (userRole) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("No access token found");
        return;
      }

      const endpoint = userRole === "admin" ? 
        `${API_BASE_URL}auth/admin-notification` : 
        `${API_BASE_URL}auth/repayment-notification`;

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();
      
      if (userRole === "admin") {
        console.log("Admin Notification Response:", data);
      }

      if (response.ok) {
        let formattedNotifications = [];
        if (userRole === "admin") {
          // Format admin notifications
          formattedNotifications = data.notifications.map(notification => ({
            title: notification.type,
            message: notification.message,
            time: notification.created_at,
            type: notification.severity || "info"
          }));
        } else {
          // Format repayment notifications
          formattedNotifications = data.repayments?.map(repayment => ({
            title: repayment.status,
            message: `<strong>Loan ID: ${repayment.loan_id}</strong> - Payment of <span style="color: #0066cc">₹${repayment.amount}</span> due on ${repayment.due_date}`,
            time: repayment.due_date,
            type: repayment.status === "Overdue" ? "error" : "warning",
          })) || [];
        }

        setNotifications(formattedNotifications);
      } else {
        console.error("Failed to fetch notifications:", data.message);
        setNotifications([]);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
    }
  };
  const toggleNotification = () => {
    setIsOpen(!isOpen);
  };

  const goToSettings = () => {
    navigate("/notification");
  };

  return (
    <div className={styles.notification}>
      <div onClick={toggleNotification} className={styles.notificationIcon}>
        <NotificationIcon />
      </div>
      {isOpen && (
        <div
          className={`${styles.messagesSection} ${
            isOpen ? styles.messagesSectionShow : ""
          }`}
        >
          <button className={styles.messagesClose} onClick={toggleNotification}>
            <CloseIcon />
          </button>
          <div className={styles.projectsSectionHeader}>Notification</div>
          <div className={styles.messages}>
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <NotificationBody
                  key={index}
                  title={<strong>{notification.title}</strong>}
                  message={
                    <div
                      dangerouslySetInnerHTML={{ __html: notification.message }}
                    />
                  }
                  time={notification.time}
                />
              ))
            ) : (
              <div className={styles.noNotifications}>No notifications</div>
            )}
          </div>

          <div className={styles.notificationSettings} onClick={goToSettings}>
            Notification Settings <NotiSettingicon />
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;
