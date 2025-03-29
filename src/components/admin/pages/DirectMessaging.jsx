import React, { useState } from "react";
import styles from "./style/DirectMessaging.module.css";
import { Button } from "../../common/Button";
import { Loader } from "../../common/Loader";

const DirectMessaging = () => {
  const [users, setUsers] = useState([
    {
      user_id: 101,
      name: "John Doe",
      email: "john@example.com",
      role: "Borrower",
    },
    {
      user_id: 102,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "Investor",
    },
    {
      user_id: 103,
      name: "Alice Johnson",
      email: "alice@example.com",
      role: "Borrower",
    },
    {
      user_id: 104,
      name: "Bob Brown",
      email: "bob@example.com",
      role: "Investor",
    },
    {
      user_id: 105,
      name: "Charlie Davis",
      email: "charlie@example.com",
      role: "Borrower",
    },
  ]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async () => {
    if (!selectedUserId || !message.trim()) {
      alert("Please select a user and enter a message");
      return;
    }

    setIsSending(true);
    try {
      const selectedUser = users.find(
        (user) => user.user_id === Number(selectedUserId)
      );
      console.log("POST /api/admin/send-message", {
        user_id: selectedUserId,
        message: message,
        email: selectedUser.email,
      });

      // Simulate API response with more detailed data
      const response = {
        status: "success",
        message: "Message sent successfully",
        timestamp: new Date().toISOString(),
        recipient: selectedUser.name,
        email: selectedUser.email,
      };
      console.log(response);

      setMessage("");
      setSelectedUserId("");
      alert(`Message sent to ${selectedUser.name} (${selectedUser.email})`);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Direct Messaging</h2>
      <div className={styles.form}>
        <div className={styles.formGroup}>
          <p className={styles.label}>Select User:</p>
          <select
            value={selectedUserId}
            className={styles.select}
            onChange={(e) => setSelectedUserId(e.target.value)}
          >
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user.user_id} value={user.user_id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <p className={styles.label}>Message:</p>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="5"
            placeholder="Enter your message..."
          />
        </div>

        <Button
          onClick={handleSendMessage}
          disabled={isSending}
          text={isSending ? "Sending..." : "Send Message"}
        />
      </div>
    </div>
  );
};

export default DirectMessaging;
