import React from "react";
import DashboardCard from "../components/common/DashboardCard";
import { Button } from "../components/common/Button";
import style from "./style/Dashboard.module.css";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const data = {
    activeLoans: 5,
    pendingApplications: 3,
    financialHistory: {
      totalBorrowed: 50000,
      repaymentsMade: 20000,
    },
  };
  const goToLoan = () => {
    navigate("/loan");
  };

  return (
    <div className={style.container}>
      <h1 className={style.header}>Dashboard</h1>

      <div className={style.main}>
        <div className={style.cardArea}>
          <DashboardCard
            title="Active Loans"
            value={data.activeLoans}
            description="Number of loans currently active."
          />
          <DashboardCard
            title="Pending Applications"
            value={data.pendingApplications}
            description="Applications waiting for approval."
          />
        </div>

        <DashboardCard
          title="Financial History"
          value={`Total Borrowed: $${data.financialHistory.totalBorrowed}`}
          description={`Repayments Made: $${data.financialHistory.repaymentsMade}`}
          className="lg:col-span-1" // Ensures Financial History takes its own column on large screens
        />
      </div>

      <div className={style.btnSection}>
        <Button text="Apply for Loan" onClick={goToLoan} type="button" />
        <Button
          text="View Repayments"
          type="button"
          onClick={() => navigate("/repayments")}
        />
      </div>
    </div>
  );
};

export default Dashboard;
