import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./style/DirectMessaging.module.css";
import { Button } from "../../common/Button";
import { Loader } from "../../common/Loader";
import { API_BASE_URL } from "../../../config";
import { showToast } from "../../../utils/toastUtils";

export const fetchCustomers = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const response = await fetch(`${API_BASE_URL}auth/admin-getCustomers`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const { data } = await response.json();
    console.log("Customers API Response:", {
      totalCustomers: data.length,
      customers: data,
    });
    return data;
  } catch (error) {
    console.error("Error fetching customers:", error);
    showToast("Error fetching customers", "error");
    throw error;
  }
};

const DirectMessaging = () => {
  const [searchParams] = useSearchParams();
  const urlUserId = searchParams.get("userId");

  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(urlUserId || "");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleSendMessage = async () => {
    if (!selectedUserId || !message.trim()) {
      showToast("error", "Please select a user and enter a message");
      return;
    }

    setIsSending(true);
    try {
      const selectedUser = users.find(
        (user) => user.user_id === selectedUserId
      );

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Log the message details
      console.log("Sending message:", {
        to: selectedUser.name,
        userId: selectedUserId,
        message: message,
        timestamp: new Date().toISOString(),
      });

      // Clear form after successful send
      setMessage("");
      showToast("success", `Message sent to ${selectedUser.name}`);
    } catch (error) {
      console.error("Error sending message:", error);
      showToast("error", "Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const data = await fetchCustomers();
        setUsers(data);
        // If we have a userId from URL and it exists in the users list
        if (urlUserId && data.some((user) => user.user_id === urlUserId)) {
          setSelectedUserId(urlUserId);
        }
      } catch (error) {
        console.error("Failed to load customers:", error);
        showToast("error", "Failed to load customers");
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, [urlUserId]);

  return (
    <div className={styles.container}>
      {loading ? (
        <div className={styles.center}>
          <Loader />
        </div>
      ) : (
        <>
          <h2 className={styles.title}>Direct Messaging</h2>
          <div className={styles.form}>
            <div className={styles.formGroup}>
              <p className={styles.label}>Select User:</p>
              <select
                value={selectedUserId}
                className={styles.select}
                onChange={(e) => setSelectedUserId(e.target.value)}
              >
                <option key="default" value="">
                  Select a user
                </option>
                {users.map((user) => (
                  <option key={user._id} value={user.user_id}>
                    {user.user_id} ({user.email})
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
              disabled={isSending || !selectedUserId}
              text={isSending ? "Sending..." : "Send Message"}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default DirectMessaging;
