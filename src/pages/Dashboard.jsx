import React from "react";
import DashboardCard from "../components/common/DashboardCard";
import { Button } from "../components/common/Button";
import style from "./style/Dashboard.module.css";

const Dashboard = () => {
  const data = {
    activeLoans: 5,
    pendingApplications: 3,
    financialHistory: {
      totalBorrowed: 50000,
      repaymentsMade: 20000,
    },
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Active Loans and Pending Applications in one column on medium screens and larger */}
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

        {/* Financial History card on its own row or column */}
        <DashboardCard
          title="Financial History"
          value={`Total Borrowed: $${data.financialHistory.totalBorrowed}`}
          description={`Repayments Made: $${data.financialHistory.repaymentsMade}`}
          className="lg:col-span-1" // Ensures Financial History takes its own column on large screens
        />
      </div>

      <div className={style.btnSection}>
        <Button
          text="Apply for Loan"
          onClick={() => alert("Redirecting to Apply for Loan")}
          type="button"
        />
        <Button
          text="View Repayments"
          type="button"
          onClick={() => alert("Redirecting to View Repayments")}
        />
      </div>
    </div>
  );
};

export default Dashboard;
