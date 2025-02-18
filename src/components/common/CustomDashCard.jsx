import React from "react";
import styles from "./style/dashboardcard.module.css"; // You can create this CSS file for styles

const CustomDashboardCard = ({
  title,
  valueTitle,
  valueTitle2,
  value,
  desc,
  value2,
}) => {
  return (
    <div className={styles.cardCustom} title={desc}>
      <div className={styles.title}>
        <p className={styles.titleTextCustom}>{title}</p>
      </div>
      <div className={styles.data}>
        <p className={styles.valueTitle}>{valueTitle}</p>
        <p className={styles.valueCustom}>{value}</p>
        <p className={styles.divider}></p>
        <p className={styles.valueTitle}>{valueTitle2}</p>
        <p className={styles.valueCustom}>{value2}</p>
      </div>
    </div>
  );
};

export default CustomDashboardCard;
