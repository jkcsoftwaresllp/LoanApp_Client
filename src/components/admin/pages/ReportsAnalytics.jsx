import React, { useState } from "react";
import styles from "./style/ReportsAnalytics.module.css";

const ReportsAnalytics = () => {
  const [filters, setFilters] = useState({
    date_range: "",
    loan_status: "",
    roi: ""
  });

  const handleGenerateReport = async () => {
    console.log("POST /api/admin/generate-report", filters);
    // Simulate API response
    const fakeResponse = {
      report_id: 501,
      download_link: "https://example.com/report.pdf"
    };
    window.open(fakeResponse.download_link, "_blank");
  };

  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Date Range (YYYY-MM-DD to YYYY-MM-DD)"
          value={filters.date_range}
          onChange={(e) => setFilters({ ...filters, date_range: e.target.value })}
        />
        <select
          value={filters.loan_status}
          onChange={(e) => setFilters({ ...filters, loan_status: e.target.value })}
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
          onChange={(e) => setFilters({ ...filters, roi: e.target.value })}
        />
        <button onClick={handleGenerateReport}>Generate Report</button>
      </div>

      <div className={styles.charts}>
        <div className={styles.chartContainer}>
          <h3>Loan Performance Trends</h3>
          {/* Chart implementation would go here */}
        </div>
        <div className={styles.chartContainer}>
          <h3>Risk Allocation</h3>
          {/* Chart implementation would go here */}
        </div>
      </div>

      <div className={styles.exportButtons}>
        <button onClick={() => console.log("Export as PDF")}>Export as PDF</button>
        <button onClick={() => console.log("Export as Excel")}>Export as Excel</button>
      </div>
    </div>
  );
};

export default ReportsAnalytics;
