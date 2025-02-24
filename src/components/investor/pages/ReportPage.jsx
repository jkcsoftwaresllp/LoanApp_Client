import { useState } from "react";
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
  BarChart,
  Bar,
} from "recharts";
import styles from "./style/ReportPage.module.css";

const ReportsAnalytics = () => {
  const [filters, setFilters] = useState({ dateRange: "", riskLevel: "" });
  const [report, setReport] = useState(null);

  const handleGenerateReport = async () => {
    // Mock API call to generate report
    const response = {
      report_id: "401",
      download_link: "https://example.com/report.pdf",
    };
    setReport(response);
  };

  const riskData = [
    { name: "Low Risk", value: 40 },
    { name: "Medium Risk", value: 35 },
    { name: "High Risk", value: 25 },
  ];
  const colors = ["#28a745", "#ffc107", "#dc3545"];

  const roiData = [
    { month: "Jan", roi: 5 },
    { month: "Feb", roi: 7 },
    { month: "Mar", roi: 6 },
    { month: "Apr", roi: 8 },
  ];

  const loanData = [
    { type: "Personal", count: 50 },
    { type: "Business", count: 30 },
    { type: "Mortgage", count: 20 },
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Reports & Analytics</h2>

      {/* Filters */}
      <div className={styles.filters}>
        <input
          type="date"
          value={filters.dateRange}
          className={styles.filterInput}
          onChange={(e) =>
            setFilters({ ...filters, dateRange: e.target.value })
          }
        />
        <select
          value={filters.riskLevel}
          className={styles.filterInput}
          onChange={(e) =>
            setFilters({ ...filters, riskLevel: e.target.value })
          }
        >
          <option value="">Select Risk Level</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <button className={styles.generateBtn} onClick={handleGenerateReport}>
          Generate Report
        </button>
      </div>

      {/* Charts */}
      <div className={styles.chartsContainer}>
        <div className={styles.chartBox}>
          <h3 className={styles.chartTitle}>Loan Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={loanData}>
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#007bff" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className={styles.chartBox}>
          <h3 className={styles.chartTitle}>Risk Allocation</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={riskData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
              >
                {riskData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={styles.chartContainer}>
        <h3 className={styles.chartTitle}>ROI Trends</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={roiData}>
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

      {/* Export Report */}
      {report && (
        <div className={styles.exportSection}>
          <p>
            Report Generated:{" "}
            <a
              href={report.download_link}
              target="_blank"
              rel="noopener noreferrer"
            >
              Download Report
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default ReportsAnalytics;
