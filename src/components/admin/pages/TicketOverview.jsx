import React, { useState, useEffect } from "react";
import styles from "./style/TicketOverview.module.css";

const TicketOverview = () => {
  const [tickets, setTickets] = useState([]);
  const [filters, setFilters] = useState({
    status: "open"
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
          status: "open"
        },
        {
          ticket_id: 102,
          user_name: "Jane Smith",
          issue_type: "Payment Issue",
          status: "in_progress"
        },
        {
          ticket_id: 103,
          user_name: "Alice Johnson",
          issue_type: "Account Issue",
          status: "closed"
        }
      ];
      
      setTickets(fakeData);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      alert("Failed to fetch tickets");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [filters]);

  const handleStatusChange = (ticketId, newStatus) => {
    console.log(`Updating ticket ${ticketId} to status ${newStatus}`);
    setTickets(prev => 
      prev.map(ticket => 
        ticket.ticket_id === ticketId
          ? { ...ticket, status: newStatus }
          : ticket
      )
    );
  };

  return (
    <div className={styles.container}>
      <h2>Ticket Overview</h2>
      
      <div className={styles.filters}>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ status: e.target.value })}
        >
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="closed">Closed</option>
        </select>
        <button onClick={fetchTickets} disabled={isLoading}>
          {isLoading ? "Loading..." : "Apply Filter"}
        </button>
      </div>

      <table className={styles.ticketsTable}>
        <thead>
          <tr>
            <th>Ticket ID</th>
            <th>User Name</th>
            <th>Issue Type</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.ticket_id}>
              <td>{ticket.ticket_id}</td>
              <td>{ticket.user_name}</td>
              <td>{ticket.issue_type}</td>
              <td className={styles[ticket.status]}>{ticket.status}</td>
              <td>
                <button
                  className={styles.viewButton}
                  onClick={() => console.log("View details for ticket:", ticket.ticket_id)}
                >
                  View Details
                </button>
                <button
                  className={styles.closeButton}
                  onClick={() => handleStatusChange(ticket.ticket_id, "closed")}
                  disabled={ticket.status === "closed"}
                >
                  Close Ticket
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TicketOverview;