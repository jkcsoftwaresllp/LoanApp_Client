import React, { useState, useEffect } from "react";
import styles from "./style/AuditLogs.module.css";
import { Button } from "../../common/Button";
import { IconBtn } from "../../common/IconBtn";
import { Loader } from "../../common/Loader";
import { CheckIcon } from "../../common/assets";

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState({
    user_id: "",
    start_date: "",
    end_date: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      // Combine dates for API call
      const date_range =
        filters.start_date && filters.end_date
          ? `${filters.start_date} to ${filters.end_date}`
          : "";

      console.log("GET /api/admin/audit-logs", {
        ...filters,
        date_range,
      });

      // Fake data
      const fakeData = [
        {
          action: "Login",
          user_id: 101,
          user_name: "John Doe",
          timestamp: "2025-01-15T10:30:00Z",
          status: "success",
        },
        {
          action: "Permission Update",
          user_id: 102,
          user_name: "Jane Smith",
          timestamp: "2025-01-16T14:15:00Z",
          status: "success",
        },
        {
          action: "Loan Approval",
          user_id: 103,
          user_name: "Alice Johnson",
          timestamp: "2025-01-17T09:45:00Z",
          status: "failed",
        },
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
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Audit</h2>
      <div className={styles.filters}>
        <div className={styles.filterInput}>
          <div className={styles.dateSelector}>
            <input
              type="date"
              placeholder="Start Date"
              value={filters.start_date}
              className={styles.input}
              onChange={(e) => handleFilterChange("start_date", e.target.value)}
            />
            <input
              type="date"
              placeholder="End Date"
              value={filters.end_date}
              className={styles.input}
              onChange={(e) => handleFilterChange("end_date", e.target.value)}
            />
          </div>
          <div className={styles.userIdSelector}>
            <input
              type="text"
              placeholder="User ID"
              value={filters.user_id}
              className={styles.input}
              onChange={(e) => handleFilterChange("user_id", e.target.value)}
            />
            <IconBtn icon={<CheckIcon />} onClick={fetchLogs} />
          </div>
        </div>
      </div>
      <div className={styles.tableWrapper}>
        <div className={styles.tableContainer}>
          <table className={styles.logsTable}>
            <thead>
              <tr>
                <th className="py-2 px-4 text-left">Action</th>
                <th className="py-2 px-4 text-left">User</th>
                <th className="py-2 px-4 text-left">Timestamp</th>
                <th className="py-2 px-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <TableRow key={index} log={log} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;

const TableRow = React.memo(({ log }) => (
  <tr className={styles.row}>
    <td className="py-2 px-4 text-left">{log.action}</td>
    <td className="py-2 px-4 text-left">
      {log.user_name} (ID: {log.user_id})
    </td>
    <td className="py-2 px-4 text-left">
      {new Date(log.timestamp).toLocaleString()}
    </td>
    <td className={`py-2 px-4 text-left ${
      log.status === "success" ? styles.success : styles.failure
    }`}>
      {log.status}
    </td>
  </tr>
));
