import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Loader } from "../../common/Loader";
import styles from "./style/Earning.module.css";

export const EarningsRepayment = () => {
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const mockData = [
        {
          loan_id: "L001",
          due_date: "2024-01-15",
          amount: "500",
          status: "Paid",
        },
        {
          loan_id: "L002",
          due_date: "2024-02-15",
          amount: "450",
          status: "Pending",
        },
        {
          loan_id: "L003",
          due_date: "2024-03-15",
          amount: "600",
          status: "Paid",
        },
        {
          loan_id: "L004",
          due_date: "2024-04-15",
          amount: "550",
          status: "Pending",
        },
        {
          loan_id: "L005",
          due_date: "2024-05-15",
          amount: "700",
          status: "Paid",
        },
        {
          loan_id: "L001",
          due_date: "2024-01-15",
          amount: "500",
          status: "Paid",
        },
        {
          loan_id: "L002",
          due_date: "2024-02-15",
          amount: "450",
          status: "Pending",
        },
        {
          loan_id: "L003",
          due_date: "2024-03-15",
          amount: "600",
          status: "Paid",
        },
        {
          loan_id: "L004",
          due_date: "2024-04-15",
          amount: "550",
          status: "Pending",
        },
        {
          loan_id: "L005",
          due_date: "2024-05-15",
          amount: "700",
          status: "Paid",
        },
        {
          loan_id: "L001",
          due_date: "2024-01-15",
          amount: "500",
          status: "Paid",
        },
        {
          loan_id: "L002",
          due_date: "2024-02-15",
          amount: "450",
          status: "Pending",
        },
        {
          loan_id: "L003",
          due_date: "2024-03-15",
          amount: "600",
          status: "Paid",
        },
        {
          loan_id: "L004",
          due_date: "2024-04-15",
          amount: "550",
          status: "Pending",
        },
        {
          loan_id: "L005",
          due_date: "2024-05-15",
          amount: "700",
          status: "Paid",
        },
      ];

      setEarnings(mockData);
      setLoading(false);
    }, 100);
  }, []);

  if (loading)
    return (
      <div className={styles.center}>
        <Loader />
      </div>
    );

  // Line Chart Data
  const chartData = earnings.map((e) => ({
    month: e.due_date.substring(0, 7),
    amount: parseFloat(e.amount),
  }));

  // Calculate Paid vs Pending
  const totalPaid = earnings
    .filter((e) => e.status === "Paid")
    .reduce((sum, e) => sum + parseFloat(e.amount), 0);

  const totalPending = earnings
    .filter((e) => e.status === "Pending")
    .reduce((sum, e) => sum + parseFloat(e.amount), 0);

  const donutChartData = [
    { name: "Paid", value: totalPaid },
    { name: "Pending", value: totalPending },
  ];

  const COLORS = ["#4CAF50", "#FF9800"]; // Green for Paid, Orange for Pending

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Earnings & Repayment</h2>

      {/* Table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className="py-2 px-4 text-center">Loan ID</th>
              <th className="py-2 px-4 text-center">EMI Date</th>
              <th className="py-2 px-4 text-center">Amount</th>
              <th className="py-2 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {earnings.map((earning, index) => (
              <tr key={index}>
                <td className="py-2 px-4 text-center">{earning.loan_id}</td>
                <td className="py-2 px-4 text-center">{earning.due_date}</td>
                <td className="py-2 px-4 text-center">${earning.amount}</td>
                <td
                  className={`${
                    earning.status === "Paid"
                      ? styles.statusPaid
                      : styles.statusPending
                  }`}
                  style={{ padding: "0.5rem 1rem", textAlign: "center" }}
                >
                  {earning.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Charts - Responsive Layout */}
      <div className={styles.chartsContainer}>
        {/* Line Chart */}
        <div className={styles.chartBox}>
          <h3 className={styles.chartTitle}>ROI Trends</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#8884d8"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Donut Chart */}
        <div className={styles.chartBox}>
          <h3 className={styles.chartTitle}>Paid vs Pending Payments</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={donutChartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {donutChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
