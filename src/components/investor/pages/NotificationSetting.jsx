import React, { useEffect, useState } from "react";
import styles from "./style/Notification.module.css";
import { showToast } from "../../../utils/toastUtils";
import { API_BASE_URL } from "../../../config";

const NotificationSettings = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [investorDetails, setInvestorDetails] = useState([]);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [emailNotification, setEmailNotification] = useState(true);
  const role = localStorage.getItem("role"); // Get role from localStorage

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}auth/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      const data = await response.json();
      console.log("Profile Data:", data);
      if (response.ok) {
        setProfile(data.profile);
        // Remove setRole since we're getting it from localStorage
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      showToast("error", "Failed to fetch profile details");
    }
  };

  const fetchInvestorDetails = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}auth/admin-investor-details?status=active`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      const data = await response.json();
      console.log("Investor Details Response:", data);

      if (response.ok) {
        setInvestorDetails(data);
        setLoading(false);
      } else {
        setError("Failed to fetch investor details");
        showToast("error", "Failed to fetch investor details");
      }
    } catch (err) {
      console.error("Error fetching investor details:", err);
      setError("Error fetching investor details");
      showToast("error", "Failed to fetch investor details");
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    fetchInvestorDetails();
  }, [role]);
  const handleEmailNotificationChange = async (e) => {
    const isChecked = e.target.checked;
    setEmailNotification(isChecked);

    if (role === "admin") {
      const requestData = {
        investor_id: "IVXJ55770", // Hardcoded investor ID for testing
        enable_notifications: isChecked,
      };
      console.log("Sending data to API:", requestData);

      try {
        const response = await fetch(`${API_BASE_URL}api/auth/preferences`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify(requestData),
        });

        const data = await response.json();
        console.log("Notification Preferences Response:", data);

        if (data.status === "success") {
          showToast("success", data.message);
          setEmailNotification(data.preferences.enable_notifications);
        } else {
          showToast("error", data.message || "Failed to update preferences");
          setEmailNotification(!isChecked);
        }
      } catch (err) {
        console.error("Error updating notification preferences:", err);
        showToast("error", "Failed to update notification preferences");
        setEmailNotification(!isChecked);
      }
    }
  };

  // Add new state for tracking investor preferences
  const [investorPreferences, setInvestorPreferences] = useState({});

  const handleInvestorNotificationChange = async (investorId, isChecked) => {
    try {
      const response = await fetch(`${API_BASE_URL}auth/preferences`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          investor_id: investorId,
          enable_notifications: isChecked,
        }),
      });

      const data = await response.json();
      console.log("Investor Preference Response:", data);

      if (data.status === "success") {
        setInvestorPreferences((prev) => ({
          ...prev,
          [investorId]: isChecked,
        }));
        showToast("success", data.message);
      } else {
        showToast("error", data.message || "Failed to update preferences");
      }
    } catch (err) {
      console.error("Error updating investor preferences:", err);
      showToast("error", "Failed to update investor preferences");
    }
  };

  return (
    <>
      <h2 className={styles.title}>Notifications</h2>
      <div className={styles.container}>
        <div className={styles.profileSection}>
          <div className={styles.contactInfo}>
            <p>
              <strong>Email:</strong> {profile.email}
            </p>
            <p>
              <strong>Mobile:</strong> {profile.phone || "Not provided"}
            </p>
          </div>
        </div>
      </div>
      {role === "admin" && (
        <div className={styles.containerTable}>
          <div className={styles.headerSection}>
            <h3 className={styles.title}>Investor Notifications</h3>
            <button
              className={styles.enableAllBtn}
              onClick={() => {
                investorDetails?.investors?.forEach((investor) => {
                  handleInvestorNotificationChange(investor.investor_id, true);
                });
                console.log("Enabling notifications for all investors");
              }}
            >
              Enable All
            </button>
          </div>
          <div className={styles.tableContainer}>
            <table>
              <thead>
                <tr>
                  <th className="py-2 px-4 text-left">Name</th>
                  <th className="py-2 px-4 text-left">Inv.ID</th>
                  <th className="py-2 px-4 text-left">Enable</th>
                </tr>
              </thead>
              <tbody>
                {investorDetails?.investors?.map((investor) => (
                  <tr key={investor.investor_id} className={styles.row}>
                    <td className="py-2 px-4 text-left">{investor.name}</td>
                    <td className="py-2 px-4 text-left">
                      {investor.investor_id}
                    </td>
                    <td className="py-2 px-4 text-left">
                      <input
                        type="checkbox"
                        checked={
                          investorPreferences[investor.investor_id] || false
                        }
                        onChange={(e) =>
                          handleInvestorNotificationChange(
                            investor.investor_id,
                            e.target.checked
                          )
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

// Add these styles to your Notification.module.css file
export default NotificationSettings;
