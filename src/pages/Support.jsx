import React, { useState, useEffect } from "react";
import { Button } from "../components/common/Button";
import { showToast } from "../utils/toastUtils";
import styles from "./style/Support.module.css";
import { CloseIcon } from "../components/common/assets";
import apiRequest from "../components/common/authApi";
import { API_BASE_URL } from "../config";

const Support = () => {
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [showTicketsOverlay, setShowTicketsOverlay] = useState(false);
  const [formData, setFormData] = useState({
    query_type: "",
    description: "",
  });

  const query_types = ["Loan Application", "Payments", "Account", "General"];

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
          showToast("error", "Please log in.");
          return;
        }

        const response = await apiRequest(
          "GET",
          `${API_BASE_URL}auth/tickets`,
          null,
          accessToken,
          setLoading
        );

        console.log("API Response:", response); // Add logging

        if (
          response.data.status === "success" &&
          Array.isArray(response.data.tickets)
        ) {
          setTickets(response.data.tickets);
        } else {
          setTickets([]);
        }
      } catch (err) {
        console.error("API Error:", err); // Add error logging
        showToast("error", "Failed to fetch tickets. Please try again later.");
      }
    };

    fetchTickets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.query_type || !formData.description) {
      showToast("error", "Please fill all fields");
      setLoading(false);
      return;
    }

    try {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        showToast("error", "Please log in.");
        return;
      }

      const requestData = {
        query_type: formData.query_type,
        description: formData.description,
      };

      console.log("Submitting ticket with data:", requestData); // Add logging

      const response = await apiRequest(
        "POST",
        `${API_BASE_URL}auth/create-ticket`,
        requestData,
        accessToken,
        setLoading
      );

      console.log("API Response:", response); // Add logging

      if (response.data) {
        setTickets([response.data, ...tickets]);
        showToast("success", "Ticket created successfully");
        setFormData({ query_type: "", description: "" });
      }
    } catch (err) {
      console.error("API Error:", err); // Add detailed error logging
      showToast("error", "Failed to create ticket. Please try again later.");
    } finally {
      setLoading(false);
    }
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
              value={formData.query_type}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, query_type: e.target.value }))
              }
              className={styles.select}
            >
              <option value="">Select Query Type</option>
              {query_types.map((type) => (
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
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
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
                {tickets.map((ticket, index) => (
                  <div
                    key={ticket._id || `ticket-${index}`}
                    className={styles.ticketCard}
                  >
                    <div className={styles.ticketHeader}>
                      <span className={styles.ticketId}>
                        #{index + 1}. {ticket.ticket_id}
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
                        <span className={styles.createdDate}>
                          Created:{" "}
                          {new Date(ticket.createdAt).toLocaleDateString()}{" "}
                          {new Date(ticket.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </span>
                        {ticket.comments && (
                          <p className={styles.comments}>
                            Comments: {ticket.comments}
                          </p>
                        )}
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
