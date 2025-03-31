import React, { useEffect, useState } from "react";
import styles from "./style/adminDashboard.module.css";
import { Loader } from "../../common/Loader";
import { Card } from "../jsx/card";
import { CardContent } from "../jsx/cardContent";
import GradientButton from "../../common/GradientButton";
import { useNavigate } from "react-router-dom";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts"; // For the graph
import { fetchDashboardData } from "./helper/dashboardHelper"; // Import the helper function

function AdminDashboard() {
  const [data, setData] = useState(null); // For dashboard metrics
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const goToReport = () => {
    navigate("/admin/report");
  };
  const goToNoti = () => {
    navigate("/notification");
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const dashboardData = await fetchDashboardData();
        setData(dashboardData);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <div className={styles.container}>
      {loading ? (
        <div className={styles.loaderContainer}>
          <Loader className={styles.loader} />
        </div>
      ) : data && data.data ? ( // Add null check here
        <>
          <h2 className={styles.title}>Dashboard</h2>
          <div className={styles.dashboardContainer}>
            <div className={styles.cardScrollContainer}>
              <div className={styles.cardColumn}>
                <Card>
                  <CardContent>
                    <p className={styles.cardValue}>
                      {data.data.totalCustomers || 0}
                    </p>
                    <h3 className={styles.cardTitle}>Total Customers</h3>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent>
                    <p className={styles.cardValue}>
                      {data.data.totalInvestors || 0}
                    </p>
                    <h3 className={styles.cardTitle}>Total Investor</h3>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent>
                    <p className={styles.cardValue}>
                      {data.data.loanDetailsCount || 0}
                    </p>
                    <h3 className={styles.cardTitle}>Total Loans</h3>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent>
                    <p className={styles.cardValue}>
                      {data.data.totalApprovedLoans || 0}
                    </p>
                    <h3 className={styles.cardTitle}>Approved Loans</h3>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent>
                    <p className={styles.cardValue}>
                      {data.data.totalPendingLoans || 0}
                    </p>
                    <h3 className={styles.cardTitle}>Pending Loans</h3>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className={styles.main}>
              <div className={styles.chartContainer}>
                <h3 className={styles.chartTitle}>Loan Approval Trends</h3>
                {data.formattedMonthlyApprovedLoans?.length > 0 ? (
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={data.formattedMonthlyApprovedLoans}>
                      <CartesianGrid strokeDasharray="10 3" />
                      <XAxis dataKey="month" padding={{ left: 3, right: 3 }} />
                      <YAxis domain={[0, "dataMax + 20"]} tickCount={6} />
                      <Tooltip
                        formatter={(value) => [
                          `${value} approvals`,
                          "Loan Approvals",
                        ]}
                      />
                      <Legend /> {/* Added Legend component */}
                      <Line
                        type="monotone"
                        dataKey="approvals"
                        stroke="#8884d8"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className={styles.emptyChartState}>
                    <h3 className="text-black">No data available</h3>
                  </div>
                )}
              </div>
              <div className={styles.noti}>
                <div className={styles.notificationContainer}>
                  <h2 className={styles.notificationTitle}>Notifications</h2>
                  <hr className={styles.divider} />
                  {data.data.adminNotifications?.length > 0 ? (
                    data.data.adminNotifications.map((notification, index) => (
                      <div key={index} className={styles.notificationItem}>
                        <div className={styles.notificationLeft}>
                          <p>{notification.status}</p>
                        </div>
                        <div className={styles.notificationRight}>
                          <small>Loan ID: {notification.loan_id}</small>
                          <small>Investor ID: {notification.investor_id}</small>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No critical notifications at the moment.</p>
                  )}
                </div>
                <div className={styles.buttonContainer}>
                  <GradientButton
                    label="Manage Notifications"
                    onClick={goToNoti}
                  />
                  <GradientButton label="View Reports" onClick={goToReport} />
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        // Add fallback UI for when data is not available
        <div className={styles.emptyState}>
          <h3>No data available</h3>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
