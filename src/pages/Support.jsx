import React, { useState, useEffect } from "react";
import { Button } from "../components/common/Button";
import { showToast } from "../utils/toastUtils";
import styles from "./style/Support.module.css";
import { CloseIcon } from "../components/common/assets";

const Support = () => {
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [showTicketsOverlay, setShowTicketsOverlay] = useState(false);
  const [formData, setFormData] = useState({
    queryType: "",
    description: "",
  });

  const queryTypes = [
    "Loan Application",
    "Payment Issue",
    "Account Related",
    "Technical Support",
    "Other",
  ];

  useEffect(() => {
    // Simulate fetching existing tickets
    const mockTickets = [
      {
        ticket_id: "T001",
        query_type: "Loan Application",
        description: "Unable to submit documents",
        status: "In Progress",
        created_at: "2024-02-15",
        comments: "We are reviewing your case",
      },
      {
        ticket_id: "T002",
        query_type: "Payment Issue",
        description: "EMI not reflected",
        status: "Resolved",
        created_at: "2024-02-10",
        comments: "Payment has been updated",
      },
    ];
    setTickets(mockTickets);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.queryType || !formData.description) {
      showToast("error", "Please fill all fields");
      setLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      const newTicket = {
        ticket_id: `T00${tickets.length + 1}`,
        ...formData,
        status: "Open",
        created_at: new Date().toISOString().split("T")[0],
        comments: "Ticket received",
      };
      setTickets([newTicket, ...tickets]);
      showToast("success", "Ticket created successfully");
      setFormData({ queryType: "", description: "" });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Support Center</h1>

      {/* Create Ticket Form */}
      <div className={styles.formContainer}>
        <h2>Create New Support Ticket</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Query Type</label>
            <select
              value={formData.queryType}
              onChange={(e) =>
                setFormData({ ...formData, queryType: e.target.value })
              }
              className={styles.select}
            >
              <option value="">Select Query Type</option>
              {queryTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className={styles.textarea}
              rows="4"
              placeholder="Describe your issue..."
            />
          </div>

          <Button
            type="submit"
            text={loading ? "Submitting..." : "Submit Ticket"}
            disabled={loading}
          />
        </form>
      </div>

      {/* Existing Tickets */}
      <div className={styles.ticketsButton}>
        <Button
          text={`View My Tickets (${tickets.length})`}
          onClick={() => setShowTicketsOverlay(true)}
        />
      </div>

      {/* Tickets Overlay */}
      {showTicketsOverlay && (
        <div className={styles.overlay}>
          <div className={styles.overlayContent}>
            <div className={styles.overlayHeader}>
              <h2>Your Tickets</h2>
              <button
                className={styles.closeButton}
                onClick={() => setShowTicketsOverlay(false)}
              >
                <CloseIcon />
              </button>
            </div>

            {tickets.length > 0 ? (
              <div className={styles.ticketsList}>
                {tickets.map((ticket) => (
                  <div key={ticket.ticket_id} className={styles.ticketCard}>
                    <div className={styles.ticketHeader}>
                      <span className={styles.ticketId}>
                        #{ticket.ticket_id}
                      </span>
                      <span
                        className={`${styles.status} ${
                          styles[ticket.status.toLowerCase()]
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </div>
                    <div className={styles.ticketBody}>
                      <h3>{ticket.query_type}</h3>
                      <p>{ticket.description}</p>
                      <div className={styles.ticketFooter}>
                        <span>Created: {ticket.created_at}</span>
                        <p className={styles.comments}>{ticket.comments}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.noTickets}>No tickets found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Support;
