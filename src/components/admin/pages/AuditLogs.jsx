import React, { useState, useEffect } from "react";
import styles from "./style/AuditLogs.module.css";

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState({
    user_id: "",
    date_range: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      console.log("GET /api/admin/audit-logs", filters);
      
      // Fake data
      const fakeData = [
        {
          action: "Login",
          user_id: 101,
          user_name: "John Doe",
          timestamp: "2025-01-15T10:30:00Z",
          status: "success"
        },
        {
          action: "Permission Update",
          user_id: 102,
          user_name: "Jane Smith",
          timestamp: "2025-01-16T14:15:00Z",
          status: "success"
        },
        {
          action: "Loan Approval",
          user_id: 103,
          user_name: "Alice Johnson",
          timestamp: "2025-01-17T09:45:00Z",
          status: "failed"
        }
      ];
      
      setLogs(fakeData);
    } catch (error) {
      console.error("Error fetching logs:", error);
      alert("Failed to fetch audit logs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [filters]);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className={styles.container}>
      <h2>Audit Logs</h2>
      
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="User ID"
          value={filters.user_id}
          onChange={(e) => handleFilterChange("user_id", e.target.value)}
        />
        <input
          type="text"
          placeholder="Date Range (YYYY-MM-DD to YYYY-MM-DD)"
          value={filters.date_range}
          onChange={(e) => handleFilterChange("date_range", e.target.value)}
        />
        <button onClick={fetchLogs} disabled={isLoading}>
          {isLoading ? "Loading..." : "Apply Filters"}
        </button>
      </div>

      <table className={styles.logsTable}>
        <thead>
          <tr>
            <th>Action</th>
            <th>User</th>
            <th>Timestamp</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr key={index}>
              <td>{log.action}</td>
              <td>{log.user_name} (ID: {log.user_id})</td>
              <td>{new Date(log.timestamp).toLocaleString()}</td>
              <td className={log.status === "success" ? styles.success : styles.failure}>
                {log.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuditLogs;