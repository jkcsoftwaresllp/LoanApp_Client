import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextInput } from "../components/common/TextInput";
import { Button } from "../components/common/Button";
import { inputFieldConfig } from "../config/inputFieldConfig";
import { apiprof, mailotp, prupdate } from "../utils/Api";
import { Loader } from "../components/common/Loader";
import {
  fetchProfile,
  sendOtp,
  updateProfile,
} from "../components/helper/profileService";
import styles from "../Styles/Profile.module.css";

const ProfileCard = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: "",
    address: "",
    email: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({
    name: "",
    address: "",
    email: "",
  });
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpMessage, setOtpMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      fetchProfile(
        accessToken,
        apiprof,
        navigate,
        setLoading,
        setProfile,
        setUpdatedProfile
      );
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile({ ...updatedProfile, [name]: value });
  };

  const handleSendOtp = () => {
    const accessToken = localStorage.getItem("accessToken");
    sendOtp(
      updatedProfile.email,
      accessToken,
      mailotp,
      navigate,
      (otpSuccess) => {
        if (otpSuccess) {
          setOtpSent(true);
          setOtpMessage("OTP has been sent to your new email address.");
        } else {
          setOtpMessage("Failed to send OTP. Please try again.");
        }
      }
    );
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();

    const accessToken = localStorage.getItem("accessToken");
    const payload = {
      profile: updatedProfile,
    };

    if (updatedProfile.email !== profile.email) {
      payload.email = updatedProfile.email;
      payload.otp = otp;
    }

    updateProfile(
      payload,
      accessToken,
      prupdate,
      navigate,
      setProfile,
      setIsEditing,
      setOtp,
      setOtpSent
    );
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
            <img
              src="https://png.pngtree.com/png-vector/20231019/ourmid/pngtree-user-profile-avatar-png-image_10211467.png"
              alt="Profile"
              className={styles.cardImage}
            />
          </div>
          <h2 className={styles.profileName}>{profile.name || "N/A"}</h2>
          <p className={styles.profileemail}>{profile.email || "N/A"}</p>
          <p className={styles.profileLocation}>{profile.address || "N/A"}</p>
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
