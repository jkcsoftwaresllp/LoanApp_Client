import React, { useState, useEffect } from "react";
import DashboardCard from "../components/common/DashboardCard";
import CustomDashboardCard from "../components/common/CustomDashCard";
import style from "./style/Dashboard.module.css";
import { useNavigate } from "react-router-dom";
import EmiCard from "../components/common/EmiCard";
import GradientButton from "../components/common/GradientButton";
import SemiDonutChart from "../components/common/SemiDonutChart";
import { showToast } from "../utils/toastUtils";
import { Loader } from "../components/common/Loader";
import { API_BASE_URL } from "../config";

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    active_loans: 0,
    pending_applications: 0,
    financial_history: {
      total_repaid: 0,
      remaining_balance: 0,
      totalamount: 0,
    },
    notifications: [],
  });

  const fetchDashboardData = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        showToast("error", "No access token found. Please log in.");
        return;
      }

      const response = await fetch(`${API_BASE_URL}auth/loancount`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setDashboardData(data);
      } else {
        showToast("error", data.message || "Failed to fetch dashboard data.");
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      showToast("error", "Failed to fetch dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

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

      {loading ? (
        <div className={style.center}>
          <Loader />
        </div>
      ) : (
        <>
          <div className={style.main}>
            {/* Left Section */}
            <div className={style.leftSection}>
              <div className={style.cardArea}>
                <DashboardCard
                  title="Active Loans"
                  value={dashboardData.active_loans || 0}
                  desc="Number of loans currently active."
                />
                <DashboardCard
                  title="Pending Applications"
                  value={dashboardData.pending_applications || 0}
                  desc="Applications waiting for approval."
                />
              </div>
              <CustomDashboardCard
                title="Financial History"
                valueTitle="Total Borrowed"
                value={`${Number(
                  dashboardData.financial_history?.totalamount || 0
                ).toFixed(2)}`}
                valueTitle2="Repayments Made"
                value2={`${Number(
                  dashboardData.financial_history?.total_repaid || 0
                ).toFixed(2)}`}
                desc="Your financial history."
              />
            </div>

            {/* Right Section */}
            <div className={style.rightSection}>
              <SemiDonutChart
                paid={dashboardData.financial_history?.total_repaid || 0}
                total={dashboardData.financial_history?.totalamount || 0}
              />
              <EmiCard onClick={goToemi} title="Calculate" value="EMI" />
            </div>
          </div>

          {/* Button Section */}
          <div className={style.btnSection}>
            <GradientButton label="Apply for Loan" onClick={goToLoan} />
            <GradientButton label="View Repayments" onClick={goToRepayment} />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
