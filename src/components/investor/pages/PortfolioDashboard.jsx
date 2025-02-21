import { useEffect, useState } from "react";
import { Card } from "../jsx/card";
import { CardContent } from "../jsx/cardContent";
import { Button } from "../../common/Button";
import GradientButton from "../../common/GradientButton";
import styles from "./style/PortfolioDashboard.module.css";

import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const PortfolioDashboard = () => {
  const [portfolio, setPortfolio] = useState({
    total_funds: 100000,
    active_loans: 3,
    roi: "12%",
    monthly_earnings: 5000,
  });

  const pieData = [
    { name: "Active Loans", value: portfolio.active_loans * 10000 },
    {
      name: "Remaining Funds",
      value: portfolio.total_funds - portfolio.active_loans * 10000,
    },
  ];

  const COLORS = ["#0088FE", "#00C49F"];

  const lineData = [
    { month: "Jan", roi: 10 },
    { month: "Feb", roi: 12 },
    { month: "Mar", roi: 11 },
    { month: "Apr", roi: 13 },
    { month: "May", roi: 14 },
    { month: "Jun", roi: 15 },
  ];

  return (
    <div className={styles.dashboardContainer}>
      <Card>
        <CardContent>
          <p className={styles.cardValue}>₹{portfolio.total_funds}</p>
          <h3 className={styles.cardTitle}>Total Funds</h3>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <p className={styles.cardValue}>{portfolio.active_loans}</p>
          <h3 className={styles.cardTitle}>Active Loans</h3>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <p className={styles.cardValue}>{portfolio.roi}</p>
          <h3 className={styles.cardTitle}>Return Of Investment</h3>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <p className={styles.cardValue}>₹{portfolio.monthly_earnings}</p>
          <h3 className={styles.cardTitle}>Monthly Earnings</h3>
        </CardContent>
      </Card>

      <div className={styles.chartContainer}>
        <h3 className={styles.chartTitle}>Fund Allocation</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.chartContainer}>
        <h3 className={styles.chartTitle}>ROI Trends</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={lineData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="roi"
              stroke="#8884d8"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.buttonContainer}>
        <GradientButton label="View Details" />
        <GradientButton label="Invest" />
      </div>
    </div>
  );
};

export default PortfolioDashboard;
