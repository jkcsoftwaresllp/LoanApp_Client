import React, { useState, useEffect } from "react";
import NotificationBody from "./notificationBody";
import styles from "./style/Notification.module.css";
import { NotificationIcon } from "../common/assets";
import { useNavigate } from "react-router-dom";
import { CloseIcon, NotiSettingicon } from "../common/assets";

const Notification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isInvestor, setIsInvestor] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    setIsInvestor(userRole === "investor");
  }, []);

  const toggleNotification = () => {
    setIsOpen(!isOpen);
  };

  const goToSettings = () => {
    navigate("/notification");
  };

  const notifications = [
    {
      title: "Payment Due",
      message: "Payment is due for the loan.",
      time: "17 FEB 25",
    },
    {
      title: "Payment Due",
      message: "Payment is due for the loan.",
      time: "17 FEB 25",
    },
    {
      title: "Payment Due",
      message: "Payment is due for the loan.",
      time: "17 FEB 25",
    },
    {
      title: "Payment Due",
      message: "Payment is due for the loan.",
      time: "17 FEB 25",
    },
  ];

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
            {notifications.map((notification, index) => (
              <NotificationBody
                key={index}
                title={notification.title}
                message={notification.message}
                time={notification.time}
              />
            ))}
          </div>
          {isInvestor && (
            <p className={styles.notificationSettings} onClick={goToSettings}>
              Notification Settings <NotiSettingicon />
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Notification;
