import React, { useState, useEffect, useMemo } from "react";
import styles from "./style/TicketOverview.module.css";
import { Button } from "../../common/Button";
import { Loader } from "../../common/Loader";
import { showToast } from "../../../utils/toastUtils";
import { IconBtn } from "../../common/IconBtn";
import { CheckIcon } from "../../common/assets";

const TicketOverview = () => {
  const [tickets, setTickets] = useState([]);
  const [filters, setFilters] = useState({
    status: "open",
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      console.log("GET /api/admin/tickets", filters);

      // Fake data
      const fakeData = [
        {
          ticket_id: 101,
          user_name: "John Doe",
          issue_type: "Login Issue",
          status: "open",
        },
        {
          ticket_id: 102,
          user_name: "Jane Smith",
          issue_type: "Payment Issue",
          status: "in progress",
        },
        {
          ticket_id: 103,
          user_name: "Alice Johnson",
          issue_type: "Account Issue",
          status: "closed",
        },
        {
          ticket_id: 1011,
          user_name: "John Doe",
          issue_type: "Login Issue",
          status: "open",
        },
        {
          ticket_id: 1012,
          user_name: "Jane Smith",
          issue_type: "Payment Issue",
          status: "in progress",
        },
        {
          ticket_id: 1013,
          user_name: "Alice Johnson",
          issue_type: "Account Issue",
          status: "closed",
        },
      ];

      setTickets(fakeData);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      showToast("warning", "Failed to fetch tickets");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [filters]);

  const handleStatusChange = (ticketId, newStatus) => {
    console.log(`Updating ticket ${ticketId} to status ${newStatus}`);
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.ticket_id === ticketId
          ? { ...ticket, status: newStatus }
          : ticket
      )
    );
  };

  const memoizedTable = useMemo(
    () => (
      <div className={styles.tableWrapper}>
        <div className={styles.tableContainer}>
          <table className={styles.ticketsTable}>
            <thead>
              <tr>
                <th className="py-2 px-4 text-left">Ticket ID</th>
                <th className="py-2 px-4 text-left">User Name</th>
                <th className="py-2 px-4 text-left">Issue Type</th>
                <th className="py-2 px-4 text-left">Status</th>
                <th className="py-2 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.ticket_id} className={styles.row}>
                  <td className="py-2 px-4 text-center">{ticket.ticket_id}</td>
                  <td className="py-2 px-4 text-left">{ticket.user_name}</td>
                  <td className="py-2 px-4 text-left">{ticket.issue_type}</td>
                  <td
                    className={`py-2 px-4 text-left ${styles[ticket.status]}`}
                  >
                    {ticket.status}
                  </td>
                  <td className={styles.action}>
                    <Button
                      text="View"
                      onClick={() =>
                        console.log(
                          "View details for ticket:",
                          ticket.ticket_id
                        )
                      }
                    />
                    <Button
                      text="Close"
                      onClick={() =>
                        handleStatusChange(ticket.ticket_id, "closed")
                      }
                      disabled={ticket.status === "closed"}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    ),
    [tickets, styles]
  );

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Ticket Overview</h2>
      <div className={styles.filters}>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ status: e.target.value })}
          className={styles.filterSelect}
        >
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="closed">Closed</option>
        </select>
        <div className={styles.filterButton}>
          <IconBtn onClick={fetchTickets} icon={CheckIcon} />
        </div>
      </div>
      {memoizedTable}
    </div>
  );
};

export default TicketOverview;
