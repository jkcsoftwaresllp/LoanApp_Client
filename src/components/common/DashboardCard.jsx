import React from "react";
import style from "./style/dashboardcard.module.css"; // You can create this CSS file for styles

const DashboardCard = ({ title, value, description }) => {
  return (
    <div className={style.dashboardCard}>
      <h3>{title}</h3>
      <p className={style.value}>{value}</p>
      {description && <p className={style.description}>{description}</p>}
    </div>
  );
};

export default DashboardCard;
