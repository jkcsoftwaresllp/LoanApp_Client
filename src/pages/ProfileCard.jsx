import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader } from "../components/common/Loader";
import styles from "../Styles/Profile.module.css";
import { showToast } from "../utils/toastUtils";
import { LocationIcon, BankIcon } from "../components/common/assets";
import { API_BASE_URL } from "../config";

const ProfileCard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          console.error("No access token found");
          return;
        }

        const response = await fetch(`${API_BASE_URL}auth/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await response.json();

        setProfile(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const getInitials = (name) => {
    if (!name) return "U";
    const nameParts = name.trim().split(" ");
    if (nameParts.length === 1) return nameParts[0][0].toUpperCase();
    return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
  };

  return (
    <div className={styles.cardContainer}>
      {loading ? (
        <div className={styles.loading}>
          <Loader />
        </div>
      ) : (
        <div className={styles.card}>
          <div className={styles.profileHeader}>
            <div className={styles.cardImage}>
              {getInitials(profile.personalDetails?.full_name)}
            </div>
          </div>
          <h2 className={styles.profileName}>
            {profile.personalDetails?.full_name || "N/A"}
          </h2>
          <div className={styles.bankDetails}>
            <p className={styles.profileemail}>
              {profile.personalDetails?.email_id || "N/A"}
            </p>
            <p className={styles.profileemail}>
              {profile.personalDetails?.mobile_number || "N/A"}
            </p>
          </div>
          <div className={styles.bankDetails}>
            <p className={styles.profileBank}>
              <BankIcon />
              {profile.bankingInfo?.account_number || "N/A"}
            </p>
            <p className={styles.profilePincode}>
              <LocationIcon />
              {profile.personalDetails?.permanent_address || "N/A"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
