import React from "react";
import DashboardCard from "../components/common/DashboardCard";
import CustomDashboardCard from "../components/common/CustomDashCard";
import { Button } from "../components/common/Button";
import style from "./style/Dashboard.module.css";
import { useNavigate } from "react-router-dom";
import EmiCard from "../components/common/EmiCard";
import GradientButton from "../components/common/GradientButton";
import SemiDonutChart from "../components/common/SemiDonutChart";

const Dashboard = () => {
  const navigate = useNavigate();

  const data = {
    activeLoans: 5,
    pendingApplications: 3,
    financialHistory: {
      totalBorrowed: 15000,
      repaymentsMade: 13000,
    },
  };

  const goToLoan = () => {
    navigate("/loan");
  };
  const goToRepayment = () => {
    navigate("/repay");
  };
  const goToemi = () => {
    navigate("/emi");
  };
  return (
    <div className={style.container}>
      <h1 className={style.header}>Dashboard</h1>

      <div className={style.main}>
        {/* Left Section */}
        <div className={style.leftSection}>
          <div className={style.cardArea}>
            <DashboardCard
              title="Active Loans"
              value={data.activeLoans}
              desc="Number of loans currently active."
            />
            <DashboardCard
              title="Pending Applications"
              value={data.pendingApplications}
              desc="Applications waiting for approval."
            />
          </div>
          <CustomDashboardCard
            title="Financial History"
            valueTitle="Total Borrowed"
            value={`${data.financialHistory.totalBorrowed}`}
            valueTitle2="Repayments Made"
            value2={`${data.financialHistory.repaymentsMade}`}
            desc="Your financial history."
          />
        </div>

        {/* Right Section */}
        <div className={style.rightSection}>
          <SemiDonutChart
            paid={data.financialHistory.repaymentsMade}
            total={data.financialHistory.totalBorrowed}
          />
          <EmiCard onClick={goToemi} title="Calculate" value="EMI" />
        </div>
      </div>

      {/* Button Section */}
      <div className={style.btnSection}>
        <GradientButton label="Apply for Loan" onClick={goToLoan} />
        <GradientButton label="View Repayments" onClick={goToRepayment} />
      </div>
    </div>
  );
};

export default Dashboard;
