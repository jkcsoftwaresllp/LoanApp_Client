import React, { useState } from "react";
import styles from "./style/ReportsAnalytics.module.css";
import { Loader } from "../../common/Loader";
import { Button } from "../../common/Button";
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
  Legend // Add this import
} from "recharts";

const ReportsAnalytics = () => {
  const [filters, setFilters] = useState({
    date_range: "",
    loan_status: "",
    roi: "",
  });

  const handleGenerateReport = async () => {
    console.log("POST /api/admin/generate-report", filters);
    // Simulate API response
    const fakeResponse = {
      report_id: 501,
      download_link: "https://example.com/report.pdf",
    };
    window.open(fakeResponse.download_link, "_blank");
  };

  // Sample data for charts
  const loanTrendData = [
    { month: "Jan", loans: 120 },
    { month: "Feb", loans: 150 },
    { month: "Mar", loans: 200 },
    { month: "Apr", loans: 180 },
    { month: "May", loans: 250 },
    { month: "Jun", loans: 300 },
  ];

  const riskAllocationData = [
    { name: "Low Risk", value: 40 },
    { name: "Medium Risk", value: 35 },
    { name: "High Risk", value: 25 },
  ];
  const colors = ["#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Reports and Analytics</h2>
      <div className={styles.filters}>
        <div className={styles.filterGrid}>
          <input
            type="date"
            placeholder="Start Date"
            value={filters.start_date}
            className={styles.input}
            onChange={(e) =>
              setFilters({ ...filters, start_date: e.target.value })
            }
          />
          <input
            type="date"
            placeholder="End Date"
            value={filters.end_date}
            className={styles.input}
            onChange={(e) =>
              setFilters({ ...filters, end_date: e.target.value })
            }
          />
          <select
            value={filters.loan_status}
            className={styles.input}
            onChange={(e) =>
              setFilters({ ...filters, loan_status: e.target.value })
            }
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="defaulted">Defaulted</option>
          </select>
          <input
            type="number"
            placeholder="Minimum ROI (%)"
            value={filters.roi}
            className={styles.input}
            onChange={(e) => setFilters({ ...filters, roi: e.target.value })}
          />
        </div>
      </div>

      <div className={styles.charts}>
        <div className={styles.chartContainer}>
          <h3>Loan Performance Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={loanTrendData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend /> {/* Add this line */}
              <Line 
                type="monotone" 
                dataKey="loans" 
                stroke="#8884d8" 
                strokeWidth={2}
                name="Number of Loans" // Add this line
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.chartContainer}>
          <h3>Risk Allocation</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={riskAllocationData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={60}
                label
              >
                {riskAllocationData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend /> {/* Add this line */}
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={styles.exportButtons}>
        <button onClick={() => console.log("Export as PDF")}>
          Export as PDF
        </button>
        <button onClick={() => console.log("Export as Excel")}>
          Export as Excel
        </button>
      </div>
    </div>
  );
};

export default ReportsAnalytics;
