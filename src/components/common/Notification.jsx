import React, { useState } from "react";
import NotificationBody from "./notificationBody";
import styles from "./style/Notification.module.css";
import { NotificationIcon } from "../common/assets";
import { CloseIcon } from "../common/assets";

const Notification = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNotification = () => {
    setIsOpen(!isOpen);
  };

  // Dummy data for notifications
  const notifications = [
    {
      title: "Payment Due",
      message: "Payment is due for the loan.",
      time: "2025-02-17 10:00 AM",
    },
    {
      title: "Payment Due",
      message: "Payment is due for the loan.",
      time: "2025-02-17 10:00 AM",
    },
    {
      title: "Payment Due",
      message: "Payment is due for the loan.",
      time: "2025-02-17 10:00 AM",
    },
    {
      title: "Payment Due",
      message: "Payment is due for the loan.",
      time: "2025-02-17 10:00 AM",
    },
  ];

  return (
    <div className={styles.notification}>
      <button onClick={toggleNotification}>
        <NotificationIcon />
      </button>
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
            {notifications.map((notification, index) => (
              <NotificationBody
                key={index}
                title={notification.title}
                message={notification.message}
                time={notification.time}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;
