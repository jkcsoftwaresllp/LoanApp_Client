import React, { useEffect, useState } from "react";
import styles from "./style/adminDashboard.module.css";
import { Loader } from "../../common/Loader";
import { Button } from "../../common/Button";
import { Card } from "../jsx/card";
import { CardContent } from "../jsx/cardContent";
import { useNavigate } from "react-router-dom";
import GradientButton from "../../common/GradientButton";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"; // For the graph

function AdminDashboard() {
  const [data, setData] = useState(null); // For dashboard metrics
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating fake API call with a delay
    setTimeout(() => {
      setData({
        total_customers: 100,
        total_investors: 40,
        active_loans: 50,
        pending_applications: 10,
        late_payments: 5,
        loan_trends: [
          { month: "Jan", approvals: 40 },
          { month: "Feb", approvals: 55 },
          { month: "Mar", approvals: 70 },
          { month: "Apr", approvals: 65 },
        ],
      });
      setLoading(false);
    }, 2000); // Simulate network delay
  }, []);

  return (
    <div className={styles.container}>
      {loading ? (
        <div className={styles.loaderContainer}>
          <Loader className={styles.loader} />
        </div>
      ) : (
        <>
          <h2 className={styles.title}>Dashboard</h2>
          <div className={styles.dashboardContainer}>
            <div className={styles.cardScrollContainer}>
              <div className={styles.cardColumn}>
                <Card>
                  <CardContent>
                    <p className={styles.cardValue}>
                      {data.total_customers || 0}
                    </p>
                    <h3 className={styles.cardTitle}>Total Customers</h3>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent>
                    <p className={styles.cardValue}>
                      {data.total_investors || 0}
                    </p>
                    <h3 className={styles.cardTitle}>Total Investor</h3>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent>
                    <p className={styles.cardValue}>
                      {data.active_loans || 0}%
                    </p>
                    <h3 className={styles.cardTitle}>Active Loans</h3>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent>
                    <p className={styles.cardValue}>
                      {data.pending_applications || 0}
                    </p>
                    <h3 className={styles.cardTitle}>Pending Application</h3>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent>
                    <p className={styles.cardValue}>
                      {data.late_payments || 0}
                    </p>
                    <h3 className={styles.cardTitle}>Late Payments</h3>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className={styles.main}>
              <div className={styles.chartContainer}>
                <h3 className={styles.chartTitle}>Loan Approval Trends</h3>
                {data.loan_trends.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data.loan_trends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="month"
                        padding={{ left: 30, right: 30 }}
                      />
                      <YAxis domain={[0, "dataMax + 20"]} tickCount={6} />
                      <Tooltip
                        formatter={(value) => [
                          `${value} approvals`,
                          "Loan Approvals",
                        ]}
                      />
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
                  <p>No critical notifications at the moment.</p>
                </div>
                <div className={styles.buttonContainer}>
                  <GradientButton label="Manage Notifications" />
                  <GradientButton label="View Reports" />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
