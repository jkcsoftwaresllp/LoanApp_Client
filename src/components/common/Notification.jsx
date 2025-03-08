import React, { useState, useEffect } from "react";
import NotificationBody from "./notificationBody";
import styles from "./style/Notification.module.css";
import { NotificationIcon } from "../common/assets";
import { useNavigate } from "react-router-dom";
import { CloseIcon, NotiSettingicon } from "../common/assets";

const Notification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isInvestor, setIsInvestor] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    setIsInvestor(userRole === "investor");

    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        console.error("No access token found");
        return;
      }

      const response = await fetch("http://localhost:5000/api/loancount", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.notifications) {
        // Convert notifications to expected format
        const formattedNotifications = data.notifications.map((notif) => ({
          title: "Notification",
          message: notif,
          time: new Date().toLocaleDateString(), // Using current date as a placeholder
        }));

        setNotifications(formattedNotifications);
      } else {
        console.error("Failed to fetch notifications:", data.message);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
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
                  title={notification.title}
                  message={notification.message}
                  time={notification.time}
                />
              ))
            ) : (
              <p className={styles.noNotifications}>No notifications</p>
            )}
          </div>

          <p className={styles.notificationSettings} onClick={goToSettings}>
            Notification Settings <NotiSettingicon />
          </p>
        </div>
      )}
    </div>
  );
};

export default Notification;
