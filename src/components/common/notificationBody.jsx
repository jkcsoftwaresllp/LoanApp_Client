import styles from "./style/Notification.module.css";

const NotificationBody = ({ title, message, time }) => {
  return (
    <div className={styles.notificationBody}>
      <div className={styles.notificationContent}>
        <div className={styles.notificationHeader}>
          <span className={styles.notificationName}>{title}</span>
          <span className={styles.starCheckbox}>
            {/* Optional: Checkbox or any other content */}
          </span>
        </div>
        <div className={styles.notificationLine}>{message}</div>
        <div className={styles.notificationLineTime}>{time}</div>
      </div>
    </div>
  );
};

export default NotificationBody;
